import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, getServiceClient } from "@/lib/admin.server";

// GET /api/admin/reviews — every review (all statuses) with a signed URL per
// photo so the moderator can preview images before approving.
export const Route = createFileRoute("/api/admin/reviews/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        const supabase = getServiceClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("admin reviews list failed:", error.message);
          return Response.json({ error: error.message }, { status: 500 });
        }

        const reviews = (data ?? []) as Array<{
          image_paths: string[] | null;
          [k: string]: unknown;
        }>;

        // Sign all photo paths in one batch (1h expiry).
        const allPaths = reviews.flatMap((r) => r.image_paths ?? []);
        const urlByPath: Record<string, string> = {};
        if (allPaths.length > 0) {
          const { data: signed, error: signError } = await supabase.storage
            .from("review-images")
            .createSignedUrls(allPaths, 3600);
          if (signError) {
            console.error("admin sign urls failed:", signError.message);
          }
          for (const item of signed ?? []) {
            if (item.path && item.signedUrl) urlByPath[item.path] = item.signedUrl;
          }
        }

        const withUrls = reviews.map((r) => ({
          ...r,
          image_urls: (r.image_paths ?? [])
            .map((p) => urlByPath[p])
            .filter(Boolean),
        }));

        return Response.json({ reviews: withUrls });
      },
    },
  },
});
