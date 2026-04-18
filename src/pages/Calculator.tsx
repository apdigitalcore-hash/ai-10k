import { useMemo, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles, ClipboardCopy, ClipboardCheck } from "lucide-react";

const PRICES = {
  frontend: 9,
  bump: 17,
  oto1: 47,
  oto2: 97,
  downsell: 27,
};

type SliderConfig = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  format: (n: number) => string;
};

const sliders: SliderConfig[] = [
  { key: "visitors", label: "Daily Visitors", min: 50, max: 5000, step: 50, default: 500, format: (n) => n.toLocaleString() },
  { key: "conversion", label: "Conversion Rate", min: 1, max: 15, step: 0.1, default: 3, format: (n) => `${n.toFixed(1)}%` },
  { key: "bumpRate", label: "Order Bump Take Rate", min: 10, max: 60, step: 1, default: 30, format: (n) => `${n}%` },
  { key: "oto1Rate", label: "OTO1 Take Rate", min: 5, max: 35, step: 1, default: 15, format: (n) => `${n}%` },
  { key: "oto2Rate", label: "OTO2 Take Rate", min: 5, max: 25, step: 1, default: 10, format: (n) => `${n}%` },
  { key: "downsellRate", label: "Downsell Take Rate", min: 10, max: 40, step: 1, default: 20, format: (n) => `${n}%` },
  { key: "adSpend", label: "Daily Ad Spend", min: 0, max: 500, step: 5, default: 50, format: (n) => `$${n}` },
];

type Status = "green" | "yellow" | "red" | "neutral";

const statusStyle: Record<Status, string> = {
  green: "bg-[hsl(145_63%_42%/0.15)] text-[hsl(145_63%_55%)] border-[hsl(145_63%_42%/0.4)]",
  yellow: "bg-gold/15 text-gold border-gold/40",
  red: "bg-coral/15 text-coral border-coral/40",
  neutral: "bg-white/10 text-cream/70 border-white/15",
};

const statusLabel: Record<Status, string> = {
  green: "Healthy",
  yellow: "Watch",
  red: "Fix",
  neutral: "—",
};

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 100 ? 0 : 2 });

const CoralSlider = ({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) => (
  <SliderPrimitive.Root
    className="relative flex w-full touch-none select-none items-center h-6"
    value={[value]}
    onValueChange={(v) => onChange(v[0])}
    min={min}
    max={max}
    step={step}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10">
      <SliderPrimitive.Range className="absolute h-full bg-coral" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-6 w-6 rounded-full bg-gold border-2 border-navy shadow-lg ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing"
      aria-label="Slider"
    />
  </SliderPrimitive.Root>
);

const KpiCard = ({
  label,
  value,
  status = "neutral",
  hint,
}: {
  label: string;
  value: string;
  status?: Status;
  hint?: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-bold tracking-[0.15em] uppercase text-cream/60">{label}</p>
      {status !== "neutral" && (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle[status]}`}>
          {statusLabel[status]}
        </span>
      )}
    </div>
    <p className="mt-3 text-3xl sm:text-4xl font-black text-cream leading-none tabular-nums">{value}</p>
    {hint && <p className="mt-2 text-xs text-cream/50">{hint}</p>}
  </div>
);

const Calculator = () => {
  const [state, setState] = useState<Record<string, number>>(() =>
    sliders.reduce((acc, s) => ({ ...acc, [s.key]: s.default }), {})
  );
  const [copied, setCopied] = useState(false);

  const update = (k: string, v: number) => setState((s) => ({ ...s, [k]: v }));

  const m = useMemo(() => {
    const visitors = state.visitors;
    const conversion = state.conversion;
    const bumpRate = state.bumpRate;
    const oto1Rate = state.oto1Rate;
    const oto2Rate = state.oto2Rate;
    const downsellRate = state.downsellRate;
    const adSpend = state.adSpend;

    const dailyBuyers = visitors * (conversion / 100);
    const frontendRev = dailyBuyers * PRICES.frontend;
    const bumpRev = dailyBuyers * (bumpRate / 100) * PRICES.bump;
    const oto1Rev = dailyBuyers * (oto1Rate / 100) * PRICES.oto1;
    const oto2Rev = dailyBuyers * (oto2Rate / 100) * PRICES.oto2;
    const downsellRev = dailyBuyers * (downsellRate / 100) * PRICES.downsell;
    const dailyRev = frontendRev + bumpRev + oto1Rev + oto2Rev + downsellRev;
    const aov = dailyBuyers > 0 ? dailyRev / dailyBuyers : 0;
    const monthlyRev = dailyRev * 30;
    const annualRev = dailyRev * 365;
    const roas = adSpend > 0 ? dailyRev / adSpend : null;
    const cpa = dailyBuyers > 0 ? adSpend / dailyBuyers : 0;
    const breakEvenCpc = aov * (conversion / 100);
    const profitMargin = dailyRev > 0 ? ((dailyRev - adSpend) / dailyRev) * 100 : 0;

    return {
      visitors,
      conversion,
      adSpend,
      dailyBuyers,
      frontendRev,
      bumpRev,
      oto1Rev,
      oto2Rev,
      downsellRev,
      dailyRev,
      aov,
      monthlyRev,
      annualRev,
      roas,
      cpa,
      breakEvenCpc,
      profitMargin,
    };
  }, [state]);

  const buyersStatus: Status = m.dailyBuyers >= 15 ? "green" : m.dailyBuyers >= 5 ? "yellow" : "red";
  const revStatus: Status = m.dailyRev >= 200 ? "green" : m.dailyRev >= 50 ? "yellow" : "red";
  const aovStatus: Status = m.aov >= 25 ? "green" : m.aov >= 15 ? "yellow" : "red";
  const monthlyStatus: Status = m.monthlyRev >= 6000 ? "green" : m.monthlyRev >= 1500 ? "yellow" : "red";
  const roasStatus: Status =
    m.roas === null ? "neutral" : m.roas >= 3 ? "green" : m.roas >= 1 ? "yellow" : "red";
  const cpaStatus: Status =
    m.adSpend === 0 ? "neutral" : m.cpa <= 3 ? "green" : m.cpa <= 6 ? "yellow" : "red";
  const marginStatus: Status =
    m.profitMargin >= 70 ? "green" : m.profitMargin >= 40 ? "yellow" : "red";

  const breakdownData = [
    { name: "Frontend", value: m.frontendRev, fill: "hsl(var(--coral))" },
    { name: "Bump", value: m.bumpRev, fill: "hsl(var(--gold))" },
    { name: "OTO1", value: m.oto1Rev, fill: "hsl(351 78% 75%)" },
    { name: "OTO2", value: m.oto2Rev, fill: "hsl(40 91% 70%)" },
    { name: "Downsell", value: m.downsellRev, fill: "hsl(43 33% 80%)" },
  ];

  const projectionData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const grossCum = m.dailyRev * day;
    const netCum = (m.dailyRev - m.adSpend) * day;
    return {
      day,
      "With Ads (Net)": Math.max(0, Math.round(netCum)),
      "Without Ads (Gross)": Math.round(grossCum),
    };
  });

  const handleCopy = async () => {
    const summary =
      `--- Funnel Revenue Summary ---\n` +
      `Daily Visitors: ${m.visitors.toLocaleString()}\n` +
      `Conversion Rate: ${m.conversion.toFixed(1)}%\n` +
      `Daily Buyers: ${m.dailyBuyers.toFixed(1)}\n` +
      `Daily Revenue: ${fmtMoney(m.dailyRev)}\n` +
      `AOV: ${fmtMoney(m.aov)}\n` +
      `Monthly Revenue: ${fmtMoney(m.monthlyRev)}\n` +
      `Annual Revenue: ${fmtMoney(m.annualRev)}\n` +
      `ROAS: ${m.roas === null ? "Organic" : `${m.roas.toFixed(1)}x`}\n` +
      `CPA: ${m.adSpend === 0 ? "—" : fmtMoney(m.cpa)}\n` +
      `Profit Margin: ${m.profitMargin.toFixed(0)}%\n` +
      `------------------------------`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--navy-deep))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    color: "hsl(var(--cream))",
  } as const;

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Header */}
      <header className="border-b border-white/10 bg-navy/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-extrabold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-coral text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            AP Digital
          </a>
          <span className="text-xs sm:text-sm text-cream/50 font-medium">Funnel Calculator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-gold font-bold tracking-[0.2em] text-xs">LIVE MODEL</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black leading-[1.05]">
            Funnel Revenue <span className="text-coral">Calculator</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-cream/70">
            Move any slider to model your funnel at any traffic level. Numbers update in real time.
          </p>
        </div>

        {/* SLIDERS */}
        <section className="mt-14 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-8">Inputs</h2>
          <div className="grid gap-7 sm:gap-8 sm:grid-cols-2">
            {sliders.map((s) => (
              <div key={s.key}>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-sm font-semibold text-cream/80">{s.label}</label>
                  <span className="text-xl sm:text-2xl font-black text-gold tabular-nums">
                    {s.format(state[s.key])}
                  </span>
                </div>
                <CoralSlider
                  value={state[s.key]}
                  onChange={(v) => update(s.key, v)}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                />
                <div className="mt-1.5 flex justify-between text-[10px] text-cream/40 tabular-nums">
                  <span>{s.format(s.min)}</span>
                  <span>{s.format(s.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6">Key Metrics</h2>
          <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3">
            <KpiCard label="Daily Buyers" value={m.dailyBuyers.toFixed(1)} status={buyersStatus} />
            <KpiCard label="Daily Revenue" value={fmtMoney(m.dailyRev)} status={revStatus} />
            <KpiCard label="Average Order Value" value={fmtMoney(m.aov)} status={aovStatus} />
            <KpiCard label="Monthly Revenue" value={fmtMoney(m.monthlyRev)} status={monthlyStatus} />
            <KpiCard label="Annual Revenue" value={fmtMoney(m.annualRev)} />
            <KpiCard
              label="ROAS"
              value={m.roas === null ? "Organic" : `${m.roas.toFixed(1)}x`}
              status={roasStatus}
            />
            <KpiCard
              label="CPA"
              value={m.adSpend === 0 ? "—" : fmtMoney(m.cpa)}
              status={cpaStatus}
              hint={m.adSpend === 0 ? "No ad spend" : undefined}
            />
            <KpiCard
              label="Break-Even CPC"
              value={fmtMoney(m.breakEvenCpc)}
              hint="Max you can pay per click"
            />
            <KpiCard label="Profit Margin" value={`${m.profitMargin.toFixed(0)}%`} status={marginStatus} />
          </div>
        </section>

        {/* CHARTS */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-extrabold">Revenue Breakdown</h3>
            <p className="text-xs text-cream/50 mt-1">Daily $ contribution per funnel tier</p>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cream)/0.08)" />
                  <XAxis dataKey="name" stroke="hsl(var(--cream)/0.6)" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--cream)/0.6)"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [fmtMoney(v), "Revenue"]}
                    cursor={{ fill: "hsl(var(--cream)/0.05)" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-extrabold">30-Day Projection</h3>
            <p className="text-xs text-cream/50 mt-1">Cumulative revenue with vs. without ads</p>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cream)/0.08)" />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--cream)/0.6)"
                    fontSize={12}
                    tickFormatter={(v) => `D${v}`}
                  />
                  <YAxis
                    stroke="hsl(var(--cream)/0.6)"
                    fontSize={12}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => fmtMoney(v)}
                    labelFormatter={(l) => `Day ${l}`}
                  />
                  <Legend wrapperStyle={{ color: "hsl(var(--cream))", fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="Without Ads (Gross)"
                    stroke="hsl(var(--gold))"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="With Ads (Net)"
                    stroke="hsl(var(--coral))"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* COPY SUMMARY */}
        <section className="mt-12 text-center">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-extrabold text-base sm:text-lg transition-all duration-300 ${
              copied
                ? "bg-[hsl(145_63%_42%)] text-white"
                : "bg-gold text-navy hover:-translate-y-1 shadow-[0_14px_30px_-10px_hsl(var(--gold)/0.55)]"
            }`}
          >
            {copied ? (
              <>
                <ClipboardCheck className="h-5 w-5" /> Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="h-5 w-5" /> Copy Summary
              </>
            )}
          </button>
          <p className="mt-3 text-xs text-cream/50">Pastes a clean text summary anywhere.</p>
        </section>
      </main>

      <footer className="border-t border-white/10 mt-12 py-8 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} AP Digital · Funnel Calculator
      </footer>
    </div>
  );
};

export default Calculator;
