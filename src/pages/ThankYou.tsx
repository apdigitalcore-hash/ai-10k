import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  BookOpen,
  Sparkles,
  Bookmark,
  Lock,
  Users,
  DollarSign,
  PartyPopper,
} from "lucide-react";

const CONFIG = {
  PDF_DOWNLOAD_URL: "/The_10K_AI_Employee.pdf",
  BONUS_HOOKS_URL: "[BONUS_HOOKS_URL]",
  BONUS_CTA_URL: "[BONUS_CTA_URL]",
  BONUS_OFFERS_URL: "[BONUS_OFFERS_URL]",
  BONUS_MAGNETS_URL: "[BONUS_MAGNETS_URL]",
  BONUS_QUICKSTART_URL: "[BONUS_QUICKSTART_URL]",
  COMMUNITY_URL: "[COMMUNITY_URL]",
  AFFILIATE_URL: "[AFFILIATE_URL]",
};

const STORAGE_KEY = "ai-employee-7day-challenge";

const steps = [
  {
    n: "01",
    icon: BookOpen,
    title: "Open Section 1 of the PDF",
    desc: "Start with the Marketing agents. Prompt #1 is your sales page writer.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Paste Prompt #1 into Claude",
    desc: "Free tier works perfectly. Copy the prompt, fill in your product name, hit enter.",
  },
  {
    n: "03",
    icon: Bookmark,
    title: "Bookmark This Page",
    desc: "We'll add new prompts and updates here. You'll want to come back.",
  },
];

const unlockedBonuses = [
  { title: "100 Viral Hooks Swipe File", value: "$47", url: CONFIG.BONUS_HOOKS_URL },
  { title: "50 Call-to-Action Templates", value: "$27", url: CONFIG.BONUS_CTA_URL },
  { title: "25 Irresistible Offer Ideas", value: "$47", url: CONFIG.BONUS_OFFERS_URL },
  { title: "20 Lead Magnet Blueprints", value: "$27", url: CONFIG.BONUS_MAGNETS_URL },
  { title: "Quick Start Guide", value: "$19", url: CONFIG.BONUS_QUICKSTART_URL },
];

const lockedBonuses = [
  { title: "AI Business Dashboard", price: "$47", href: "/oto1" },
  { title: "AI Monetization Accelerator", price: "$97", href: "/oto2" },
];

const challenge = [
  "Day 1: Run your first prompt — use any Marketing agent from Section 1",
  "Day 2: Post one piece of AI-generated content on any platform",
  "Day 3: Try prompt stacking — feed one agent's output into another",
  "Day 4: Write a full email sequence using the Sales agents",
  "Day 5: Build or update your content calendar with the Social agents",
  "Day 6: Use the Research agents to analyze your niche or a competitor",
  "Day 7: Share your results in the community — you've earned it",
];

const ThankYou = () => {
  const [checked, setChecked] = useState<boolean[]>(() => {
    if (typeof window === "undefined") return new Array(7).fill(false);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed.map(Boolean);
      }
    } catch {
      /* ignore */
    }
    return new Array(7).fill(false);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked]);

  // Confetti on load (once)
  useEffect(() => {
    const colors = ["#F3A712", "#E94560", "#F7F5F0"];
    const fire = (particleRatio: number, opts: confetti.Options) =>
      confetti({
        origin: { y: 0.35 },
        colors,
        particleCount: Math.floor(220 * particleRatio),
        ...opts,
      });
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const allDone = checked.every(Boolean);
  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="min-h-screen bg-background">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden bg-navy text-cream px-5 sm:px-8 py-20 sm:py-28 text-center">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(700px 350px at 50% 0%, hsl(var(--gold)/0.35), transparent 60%), radial-gradient(500px 300px at 50% 100%, hsl(var(--coral)/0.3), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gold/15 border border-gold/30">
            <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-gold" strokeWidth={2.5} />
          </div>
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-black leading-[1.02]">
            You're in. Your <span className="text-coral">$10K AI Employee</span> is ready.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-cream/80 leading-relaxed max-w-2xl mx-auto">
            Your PDF is ready to download. Everything below is yours — open it, run your first
            prompt, and let your AI employee clock in.
          </p>
          <a
            href={CONFIG.PDF_DOWNLOAD_URL}
            className="cta-btn mt-10 text-base sm:text-xl !px-10 !py-5"
          >
            <Download className="h-5 w-5" /> DOWNLOAD YOUR PDF NOW
          </a>
          <p className="mt-4 text-xs sm:text-sm text-cream/60">
            Instant download · No expiry · Lifetime updates included
          </p>
        </div>
      </section>

      {/* SECTION 2 — QUICK START */}
      <section className="px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">QUICK START</p>
            <h2 className="mt-3 text-3xl sm:text-5xl text-navy">
              Start Here — Your First 10 Minutes
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="relative bg-card rounded-2xl p-7 shadow-card border border-border hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-gold leading-none">{s.n}</span>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-cream">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — BONUSES */}
      <section className="px-5 sm:px-8 py-20 sm:py-24 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">YOUR ORDER</p>
            <h2 className="mt-3 text-3xl sm:text-5xl text-navy">Everything In Your Order</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {unlockedBonuses.map((b) => (
              <div
                key={b.title}
                className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col sm:flex-row sm:items-center gap-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 text-gold border border-gold/30 px-2.5 py-0.5 text-xs font-bold">
                      {b.value} value
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[hsl(145_63%_38%)]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Unlocked
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-navy">{b.title}</h3>
                </div>
                <a
                  href={b.url}
                  className="cta-btn !py-3 !px-5 !text-sm whitespace-nowrap"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            ))}

            {lockedBonuses.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-6 border border-dashed border-border bg-card/50 flex flex-col sm:flex-row sm:items-center gap-5 opacity-90"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-0.5 text-xs font-bold">
                      <Lock className="h-3 w-3" /> Upgrade to unlock
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-muted-foreground">
                    {b.title}
                  </h3>
                </div>
                <a
                  href={b.href}
                  className="cta-btn !py-3 !px-5 !text-sm whitespace-nowrap"
                >
                  Add for {b.price}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — COMMUNITY */}
      <section className="bg-navy text-cream px-5 sm:px-8 py-20 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-3xl">
            <Users className="h-7 w-7 text-gold" />
          </div>
          <h2 className="mt-6 text-3xl sm:text-5xl">Join the Private Buyer Community</h2>
          <p className="mt-5 text-lg text-cream/80 leading-relaxed">
            Get feedback on your prompts, share what's working, and connect with other business
            owners using AI to grow. Free for buyers.
          </p>
          <a
            href={CONFIG.COMMUNITY_URL}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gold text-gold px-8 py-4 font-bold text-base sm:text-lg hover:bg-gold hover:text-navy transition-colors duration-300"
          >
            <Users className="h-5 w-5" /> JOIN THE COMMUNITY
          </a>
        </div>
      </section>

      {/* SECTION 5 — AFFILIATE */}
      <section className="px-5 sm:px-8 py-20 sm:py-24 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/15 text-coral">
            <DollarSign className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl text-navy">Love it? Earn 50% Per Sale.</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Share your unique link. Every time someone buys through it, you earn{" "}
            <span className="font-bold text-navy">$4.50</span>. No audience required — just share
            what's working for you.
          </p>
          <a href={CONFIG.AFFILIATE_URL} className="cta-btn mt-10 text-base sm:text-lg !px-10 !py-5">
            GET MY AFFILIATE LINK
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Commissions paid weekly. No approval needed.
          </p>
        </div>
      </section>

      {/* SECTION 6 — 7-DAY CHALLENGE */}
      <section className="px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">CHALLENGE</p>
            <h2 className="mt-3 text-3xl sm:text-5xl text-navy">Your 7-Day AI Challenge</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              One small action per day. By Day 7 you'll have more done than most people do in a
              month.
            </p>
          </div>

          <ul className="mt-12 space-y-3">
            {challenge.map((item, i) => {
              const isOn = checked[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className={`w-full text-left flex items-start gap-4 rounded-2xl p-5 border transition-all duration-300 ${
                      isOn
                        ? "bg-gold/10 border-gold/40"
                        : "bg-card border-border hover:border-coral/40"
                    }`}
                    aria-pressed={isOn}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                        isOn
                          ? "bg-gold border-gold text-navy"
                          : "border-muted-foreground/40 bg-transparent"
                      }`}
                      aria-hidden
                    >
                      {isOn && <CheckCircle2 className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-base sm:text-lg leading-relaxed ${
                        isOn
                          ? "text-navy font-semibold line-through decoration-gold decoration-2"
                          : "text-foreground"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {allDone && (
            <div className="mt-10 rounded-2xl bg-gold text-navy p-6 sm:p-8 text-center shadow-card animate-fade-in">
              <PartyPopper className="h-10 w-10 mx-auto" />
              <p className="mt-3 text-xl sm:text-2xl font-extrabold">
                🎉 Challenge complete! You're officially an AI power user.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-deep text-cream/70 px-5 sm:px-8 py-10 text-center text-sm">
        © {new Date().getFullYear()} AP Digital · support@apdigital.co
      </footer>
    </div>
  );
};

export default ThankYou;
