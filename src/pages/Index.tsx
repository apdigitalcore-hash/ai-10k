import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReveal } from "@/hooks/useReveal";
import {
  Star,
  Check,
  X,
  Megaphone,
  TrendingUp,
  PenTool,
  Share2,
  Settings,
  Search,
  Headphones,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";

const CHECKOUT_URL = "[CHECKOUT_URL]";

const categories = [
  {
    icon: Megaphone,
    name: "Marketing",
    count: "10 agents",
    items: [
      "Sales Page Writer",
      "Ad Copy Generator (Meta + Google)",
      "Email Welcome Sequence Builder",
      "Brand Voice Architect",
      "Funnel Strategy Mapper",
    ],
  },
  {
    icon: TrendingUp,
    name: "Sales",
    count: "8 agents",
    items: [
      "Cold DM Personalizer",
      "Discovery Call Script Writer",
      "Objection Handler",
      "Proposal Generator",
      "Follow-up Cadence Builder",
    ],
  },
  {
    icon: PenTool,
    name: "Content",
    count: "8 agents",
    items: [
      "Long-form Blog Outliner",
      "Newsletter Ghost-writer",
      "YouTube Script Creator",
      "SEO Cluster Planner",
      "Storytelling Hook Engine",
    ],
  },
  {
    icon: Share2,
    name: "Social Media",
    count: "6 agents",
    items: [
      "Viral Tweet/Thread Writer",
      "LinkedIn Authority Post Builder",
      "Instagram Carousel Designer",
      "TikTok Hook Generator",
      "30-day Content Calendar",
    ],
  },
  {
    icon: Settings,
    name: "Operations",
    count: "7 agents",
    items: [
      "SOP Generator",
      "Project Brief Writer",
      "Meeting Summary Bot",
      "Hiring Job Description Writer",
      "Workflow Automator",
    ],
  },
  {
    icon: Search,
    name: "Research",
    count: "5 agents",
    items: [
      "Competitor Analysis Agent",
      "Market Trend Scanner",
      "Customer Interview Synthesizer",
      "Pricing Research Assistant",
      "Niche Discovery Engine",
    ],
  },
  {
    icon: Headphones,
    name: "Customer Support",
    count: "6 agents",
    items: [
      "Empathetic Reply Writer",
      "Refund Response Templates",
      "FAQ Builder",
      "Onboarding Email Bot",
      "Churn Save Sequence",
    ],
  },
];

const valueStack = [
  { item: "The $10K AI Employee — 40-page PDF (50 agents)", value: "$117" },
  { item: "100 Viral Hooks Swipe File", value: "$47" },
  { item: "50 Call-to-Action Templates", value: "$27" },
  { item: "25 Irresistible Offer Ideas", value: "$47" },
  { item: "20 Lead Magnet Blueprints", value: "$27" },
  { item: "Quick Start Guide", value: "$19" },
  { item: "Lifetime Updates", value: "$47" },
];

const testimonials = [
  {
    name: "Maya T.",
    role: "Freelance Designer",
    quote:
      "I used the sales page agent on a Tuesday night. By the next morning I had a live funnel for a new client. Felt illegal.",
  },
  {
    name: "James R.",
    role: "Strategy Consultant",
    quote:
      "Ran a prospect through the competitor analysis agent before a pitch. Walked out with a $5K/month retainer. Paid for itself ~555x.",
  },
  {
    name: "Priya K.",
    role: "Business Coach",
    quote:
      "The email sequence agent wrote my entire welcome series in 10 minutes. I'd been procrastinating it for 8 months.",
  },
];

const faqs = [
  {
    q: "Does this work with free Claude?",
    a: "Yes. Every agent is plain-text and works in free Claude, Claude Pro, ChatGPT, Gemini, or any other LLM. No API keys, no plugins, no setup.",
  },
  {
    q: "Is this just a list of basic prompts?",
    a: "No. These are 50 fully-engineered agents — multi-step instructions, role definitions, output structure, and guardrails. Copy, paste, and the agent does the thinking.",
  },
  {
    q: "Can I resell this PDF?",
    a: "You can use the agents in your own client work, agency, products, and content forever. You can't redistribute the PDF itself.",
  },
  {
    q: "What if I hate it — refund policy?",
    a: "Email us within 30 days, get every penny back, no questions, no awkward forms. Keep the PDF anyway.",
  },
  {
    q: "How fast will I see results?",
    a: "First useful output in under 5 minutes. Most buyers ship something real (email, ad, page, post) on day one.",
  },
];

const Stars = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
    ))}
  </div>
);

const Index = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-navy/95 text-cream border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <a href="#top" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>AP Digital</span>
          </a>
          <a
            href={CHECKOUT_URL}
            className="cta-btn !py-2.5 !px-4 sm:!px-5 !text-xs sm:!text-sm"
          >
            <span className="hidden sm:inline">GET INSTANT ACCESS — $9</span>
            <span className="sm:hidden">GET ACCESS — $9</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-navy text-cream">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(800px 400px at 20% 0%, hsl(var(--coral)/0.35), transparent 60%), radial-gradient(600px 300px at 90% 20%, hsl(var(--gold)/0.25), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative section-pad container-tight text-center">
            <div className="reveal inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold">
              <Zap className="h-3.5 w-3.5" /> INTRODUCING
            </div>
            <h1 className="reveal mt-6 text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95]">
              The <span className="text-coral">$10K AI</span><br className="hidden sm:block" /> Employee
            </h1>
            <p className="reveal mt-6 text-lg sm:text-2xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-cream">50 AI agents that work while you sleep.</span>{" "}
              Copy. Paste. Profit. A 40-page playbook for business owners, freelancers, and creators
              who are done wasting hours on blank Claude prompts.
            </p>
            <div className="reveal mt-10 flex flex-col items-center gap-4">
              <a href={CHECKOUT_URL} className="cta-btn text-base sm:text-xl !px-10 !py-5">
                GET INSTANT ACCESS — $9
              </a>
              <div className="flex items-center gap-2 text-sm text-cream/80">
                <Stars />
                <span>Rated 4.9/5 by 500+ users</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section-pad container-tight">
          <h2 className="reveal text-3xl sm:text-5xl text-navy max-w-3xl">
            You know AI can change your business.{" "}
            <span className="text-coral">So why are you staring at a blank Claude prompt?</span>
          </h2>
          <div className="reveal mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              You opened Claude to write that sales page. Forty minutes later you have three
              versions of corporate-flavored oatmeal and a tab full of YouTube tutorials about
              "prompt engineering." The page is still not written.
            </p>
            <p>
              Generic prompts give you generic output. "Write me a marketing email" returns
              something your competitor's intern could have written in 2014. So you tweak. You
              re-roll. You give up and write it yourself — slower than before AI existed.
            </p>
            <p>
              The problem isn't AI. The problem is that nobody handed you the actual instructions
              the pros use. Multi-step, role-based, output-structured agents that do the thinking{" "}
              <em>for</em> you. That's exactly what's inside.
            </p>
          </div>
        </section>

        {/* VALUE STACK */}
        <section className="bg-navy text-cream section-pad">
          <div className="container-tight">
            <div className="reveal text-center max-w-2xl mx-auto">
              <p className="text-gold font-bold tracking-[0.2em] text-xs">EVERYTHING YOU GET</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">A $330+ stack. Yours for nine bucks.</h2>
            </div>

            <div className="reveal mt-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden max-w-3xl mx-auto">
              <table className="w-full text-left">
                <tbody>
                  {valueStack.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/10 last:border-0"
                    >
                      <td className="py-4 px-5 sm:px-7 text-sm sm:text-base text-cream/90">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-gold flex-shrink-0" />
                          {row.item}
                        </span>
                      </td>
                      <td className="py-4 px-5 sm:px-7 text-right font-bold text-gold whitespace-nowrap">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/10">
                    <td className="py-5 px-5 sm:px-7 font-bold text-base sm:text-lg">
                      Total perceived value
                    </td>
                    <td className="py-5 px-5 sm:px-7 text-right font-extrabold text-xl">
                      $330+
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="reveal mt-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl sm:text-3xl text-cream/60 line-through decoration-coral decoration-[3px]">
                  $330+ value
                </span>
                <span className="text-6xl sm:text-8xl font-black text-coral leading-none">
                  $9 today
                </span>
              </div>
              <a href={CHECKOUT_URL} className="cta-btn mt-10 text-base sm:text-xl !px-10 !py-5">
                GET INSTANT ACCESS — $9
              </a>
              <p className="mt-4 text-xs text-cream/60 inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> 30-day no-questions refund
              </p>
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE */}
        <section className="section-pad container-tight">
          <div className="reveal text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">WHAT'S INSIDE</p>
            <h2 className="mt-3 text-4xl sm:text-5xl text-navy">
              50 agents. 7 categories. Zero fluff.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="reveal group relative bg-card rounded-2xl p-6 sm:p-7 shadow-card border border-border hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-cream">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-navy">{cat.name}</h3>
                      <p className="text-xs font-semibold text-coral">{cat.count}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {cat.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHO IT'S FOR / NOT FOR */}
        <section className="section-pad container-tight">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="reveal bg-card rounded-2xl p-8 sm:p-10 shadow-card border border-border">
              <h3 className="text-2xl sm:text-3xl text-navy">This is for you if…</h3>
              <ul className="mt-6 space-y-4 text-base">
                {[
                  "You're a business owner tired of trading time for revenue.",
                  "You're a freelancer who wants to deliver agency-level work solo.",
                  "You're a creator who needs content output without burning out.",
                  "You use Claude and keep getting bland, useless results.",
                  "You want working templates — not another 12-hour theory course.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal bg-navy text-cream rounded-2xl p-8 sm:p-10 shadow-card">
              <h3 className="text-2xl sm:text-3xl">This is NOT for you if…</h3>
              <ul className="mt-6 space-y-4 text-base">
                {[
                  "You think AI is a fad and Excel macros were the peak of innovation.",
                  "You enjoy reinventing every email from scratch at 1am.",
                  "You'd rather buy a fifth $997 course than ship something this week.",
                  "You want a magic button. (We sell prompts, not unicorns.)",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-coral/20 text-coral flex-shrink-0">
                      <X className="h-4 w-4" />
                    </span>
                    <span className="text-cream/90">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section-pad container-tight">
          <div className="reveal text-center max-w-2xl mx-auto">
            <p className="text-coral font-bold tracking-[0.2em] text-xs">RECEIPTS</p>
            <h2 className="mt-3 text-4xl sm:text-5xl text-navy">
              500+ buyers. Zero Claude-shaped oatmeal.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="reveal bg-card rounded-2xl p-7 shadow-card border border-border flex flex-col"
              >
                <Stars />
                <blockquote className="mt-4 text-foreground leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <div className="font-bold text-navy">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section-pad">
          <div className="container-tight max-w-3xl">
            <div className="reveal text-center">
              <p className="text-coral font-bold tracking-[0.2em] text-xs">FAQ</p>
              <h2 className="mt-3 text-4xl sm:text-5xl text-navy">Quick answers.</h2>
            </div>
            <div className="reveal mt-10 bg-card rounded-2xl shadow-card border border-border px-2 sm:px-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-base sm:text-lg font-bold text-navy hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-navy text-cream section-pad relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(700px 350px at 50% 0%, hsl(var(--coral)/0.4), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="container-tight relative text-center">
            <p className="reveal text-gold font-bold tracking-[0.25em] text-xs">LAST CALL</p>
            <h2 className="reveal mt-4 text-4xl sm:text-6xl md:text-7xl leading-[1.05]">
              $330 value for just <span className="text-coral">$9</span> —<br />
              or keep paying in hours.
            </h2>
            <p className="reveal mt-6 text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
              Download the PDF. Open Claude. Paste your first agent. Ship something real before
              your coffee gets cold.
            </p>
            <a href={CHECKOUT_URL} className="reveal cta-btn mt-10 text-base sm:text-xl !px-12 !py-6">
              GET INSTANT ACCESS — $9
            </a>
            <div className="reveal mt-6">
              <span className="inline-block animate-pulse-scarcity text-sm font-bold text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full">
                ⚡ Price goes to $27 soon
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-navy-deep text-cream/70">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2 font-extrabold text-cream">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            AP Digital
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-cream transition-colors">Privacy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms</a>
            <a href="mailto:support@apdigital.co" className="hover:text-cream transition-colors">
              support@apdigital.co
            </a>
          </div>
          <div className="text-xs text-cream/50">
            © {new Date().getFullYear()} AP Digital. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
