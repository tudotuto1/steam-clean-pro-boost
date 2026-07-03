import process from "node:process";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only admin helpers (.server.ts: never bundled for the browser).
// - requireAdmin(request): validates the Bearer token with Supabase, then
//   checks the verified email against ADMIN_EMAILS (comma-separated,
//   case-insensitive, server-only env var). Every admin route MUST call it
//   first and return the error Response as-is when not ok.
// - getServiceClient(): service_role client — bypasses RLS, so it must only
//   be used AFTER requireAdmin succeeded.

export type AdminCheck =
  | { ok: true; userId: string; email: string }
  | { ok: false; response: Response };

export async function requireAdmin(request: Request): Promise<AdminCheck> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!supabaseUrl || !supabaseAnonKey || adminEmails.length === 0) {
    console.error("Admin auth is not configured (env missing)");
    return {
      ok: false,
      response: Response.json({ error: "Admin non configuré." }, { status: 500 }),
    };
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!token) {
    return {
      ok: false,
      response: Response.json({ error: "Connexion requise." }, { status: 401 }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return {
      ok: false,
      response: Response.json(
        { error: "Session invalide. Reconnectez-vous." },
        { status: 401 },
      ),
    };
  }

  const email = (data.user.email ?? "").toLowerCase();
  if (!email || !adminEmails.includes(email)) {
    return {
      ok: false,
      response: Response.json({ error: "Accès refusé." }, { status: 403 }),
    };
  }

  return { ok: true, userId: data.user.id, email };
}

export function getServiceClient(): SupabaseClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service credentials are not configured");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
