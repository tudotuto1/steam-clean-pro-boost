import { useState } from "react";
import { Play } from "lucide-react";
import mainImg from "@/assets/product-main.jpeg";
import usesImg from "@/assets/product-uses.jpeg";
import featuresImg from "@/assets/product-features.jpeg";
import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const imageData: { src: string; altKey: TKey }[] = [
  { src: mainImg, altKey: "gallery.alt.main" },
  { src: usesImg, altKey: "gallery.alt.uses" },
  { src: featuresImg, altKey: "gallery.alt.features" },
];

type Selection = { kind: "image"; index: number } | { kind: "video" };

// Thumbnail order: main image, then the video (2nd — most visible), then the
// two remaining product images.
const thumbs: Selection[] = [
  { kind: "image", index: 0 },
  { kind: "video" },
  { kind: "image", index: 1 },
  { kind: "image", index: 2 },
];

export function HeroGallery() {
  const t = useT();
  const [selected, setSelected] = useState<Selection>({ kind: "image", index: 0 });
  const isVideo = selected.kind === "video";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-3xl bg-gradient-soft overflow-hidden shadow-elevated border border-border/60">
        {isVideo ? (
          // Only mounted (and autoplayed) when the video thumbnail is selected;
          // unmounting when switching back to an image stops playback. The
          // video is only fetched on demand (preload="none").
          <video
            src="/demo.mp4"
            muted
            loop
            playsInline
            controls
            autoPlay
            preload="none"
            className="w-full h-full object-contain bg-gradient-soft"
          />
        ) : (
          <img
            key={selected.index}
            src={imageData[selected.index].src}
            alt={t(imageData[selected.index].altKey)}
            className="w-full h-full object-contain p-4 animate-float-in"
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {thumbs.map((thumb, i) => {
          if (thumb.kind === "video") {
            return (
              <button
                key={i}
                onClick={() => setSelected({ kind: "video" })}
                aria-label={t("hero.gallery.videoThumbAlt")}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-gradient-soft transition-all ${
                  isVideo
                    ? "border-primary shadow-soft scale-[0.98]"
                    : "border-border opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={mainImg}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain p-1"
                />
                <span className="absolute inset-0 bg-foreground/40 grid place-items-center">
                  <span className="h-8 w-8 rounded-full bg-background/90 grid place-items-center shadow-soft">
                    <Play className="h-4 w-4 text-primary fill-primary" />
                  </span>
                </span>
                <span className="absolute bottom-1 inset-x-1 text-[9px] font-semibold text-background text-center leading-tight drop-shadow">
                  {t("hero.gallery.videoLabel")}
                </span>
              </button>
            );
          }

          const activeThumb = !isVideo && selected.index === thumb.index;
          return (
            <button
              key={i}
              onClick={() => setSelected({ kind: "image", index: thumb.index })}
              aria-label={`${t("gallery.viewImage")} ${thumb.index + 1}`}
              className={`aspect-square rounded-xl overflow-hidden border-2 bg-gradient-soft transition-all ${
                activeThumb
                  ? "border-primary shadow-soft scale-[0.98]"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imageData[thumb.index].src}
                alt={t(imageData[thumb.index].altKey)}
                loading="lazy"
                className="w-full h-full object-contain p-1"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
