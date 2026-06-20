import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "./supabase";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** Open the sign-in / sign-up modal. */
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      // Close the modal automatically once the user is signed in.
      if (nextSession) setDialogOpen(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const openAuthDialog = useCallback(() => setDialogOpen(true), []);
  const closeAuthDialog = useCallback(() => setDialogOpen(false), []);
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      openAuthDialog,
      closeAuthDialog,
      signOut,
    }),
    [session, loading, openAuthDialog, closeAuthDialog, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialog open={dialogOpen} onClose={closeAuthDialog} />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
