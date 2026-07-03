import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, getServiceClient } from "@/lib/admin.server";

// POST /api/admin/reviews/action {id, action: 'approve' | 'reject' | 'delete'}
export const Route = createFileRoute("/api/admin/reviews/action")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        let id = "";
        let action = "";
        try {
          const body = (await request.json()) as { id?: unknown; action?: unknown };
          id = typeof body.id === "string" ? body.id : "";
          action = typeof body.action === "string" ? body.action : "";
        } catch {
          // invalid body
        }
        if (!id || !["approve", "reject", "delete"].includes(action)) {
          return Response.json({ error: "Requête invalide." }, { status: 400 });
        }

        const supabase = getServiceClient();

        if (action === "delete") {
          // Remove the photos from the bucket, then the row.
          const { data: row, error: fetchError } = await supabase
            .from("reviews")
            .select("image_paths")
            .eq("id", id)
            .maybeSingle();
          if (fetchError) {
            console.error("admin review fetch failed:", fetchError.message);
            return Response.json({ error: fetchError.message }, { status: 500 });
          }
          const paths = (row?.image_paths ?? []) as string[];
          if (paths.length > 0) {
            const { error: removeError } = await supabase.storage
              .from("review-images")
              .remove(paths);
            if (removeError) {
              // Log but keep going: the row removal matters most.
              console.error("admin review images removal failed:", removeError.message);
            }
          }
          const { error: deleteError } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id);
          if (deleteError) {
            console.error("admin review delete failed:", deleteError.message);
            return Response.json({ error: deleteError.message }, { status: 500 });
          }
          return Response.json({ ok: true });
        }

        const status = action === "approve" ? "approved" : "rejected";
        const { error: updateError } = await supabase
          .from("reviews")
          .update({ status })
          .eq("id", id);
        if (updateError) {
          console.error("admin review update failed:", updateError.message);
          return Response.json({ error: updateError.message }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
