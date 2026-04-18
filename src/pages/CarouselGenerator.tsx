import { useRef, useState } from "react";
import { Download, ImageIcon, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SlideType = "hook" | "point" | "cta";

interface Slide {
  id: string;
  label: string;
  type: SlideType;
  text: string;
  index?: number;
}

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const NAVY      = "#1A1A2E";
const NAVY_DEEP = "#0F0F1E";
const CORAL     = "#E94560";
const GOLD      = "#F3A712";
const WHITE     = "#FFFFFF";

// Canvas dimensions (1080×1350 = Instagram 4:5)
const W = 1080;
const H = 1350;

// ─── Canvas renderer ─────────────────────────────────────────────────────────

function drawSlide(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  handle: string
) {
  ctx.clearRect(0, 0, W, H);

  if (slide.type === "cta") {
    // Coral background
    ctx.fillStyle = CORAL;
    ctx.fillRect(0, 0, W, H);

    // CTA text
    ctx.fillStyle = WHITE;
    ctx.font = "bold 72px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapText(ctx, slide.text || "Save this. Follow @apdigital. Link in bio.", W / 2, H / 2, W - 120, 90);

    // Watermark
    ctx.font = "bold 36px Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(handle || "@apdigital", W - 48, H - 48);
    return;
  }

  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, NAVY_DEEP);
  grad.addColorStop(1, NAVY);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (slide.type === "hook") {
    // Gold top bar
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, 0, W, 12);

    // Hook text centred
    ctx.fillStyle = WHITE;
    ctx.font = "900 80px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapText(ctx, slide.text || "Your hook goes here", W / 2, H / 2, W - 120, 100);
  } else {
    // Point number
    ctx.font = "900 180px Inter, Arial, sans-serif";
    ctx.fillStyle = CORAL;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(String(slide.index ?? ""), 72, 80);

    // Divider line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 290);
    ctx.lineTo(W - 72, 290);
    ctx.stroke();

    // Point text
    ctx.fillStyle = WHITE;
    ctx.font = "bold 72px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    wrapText(ctx, slide.text || `Point ${slide.index ?? ""} goes here`, 72, 340, W - 144, 90);
  }

  // Watermark bottom-right
  ctx.font = "bold 32px Inter, Arial, sans-serif";
  ctx.fillStyle = `${GOLD}99`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("AP Digital", W - 48, H - 48);
}

// Multi-line text wrap helper
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const totalHeight = lines.length * lineHeight;
  let startY = y - totalHeight / 2;

  // For left-aligned text (points), don't vertically centre
  if (ctx.textAlign === "left") {
    startY = y;
  }

  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight);
  });
}

// ─── Preview slide (DOM — shows scaled-down visual) ──────────────────────────

function SlidePreview({
  slide,
  handle,
}: {
  slide: Slide;
  handle: string;
}) {
  if (slide.type === "cta") {
    return (
      <div
        style={{ width: 180, height: 225, background: CORAL }}
        className="relative rounded-xl flex flex-col items-center justify-center p-4 select-none overflow-hidden"
      >
        <p className="text-white font-black text-center text-[11px] leading-snug">
          {slide.text || "Save this. Follow @apdigital. Link in bio."}
        </p>
        <p className="absolute bottom-2 right-2 text-white/50 text-[8px] font-bold">
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
        background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)`,
        borderTop: slide.type === "hook" ? `3px solid ${GOLD}` : undefined,
      }}
      className="relative rounded-xl flex flex-col justify-center p-4 select-none overflow-hidden"
    >
      {slide.type === "point" && slide.index != null && (
        <p style={{ color: CORAL }} className="font-black text-4xl leading-none mb-1">
          {slide.index}
        </p>
      )}
      <p className="text-white font-bold text-[11px] leading-snug break-words">
        {slide.text || (slide.type === "hook" ? "Your hook goes here" : `Point ${slide.index ?? ""} goes here`)}
      </p>
      <p style={{ color: `${GOLD}99` }} className="absolute bottom-2 right-2 text-[8px] font-bold">
        AP Digital
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CarouselGenerator = () => {
  const [hook, setHook]       = useState("");
  const [points, setPoints]   = useState<string[]>(["", "", "", "", ""]);
  const [ctaText, setCtaText] = useState("Save this. Follow @apdigital. Link in bio.");
  const [handle, setHandle]   = useState("@apdigital");
  const [previewed, setPreviewed] = useState(false);

  // Hidden canvas for PNG export
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const slides: Slide[] = [
    { id: "slide-1", label: "Slide 1 — Hook",  type: "hook",  text: hook },
    ...points.map((p, i) => ({
      id: `slide-${i + 2}`,
      label: `Slide ${i + 2} — Point ${i + 1}`,
      type: "point" as const,
      text: p,
      index: i + 1,
    })),
    { id: "slide-7", label: "Slide 7 — CTA", type: "cta", text: ctaText },
  ];

  const downloadSlide = (slide: Slide) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSlide(ctx, slide, handle);
    const a = document.createElement("a");
    a.href     = canvas.toDataURL("image/png");
    a.download = `${slide.id}.png`;
    a.click();
  };

  const downloadAll = () => {
    slides.forEach((slide) => downloadSlide(slide));
  };

  const updatePoint = (i: number, val: string) =>
    setPoints((prev) => prev.map((p, idx) => (idx === i ? val : p)));

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Hidden canvas used only for PNG export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

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
            Fill in your content, preview all 7 slides, then download each as a 1080×1350 PNG.
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
                Preview Slides →
              </button>
            </div>
          </div>

          {/* RIGHT — PREVIEWS */}
          <div className="w-full lg:w-[60%]">
            {previewed ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {slides.map((slide) => (
                  <div key={slide.id} className="flex flex-col items-center gap-3">
                    <SlidePreview slide={slide} handle={handle} />
                    <p className="text-[10px] text-cream/40 text-center font-medium leading-tight">
                      {slide.label}
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadSlide(slide)}
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
                      className="rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-2"
                    >
                      <ImageIcon className="h-7 w-7 text-cream/20" />
                      <p className="text-[10px] text-cream/20 font-medium">Slide {i + 1}</p>
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
        © {new Date().getFullYear()} AP Digital · apdigital.core@gmail.com
      </footer>
    </div>
  );
};

export default CarouselGenerator;
