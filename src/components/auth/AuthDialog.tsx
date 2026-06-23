import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Map a Supabase error message to a translation key (or null to show raw).
function errorKey(message: string): TKey | null {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "auth.err.invalid";
  if (m.includes("email not confirmed")) return "auth.err.notConfirmed";
  if (m.includes("user already registered") || m.includes("already registered"))
    return "auth.err.alreadyUsed";
  if (m.includes("password should be at least")) return "auth.err.weakPassword";
  return null;
}

export function AuthDialog({ open, onClose }: Props) {
  const t = useT();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setInfo(null);
  };

  const showError = (message: string) => {
    const key = errorKey(message);
    setError(key ? t(key) : message);
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        showError(error.message);
        return;
      }
      // onAuthStateChange closes the dialog on success.
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showError(error.message);
        return;
      }
      // Supabase returns a user with an empty identities array when the
      // email is already registered (without leaking it as an error).
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError(t("auth.err.alreadyUsed"));
        return;
      }
      if (!data.session) {
        setInfo(t("auth.signupConfirm"));
        return;
      }
      // Session present (email confirmation disabled) → dialog closes via listener.
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    reset();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) showError(error.message);
      // On success the browser is redirected to Google.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t("auth.title")}</DialogTitle>
          <DialogDescription>{t("auth.description")}</DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogle}
          disabled={loading}
        >
          <GoogleIcon />
          {t("auth.google")}
        </Button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">{t("auth.or")}</span>
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            reset();
            setTab(v as "signin" | "signup");
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t("auth.tabSignin")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.tabSignup")}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-3 pt-2">
              <Field
                id="signin-email"
                label={t("auth.email")}
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                id="signin-password"
                label={t("auth.password")}
                type="password"
                value={password}
                onChange={setPassword}
              />
              <SubmitButton loading={loading}>{t("auth.signInBtn")}</SubmitButton>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-3 pt-2">
              <Field
                id="signup-email"
                label={t("auth.email")}
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                id="signup-password"
                label={t("auth.password")}
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <SubmitButton loading={loading}>{t("auth.signUpBtn")}</SubmitButton>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-success" role="status">
            {info}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
      />
    </div>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
