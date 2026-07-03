import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin } from "@/lib/admin.server";

// GET /api/admin/me — 200 {isAdmin:true} for admins, 401/403 otherwise.
export const Route = createFileRoute("/api/admin/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;
        return Response.json({ isAdmin: true });
      },
    },
  },
});
