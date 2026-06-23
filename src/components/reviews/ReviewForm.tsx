import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Star, Upload, X } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ELIGIBLE_STATUSES = ["paid", "fulfilled", "shipped", "delivered"];
const MAX_PHOTOS = 3;
const MAX_SIZE = 5 * 1024 * 1024; // ~5 Mo

interface Props {
  onSubmitted?: () => void;
}

export function ReviewForm({ onSubmitted }: Props) {
  const { user, session, loading: authLoading, openAuthDialog } = useAuth();
  const t = useT();

  const [eligibility, setEligibility] = useState<
    "checking" | "eligible" | "ineligible"
  >("checking");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Eligibility: the user must have at least one paid (or later) order.
  useEffect(() => {
    if (!session) {
      setEligibility("checking");
      return;
    }
    let active = true;
    setEligibility("checking");
    supabase
      .from("orders")
      .select("id,status")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Failed to check eligibility:", error.message);
          setEligibility("ineligible");
          return;
        }
        const eligible = (data ?? []).find(
          (o: { id: string; status: string | null }) =>
            o.status != null && ELIGIBLE_STATUSES.includes(o.status),
        );
        if (eligible) {
          setOrderId(eligible.id);
          setEligibility("eligible");
        } else {
          setEligibility("ineligible");
        }
      });
    return () => {
      active = false;
    };
  }, [session]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center">
        <Button onClick={openAuthDialog} variant="outline">
          {t("reviewForm.signInCta")}
        </Button>
      </div>
    );
  }

  if (eligibility === "checking") {
    return (
      <div className="flex justify-center py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (eligibility === "ineligible") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        {t("reviewForm.ineligible")}
      </p>
    );
  }

  if (!open) {
    return (
      <div className="text-center">
        <Button onClick={() => setOpen(true)}>{t("reviewForm.openButton")}</Button>
      </div>
    );
  }

  return (
    <ReviewFormFields
      userId={user!.id}
      orderId={orderId!}
      onCancel={() => setOpen(false)}
      onSubmitted={() => {
        setOpen(false);
        onSubmitted?.();
      }}
    />
  );
}

function ReviewFormFields({
  userId,
  orderId,
  onCancel,
  onSubmitted,
}: {
  userId: string;
  orderId: string;
  onCancel: () => void;
  onSubmitted: () => void;
}) {
  const t = useT();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFiles = (list: FileList | null) => {
    setError(null);
    if (!list) return;
    const picked = Array.from(list);
    if (picked.length + files.length > MAX_PHOTOS) {
      setError(t("reviewForm.errMaxPhotos"));
      return;
    }
    for (const f of picked) {
      if (f.size > MAX_SIZE) {
        setError(`${t("reviewForm.errSize")} (${f.name})`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_PHOTOS));
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1 || rating > 5) {
      setError(t("reviewForm.errRating"));
      return;
    }
    if (!body.trim()) {
      setError(t("reviewForm.errComment"));
      return;
    }
    setSubmitting(true);
    try {
      // a) Upload each photo under `${userId}/...` (required by storage RLS).
      const imagePaths: string[] = [];
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const path = `${userId}/${crypto.randomUUID()}.${ext || "jpg"}`;
        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(path, file, { contentType: file.type || undefined });
        if (uploadError) {
          throw new Error(`${t("reviewForm.errUpload")} : ${uploadError.message}`);
        }
        imagePaths.push(path);
      }

      // b) Insert the review. status & author_label are set by the database.
      const { error: insertError } = await supabase.from("reviews").insert({
        rating,
        title: title.trim() || null,
        body: body.trim(),
        image_paths: imagePaths,
        order_id: orderId,
        user_id: userId,
      });
      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      setRating(0);
      setTitle("");
      setBody("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("reviewForm.errGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="font-semibold text-success">{t("reviewForm.success")}</p>
        <div className="mt-4">
          <Button variant="outline" onClick={onSubmitted}>
            {t("reviewForm.close")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 space-y-4"
    >
      <div className="space-y-1.5">
        <Label>{t("reviewForm.ratingLabel")}</Label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label={t("reviewForm.ratingAria")}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} ${t("reviewForm.stars")}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  (hover || rating) >= n
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-title">{t("reviewForm.titleLabel")}</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder={t("reviewForm.titlePlaceholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-body">{t("reviewForm.commentLabel")}</Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          placeholder={t("reviewForm.commentPlaceholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-photos">{t("reviewForm.photosLabel")}</Label>
        <label
          htmlFor="review-photos"
          className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary transition-colors"
        >
          <Upload className="h-4 w-4" />
          {t("reviewForm.addPhotos")}
        </label>
        <input
          id="review-photos"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {files.map((f, i) => (
              <div
                key={i}
                className="relative h-16 w-16 rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={t("reviewForm.removeAria")}
                  className="absolute top-0.5 right-0.5 h-5 w-5 grid place-items-center rounded-full bg-foreground/70 text-background"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("reviewForm.submit")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          {t("reviewForm.cancel")}
        </Button>
      </div>
    </form>
  );
}
