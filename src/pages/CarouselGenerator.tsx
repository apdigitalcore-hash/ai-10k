import { useRef, useState } from "react";
import { Download, ImageIcon, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlideProps {
  type: "hook" | "point" | "cta";
  index?: number;
  text: string;
  handle: string;
  watermark?: boolean;
}

// ─── Slide renderer (DOM div — used both for preview and PNG capture) ─────────

function SlideView({ type, index, text, handle }: SlideProps) {
  if (type === "cta") {
    return (
      <div
        style={{ width: 180, height: 225, background: "hsl(var(--coral))" }}
        className="relative rounded-xl flex flex-col items-center justify-center p-5 select-none overflow-hidden"
      >
        <p className="text-white font-black text-center text-sm leading-snug">{text || "Save this. Follow @apdigital. Link in bio."}</p>
        <p
          style={{ bottom: 8, right: 10 }}
          className="absolute text-white/60 text-[9px] font-bold"
        >
          {handle || "@apdigital"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 180,
        height: 225,
        background: "linear-gradient(135deg, hsl(var(--navy-deep)) 0%, hsl(var(--navy)) 100%)",
        borderTop: type === "hook" ? "4px solid hsl(var(--gold))" : undefined,
      }}
      className="relative rounded-xl flex flex-col justify-center p-5 select-none overflow-hidden"
    >
      {type === "point" && index != null && (
        <p
          style={{ color: "hsl(var(--coral))" }}
          className="font-black text-4xl leading-none mb-2"
        >
          {index}
        </p>
      )}
      <p className="text-white font-bold text-sm leading-snug break-words">
        {text || (type === "hook" ? "Your hook goes here" : `Point ${index ?? ""} goes here`)}
      </p>
      <p
        style={{ bottom: 8, right: 10, color: "hsl(var(--gold)/0.6)" }}
        className="absolute text-[9px] font-bold"
      >
        AP Digital
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const CarouselGenerator = () => {
  const [hook, setHook] = useState("");
  const [points, setPoints] = useState<string[]>(["", "", "", "", ""]);
  const [ctaText, setCtaText] = useState("Save this. Follow @apdigital. Link in bio.");
  const [handle, setHandle] = useState("@apdigital");
  const [previewed, setPreviewed] = useState(false);

  // Refs for each slide (for PNG download)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const slides: Array<{ id: string; label: string; type: "hook" | "point" | "cta"; text: string; index?: number }> = [
    { id: "slide-1", label: "Slide 1 — Hook", type: "hook", text: hook },
    ...points.map((p, i) => ({
      id: `slide-${i + 2}`,
      label: `Slide ${i + 2} — Point ${i + 1}`,
      type: "point" as const,
      text: p,
      index: i + 1,
    })),
    { id: "slide-7", label: "Slide 7 — CTA", type: "cta", text: ctaText },
  ];

  const downloadSlide = async (idx: number) => {
    const el = slideRefs.current[idx];
    if (!el) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, { pixelRatio: 6 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `carousel-slide-${idx + 1}.png`;
      a.click();
    } catch {
      alert(
        "PNG export requires the html-to-image package. For now, right-click the slide preview and choose 'Save image as' or use a browser screenshot."
      );
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < slides.length; i++) {
      await downloadSlide(i);
    }
  };

  const updatePoint = (i: number, val: string) => {
    setPoints((prev) => prev.map((p, idx) => (idx === i ? val : p)));
  };

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur border-b border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-coral text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          AP Digital
        </a>
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-cream/50 font-medium">Carousel Generator</span>
          <button
            type="button"
            onClick={downloadAll}
            disabled={!previewed}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 text-cream/70 px-3 py-1.5 text-xs font-bold hover:border-white/40 hover:text-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            Download All
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-coral font-bold tracking-[0.2em] text-xs">TOOLS</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black">Instagram Carousel Generator</h1>
          <p className="mt-3 text-sm text-cream/60">
            Fill in your content, preview all 7 slides, then download each as a PNG.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT — INPUT FORM */}
          <div className="w-full lg:w-[40%] bg-white/5 border border-white/10 rounded-2xl p-6 flex-shrink-0">
            <h2 className="text-base font-extrabold mb-5">Content</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wide text-cream/60 mb-1.5">
                  Hook / Title
                </label>
                <input
                  type="text"
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="e.g. 5 AI prompts that save 10 hours/week"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/40"
                />
              </div>

              {points.map((p, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold tracking-wide text-cream/60 mb-1.5">
                    Point {i + 1}
                  </label>
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updatePoint(i, e.target.value)}
                    placeholder={`Point ${i + 1}...`}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/40"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold tracking-wide text-cream/60 mb-1.5">
                  CTA Text
                </label>
                <textarea
                  rows={2}
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wide text-cream/60 mb-1.5">
                  Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@apdigital"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/40"
                />
              </div>

              <button
                type="button"
                onClick={() => setPreviewed(true)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gold text-navy font-extrabold text-sm px-6 py-3.5 hover:-translate-y-0.5 transition-transform duration-200 shadow-[0_10px_25px_-8px_hsl(var(--gold)/0.55)]"
              >
                <ImageIcon className="h-4 w-4" />
                Preview Slides &rarr;
              </button>
            </div>
          </div>

          {/* RIGHT — PREVIEWS */}
          <div className="w-full lg:w-[60%]">
            {previewed ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className="flex flex-col items-center gap-3">
                    <div
                      ref={(el) => {
                        slideRefs.current[idx] = el;
                      }}
                      className="flex-shrink-0"
                    >
                      <SlideView
                        type={slide.type}
                        index={slide.index}
                        text={slide.text}
                        handle={handle}
                      />
                    </div>
                    <p className="text-[10px] text-cream/40 text-center font-medium leading-tight">
                      {slide.label}
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadSlide(idx)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 text-cream/60 px-3 py-1.5 text-[11px] font-bold hover:border-white/40 hover:text-cream transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      PNG
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div
                      style={{ width: 180, height: 225 }}
                      className="rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-2 bg-white/3"
                    >
                      <ImageIcon className="h-7 w-7 text-cream/20" />
                      <p className="text-[10px] text-cream/20 font-medium">
                        Slide {i + 1}
                      </p>
                    </div>
                    <p className="text-[10px] text-cream/20 text-center font-medium">
                      Preview will appear here
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-navy-deep text-cream/70 px-5 sm:px-8 py-10 text-center text-sm mt-12">
        © {new Date().getFullYear()} AP Digital · support@apdigital.co
      </footer>
    </div>
  );
};

export default CarouselGenerator;
