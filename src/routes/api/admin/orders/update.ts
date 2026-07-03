import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, getServiceClient } from "@/lib/admin.server";

const ALLOWED_STATUSES = [
  "paid",
  "fulfilled",
  "shipped",
  "delivered",
  "refunded",
  "cancelled",
];

// POST /api/admin/orders/update
// {id, status?, tracking_carrier?, tracking_number?, tracking_url?}
export const Route = createFileRoute("/api/admin/orders/update")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        let body: {
          id?: unknown;
          status?: unknown;
          tracking_carrier?: unknown;
          tracking_number?: unknown;
          tracking_url?: unknown;
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          // invalid body
        }
        const id = typeof body.id === "string" ? body.id : "";
        if (!id) {
          return Response.json({ error: "Requête invalide." }, { status: 400 });
        }

        const update: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        if (typeof body.status === "string") {
          if (!ALLOWED_STATUSES.includes(body.status)) {
            return Response.json({ error: "Statut invalide." }, { status: 400 });
          }
          update.status = body.status;
        }
        for (const field of [
          "tracking_carrier",
          "tracking_number",
          "tracking_url",
        ] as const) {
          const value = body[field];
          if (typeof value === "string") {
            update[field] = value.trim() || null;
          }
        }

        const supabase = getServiceClient();
        const { error } = await supabase.from("orders").update(update).eq("id", id);
        if (error) {
          console.error("admin order update failed:", error.message);
          return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
