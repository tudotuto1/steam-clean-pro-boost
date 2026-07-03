import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, getServiceClient } from "@/lib/admin.server";

// GET /api/admin/orders — every order, all fields (incl. shipping_address).
export const Route = createFileRoute("/api/admin/orders/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        const supabase = getServiceClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("admin orders list failed:", error.message);
          return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({ orders: data ?? [] });
      },
    },
  },
});
