import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Gift, Lock, RefreshCw, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const LAUNCH_DATE = "2025-05-01T00:00:00";
const FORM_ENDPOINT = "[FORM_ENDPOINT]";
const WAITLIST_COUNT = "1,247";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function getCountdown(): CountdownState {
  const diff = new Date(LAUNCH_DATE).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    expired: false,
  };
}

const testimonials = [
  {
    quote: "I've been waiting for something like this for months. The bonuses alone are worth it.",
    handle: "@sarahbuilds",
  },
  {
    quote: "AP Digital's free content already changed how I use AI. This is going to be insane.",
    handle: "@mikegrowth",
  },
  {
    quote: "Locked in at $9. No brainer. I spend more on coffee before 9am.",
    handle: "@jenna_creates",
  },
];

const teaserCards = [
  {
    icon: Sparkles,
    title: "50 AI Prompts",
    desc: "Ready-to-use prompts that replace an entire marketing team.",
  },
  {
    icon: Gift,
    title: "$330+ in Bonuses",
    desc: "Hooks, CTAs, offer ideas, lead magnets, and a quick-start guide.",
  },
  {
    icon: RefreshCw,
    title: "Lifetime Updates",
    desc: "Every new prompt and bonus added as AI evolves — yours forever.",
  },
];

const Waitlist = () => {
  useReveal();

  const [countdown, setCountdown] = useState<CountdownState>(getCountdown);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* ignore network errors — still show success */
    }
    setSubmitted(true);
    setSubmitting(false);
    const colors = ["#F3A712", "#E94560", "#F7F5F0"];
    const fire = (ratio: number, opts: confetti.Options) =>
      confetti({ origin: { y: 0.55 }, colors, particleCount: Math.floor(180 * ratio), ...opts });
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

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
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-cream section-pad text-center reveal">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(700px 350px at 50% 0%, hsl(var(--gold)/0.35), transparent 60%), radial-gradient(500px 300px at 50% 100%, hsl(var(--coral)/0.3), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative container-tight">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold tracking-[0.2em] px-4 py-2">
            COMING SOON
          </span>
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-black leading-[1.02]">
            The <span className="text-coral">$10K AI Employee</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-cream/80 leading-relaxed max-w-2xl mx-auto">
            50 AI prompts that replace your marketing team, write your emails, and grow your
            revenue — launching soon at just $9.
          </p>

          {/* COUNTDOWN */}
          <div className="mt-12">
            {countdown.expired ? (
              <p className="text-2xl sm:text-3xl font-black text-gold">
                We're live! Check your email.
              </p>
            ) : (
              <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5">
                {[
                  { label: "DAYS", value: countdown.days },
                  { label: "HOURS", value: countdown.hours },
                  { label: "MINUTES", value: countdown.minutes },
                  { label: "SECONDS", value: countdown.seconds },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <span className="min-w-[72px] sm:min-w-[88px] text-center text-4xl sm:text-5xl font-black text-gold bg-white/5 border border-white/10 rounded-2xl px-4 py-3 tabular-nums leading-none">
                      {pad(value)}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-cream/50">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="bg-background section-pad reveal">
        <div className="container-tight max-w-xl text-center mx-auto">
          <p className="text-coral font-bold tracking-[0.2em] text-xs">EARLY ACCESS</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-navy">
            Get early access + a bonus prompt pack
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Join the waitlist and we'll email you the moment we go live — plus a free bonus prompt
            pack just for signing up.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-gold/10 border border-gold/30 p-6 text-center">
              <p className="text-xl font-extrabold text-navy">
                You're on the list. Watch your inbox.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {WAITLIST_COUNT} people already on the waitlist
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                ref={emailRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/50"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-coral text-white font-extrabold px-6 py-3 text-sm tracking-wide hover:-translate-y-0.5 transition-transform duration-200 disabled:opacity-60 whitespace-nowrap"
              >
                {submitting ? "SENDING..." : "SECURE MY SPOT \u2192"}
              </button>
            </form>
          )}

          {!submitted && (
            <p className="mt-4 text-xs text-muted-foreground">
              {WAITLIST_COUNT} people already on the waitlist
            </p>
          )}
        </div>
      </section>

      {/* TEASER CARDS */}
      <section className="bg-navy section-pad reveal">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">WHAT'S INSIDE</p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-cream">
              Everything unlocks on launch day
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {teaserCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 backdrop-blur-sm rounded-2xl z-10">
                    <Lock className="h-7 w-7 text-gold mb-2" />
                    <p className="text-xs font-bold tracking-[0.15em] text-cream/70">
                      Unlock on launch day
                    </p>
                  </div>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-cream">{card.title}</h3>
                  <p className="mt-2 text-sm text-cream/60 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-navy-deep section-pad reveal">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">EARLY FEEDBACK</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-cream">
              What people are saying
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.handle}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <p className="text-sm text-cream/80 leading-relaxed">"{t.quote}"</p>
                <p className="mt-4 text-xs font-bold text-gold">{t.handle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARLY BIRD PRICING */}
      <section className="bg-navy section-pad reveal">
        <div className="container-tight max-w-xl mx-auto">
          <div className="rounded-2xl border-2 border-gold/50 bg-white/5 p-8 text-center">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">EARLY BIRD PRICING</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-cream">
              Lock in the lowest price — forever.
            </h2>
            <div className="mt-6 flex items-center justify-center gap-5">
              <span className="text-3xl font-black text-cream/30 line-through">$27</span>
              <span className="text-5xl font-black text-coral">$9</span>
            </div>
            <p className="mt-4 text-sm text-cream/70">
              You're locked in at $9 if you sign up now. Price rises to $27 after launch.
            </p>
            {submitted ? (
              <p className="mt-6 text-sm font-bold text-gold">
                You're on the list — you're locked in!
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-coral text-white font-extrabold px-6 py-3 text-sm tracking-wide hover:-translate-y-0.5 transition-transform duration-200 disabled:opacity-60 whitespace-nowrap"
                >
                  {submitting ? "..." : "LOCK IT IN \u2192"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-deep text-cream/70 px-5 sm:px-8 py-10 text-center text-sm">
        © {new Date().getFullYear()} AP Digital · support@apdigital.co
      </footer>
    </div>
  );
};

export default Waitlist;
