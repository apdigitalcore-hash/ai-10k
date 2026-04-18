import { useEffect, useState, type ReactNode } from "react";
import { Clock, Check, X, Zap } from "lucide-react";

export type ComparisonRow = {
  label: string;
  title: string;
  detail: string;
  highlight?: boolean;
};

export type IncludedItem = {
  icon: ReactNode;
  text: string;
};

type Props = {
  headline: string;
  subheadline: string;
  productName: string;
  price: string;
  originalPrice?: string;
  included: IncludedItem[];
  comparison: ComparisonRow[];
  yesText: string;
  noText: string;
  noLossText: string;
  yesUrl: string;
  noUrl: string;
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export const OtoPage = ({
  headline,
  subheadline,
  productName,
  price,
  originalPrice,
  included,
  comparison,
  yesText,
  noText,
  noLossText,
  yesUrl,
  noUrl,
}: Props) => {
  const [seconds, setSeconds] = useState(600);
  const expired = seconds <= 0;

  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [expired]);

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Top banner */}
      <div className="bg-coral text-primary-foreground text-center text-xs sm:text-sm font-bold py-2 px-4 tracking-wide">
        ⚡ ONE-TIME OFFER · NOT SHOWN AGAIN
      </div>

      <main className="px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Pattern interrupt */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold">
              <Zap className="h-3.5 w-3.5" /> ONE-TIME OFFER
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-black leading-[1.02]">
              {headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Countdown */}
          <div className="mt-10 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cream/70 uppercase">
              <Clock className="h-3.5 w-3.5" /> Offer expires in
            </div>
            <div
              className={`mt-3 font-mono font-black tabular-nums text-6xl sm:text-8xl md:text-9xl ${
                expired ? "text-cream/40" : "text-coral"
              }`}
              style={{ textShadow: expired ? "none" : "0 8px 30px hsl(var(--coral) / 0.45)" }}
              aria-live="polite"
            >
              {expired ? "00:00" : formatTime(seconds)}
            </div>
            {expired && (
              <p className="mt-3 text-base sm:text-lg font-bold text-cream/70">
                This offer has expired
              </p>
            )}
            <p className="mt-4 text-sm sm:text-base text-cream/80 max-w-xl text-center">
              This price <span className="text-gold font-bold">only exists on this page</span> — it
              disappears when you leave.
            </p>
          </div>

          {/* Price */}
          <div className="mt-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-cream/60 font-bold">
              {productName}
            </p>
            <div className="mt-3 flex items-baseline justify-center gap-3">
              {originalPrice && (
                <span className="text-2xl sm:text-3xl text-cream/50 line-through decoration-coral decoration-[3px]">
                  {originalPrice}
                </span>
              )}
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-gold leading-none">
                {price}
              </span>
            </div>
            <p className="mt-2 text-sm text-cream/60">one-time payment</p>
          </div>

          {/* Included */}
          <div className="mt-14">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold">
              Here's everything you get:
            </h2>
            <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2">
              {included.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
                    {item.icon}
                  </div>
                  <p className="text-cream/90 text-sm sm:text-base leading-relaxed pt-1.5">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-16">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold">
              Why this is a no-brainer
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {comparison.map((col, i) => {
                const highlight = col.highlight;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-6 border transition-all ${
                      highlight
                        ? "bg-gold text-navy border-gold shadow-[0_20px_50px_-12px_hsl(var(--gold)/0.5)] md:-translate-y-3"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <p
                      className={`text-xs font-bold tracking-[0.2em] uppercase ${
                        highlight ? "text-navy/70" : "text-cream/60"
                      }`}
                    >
                      {col.label}
                    </p>
                    <h3
                      className={`mt-3 text-xl font-extrabold ${
                        highlight ? "text-navy" : "text-cream"
                      }`}
                    >
                      {col.title}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        highlight ? "text-navy/80" : "text-cream/75"
                      }`}
                    >
                      {col.detail}
                    </p>
                    {highlight && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy text-cream px-3 py-1 text-xs font-bold">
                        <Check className="h-3.5 w-3.5 text-gold" /> Best value
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-16 flex flex-col items-center gap-5">
            <a
              href={expired ? undefined : yesUrl}
              aria-disabled={expired}
              onClick={(e) => expired && e.preventDefault()}
              className={`yes-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-xl font-extrabold text-white text-center ${
                expired
                  ? "bg-white/10 text-cream/40 cursor-not-allowed"
                  : "bg-[hsl(var(--success))] hover:-translate-y-1 animate-pulse-yes"
              }`}
            >
              <Check className="h-5 w-5" /> {yesText}
            </a>

            <div className="flex flex-col items-center gap-2">
              <a
                href={noUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" /> {noText}
              </a>
              <p className="text-xs text-cream/40 max-w-xs text-center italic">{noLossText}</p>
            </div>
          </div>

          {/* Footer scarcity */}
          <p className="mt-12 text-center text-xs text-cream/50">
            Once you leave this page, this offer is gone — for real, not in a fake-marketer way.
          </p>
        </div>
      </main>
    </div>
  );
};
