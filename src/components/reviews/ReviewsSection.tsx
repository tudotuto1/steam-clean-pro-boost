import { useCallback, useEffect, useState } from "react";
import { Loader2, Star, BadgeCheck } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useI18n, useT, formatDate, type Lang } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "./ReviewForm";

interface Review {
  id: string;
  rating: number | null;
  title: string | null;
  body: string | null;
  image_paths: string[] | null;
  author_label: string | null;
  created_at: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${
            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const t = useT();
  const { lang } = useI18n();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load reviews:", error.message);
      setReviews([]);
      return;
    }
    const list = (data ?? []) as Review[];
    setReviews(list);

    // Private bucket → resolve photos through signed URLs.
    const allPaths = list.flatMap((r) => r.image_paths ?? []);
    if (allPaths.length > 0) {
      const { data: signed, error: signError } = await supabase.storage
        .from("review-images")
        .createSignedUrls(allPaths, 3600);
      if (signError) {
        console.error("Failed to sign review images:", signError.message);
        return;
      }
      const map: Record<string, string> = {};
      for (const item of signed ?? []) {
        if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
      }
      setSignedUrls(map);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section id="avis" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            {t("reviews.kicker")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            {t("reviews.title")}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {t("reviews.subtitle")}
          </p>
        </div>

        <div className="mb-12">
          <ReviewForm onSubmitted={() => void load()} />
        </div>

        {reviews === null ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            {t("reviews.empty")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                signedUrls={signedUrls}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  signedUrls,
  lang,
  t,
}: {
  review: Review;
  signedUrls: Record<string, string>;
  lang: Lang;
  t: ReturnType<typeof useT>;
}) {
  const photos = (review.image_paths ?? [])
    .map((p) => signedUrls[p])
    .filter(Boolean);

  return (
    <article className="p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating ?? 0} />
        <Badge
          variant="outline"
          className="bg-success/10 text-success border-success/20 gap-1"
        >
          <BadgeCheck className="h-3.5 w-3.5" />
          {t("reviews.verified")}
        </Badge>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {review.author_label ?? t("reviews.verifiedCustomer")}
        </span>
        <span>·</span>
        <span>{formatDate(review.created_at, lang)}</span>
      </div>

      {review.title && (
        <h3 className="mt-3 font-semibold text-sm">{review.title}</h3>
      )}
      {review.body && (
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {review.body}
        </p>
      )}

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-20 w-20 rounded-lg overflow-hidden border border-border"
            >
              <img
                src={url}
                alt={`${t("reviews.photoAlt")} ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
