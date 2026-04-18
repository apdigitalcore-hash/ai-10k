import { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sparkles, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusColor = "green" | "yellow" | "red";

interface WeekInputs {
  visitors: number;
  conversionRate: number;
  unitsSold: number;
  revFrontEnd: number;
  revBump: number;
  revOto1: number;
  revOto2: number;
  revDownsell: number;
  adSpend: number;
  emailOpenRate: number;
  emailCTR: number;
  refundRate: number;
  newSubscribers: number;
}

interface ComputedKPIs {
  totalRevenue: number;
  aov: number;
  roas: number | null;
  refundRate: number;
  conversionRate: number;
  emailOpenRate: number;
  emailCTR: number;
  newSubscribers: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const DEFAULT_WEEK: WeekInputs = {
  visitors: 0,
  conversionRate: 0,
  unitsSold: 0,
  revFrontEnd: 0,
  revBump: 0,
  revOto1: 0,
  revOto2: 0,
  revDownsell: 0,
  adSpend: 0,
  emailOpenRate: 0,
  emailCTR: 0,
  refundRate: 0,
  newSubscribers: 0,
};

function compute(w: WeekInputs): ComputedKPIs {
  const totalRevenue =
    w.revFrontEnd + w.revBump + w.revOto1 + w.revOto2 + w.revDownsell;
  const aov = w.unitsSold > 0 ? totalRevenue / w.unitsSold : 0;
  const roas = w.adSpend > 0 ? totalRevenue / w.adSpend : null;
  return {
    totalRevenue,
    aov,
    roas,
    refundRate: w.refundRate,
    conversionRate: w.conversionRate,
    emailOpenRate: w.emailOpenRate,
    emailCTR: w.emailCTR,
    newSubscribers: w.newSubscribers,
  };
}

function revStatus(rev: number): StatusColor {
  if (rev >= 200) return "green";
  if (rev >= 50) return "yellow";
  return "red";
}
function aovStatus(aov: number): StatusColor {
  if (aov >= 25) return "green";
  if (aov >= 15) return "yellow";
  return "red";
}
function roasStatus(roas: number | null): StatusColor {
  if (roas === null) return "green"; // organic — treated as green
  if (roas >= 2) return "green";
  if (roas >= 1) return "yellow";
  return "red";
}
function refundStatus(rate: number): StatusColor {
  if (rate < 3) return "green";
  if (rate < 5) return "yellow";
  return "red";
}
function convStatus(rate: number): StatusColor {
  if (rate >= 3) return "green";
  if (rate >= 1) return "yellow";
  return "red";
}
function openRateStatus(rate: number): StatusColor {
  if (rate >= 25) return "green";
  if (rate >= 15) return "yellow";
  return "red";
}
function ctrStatus(rate: number): StatusColor {
  if (rate >= 3) return "green";
  if (rate >= 1) return "yellow";
  return "red";
}

const statusBadgeClass: Record<StatusColor, string> = {
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  yellow: "bg-gold/15 text-gold border-gold/30",
  red: "bg-coral/15 text-coral border-coral/30",
};

const statusLabel: Record<StatusColor, string> = {
  green: "Healthy",
  yellow: "Watch",
  red: "Fix",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NumberInput({
  label,
  prefix,
  suffix,
  value,
  onChange,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-wide text-cream/60 mb-1.5">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-white/15 bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-coral/40">
        {prefix && (
          <span className="px-3 text-cream/40 text-sm select-none">{prefix}</span>
        )}
        <input
          type="number"
          min={0}
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none min-w-0"
        />
        {suffix && (
          <span className="px-3 text-cream/40 text-sm select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  status,
  delta,
}: {
  label: string;
  value: string;
  status?: StatusColor;
  delta?: number | null;
}) {
  const DeltaIcon =
    delta == null || delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown;
  const deltaColor =
    delta == null || delta === 0
      ? "text-cream/40"
      : delta > 0
      ? "text-green-400"
      : "text-coral";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream/60 leading-tight">
          {label}
        </p>
        {status && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${statusBadgeClass[status]}`}
          >
            {statusLabel[status]}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-black text-cream leading-none tabular-nums">
        {value}
      </p>
      {delta != null && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${deltaColor}`}>
          <DeltaIcon className="h-3.5 w-3.5" />
          <span>
            {delta > 0 ? "+" : ""}
            {typeof delta === "number" && !Number.isInteger(delta)
              ? delta.toFixed(1)
              : delta}{" "}
            vs last week
          </span>
        </div>
      )}
    </div>
  );
}

// Custom tooltip style
const tooltipStyle = {
  backgroundColor: "hsl(var(--navy-deep))",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "hsl(var(--cream))",
} as const;

// ─── Main Component ────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [thisWeek, setThisWeek] = useState<WeekInputs>({ ...DEFAULT_WEEK });
  const [lastWeek, setLastWeek] = useState<WeekInputs>({ ...DEFAULT_WEEK });
  const [calculated, setCalculated] = useState(false);
  const [kpis, setKpis] = useState<{ this: ComputedKPIs; last: ComputedKPIs } | null>(null);

  const updateThis = useCallback(
    (key: keyof WeekInputs) => (v: number) =>
      setThisWeek((prev) => ({ ...prev, [key]: v })),
    []
  );
  const updateLast = useCallback(
    (key: keyof WeekInputs) => (v: number) =>
      setLastWeek((prev) => ({ ...prev, [key]: v })),
    []
  );

  const handleCalculate = () => {
    setKpis({ this: compute(thisWeek), last: compute(lastWeek) });
    setCalculated(true);
  };

  const handleExportCSV = () => {
    if (!kpis) return;
    const tw = kpis.this;
    const lw = kpis.last;
    const rows = [
      ["Metric", "This Week", "Last Week"],
      ["Total Revenue", tw.totalRevenue, lw.totalRevenue],
      ["AOV", tw.aov.toFixed(2), lw.aov.toFixed(2)],
      [
        "ROAS",
        tw.roas === null ? "Organic" : tw.roas.toFixed(2),
        lw.roas === null ? "Organic" : lw.roas.toFixed(2),
      ],
      ["Refund Rate %", tw.refundRate, lw.refundRate],
      ["Conversion Rate %", tw.conversionRate, lw.conversionRate],
      ["Email Open Rate %", tw.emailOpenRate, lw.emailOpenRate],
      ["Email CTR %", tw.emailCTR, lw.emailCTR],
      ["New Subscribers", tw.newSubscribers, lw.newSubscribers],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_week_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Computed deltas
  const delta = kpis
    ? {
        totalRevenue: kpis.this.totalRevenue - kpis.last.totalRevenue,
        aov: kpis.this.aov - kpis.last.aov,
        roas:
          kpis.this.roas !== null && kpis.last.roas !== null
            ? kpis.this.roas - kpis.last.roas
            : null,
        refundRate: kpis.this.refundRate - kpis.last.refundRate,
        conversionRate: kpis.this.conversionRate - kpis.last.conversionRate,
        emailOpenRate: kpis.this.emailOpenRate - kpis.last.emailOpenRate,
        emailCTR: kpis.this.emailCTR - kpis.last.emailCTR,
        newSubscribers: kpis.this.newSubscribers - kpis.last.newSubscribers,
      }
    : null;

  // Chart data
  const revenueBreakdownData = calculated
    ? [
        { name: "Front-End", value: thisWeek.revFrontEnd },
        { name: "Bump", value: thisWeek.revBump },
        { name: "OTO1", value: thisWeek.revOto1 },
        { name: "OTO2", value: thisWeek.revOto2 },
        { name: "Downsell", value: thisWeek.revDownsell },
      ]
    : [];

  const funnelData = calculated
    ? [
        { name: "Visitors", value: thisWeek.visitors },
        {
          name: "Buyers",
          value: Math.round((thisWeek.visitors * thisWeek.conversionRate) / 100),
        },
        {
          name: "Bump",
          value:
            thisWeek.revBump > 0 && thisWeek.revFrontEnd > 0
              ? Math.round(
                  (thisWeek.visitors * thisWeek.conversionRate) / 100
                )
              : 0,
        },
        { name: "OTO1", value: thisWeek.unitsSold > 0 ? Math.round(thisWeek.unitsSold * 0.15) : 0 },
        { name: "OTO2", value: thisWeek.unitsSold > 0 ? Math.round(thisWeek.unitsSold * 0.1) : 0 },
      ]
    : [];

  // Health check analysis
  const getHealthItems = () => {
    if (!kpis) return { working: [] as string[], watch: [] as string[], bottleneck: "" };
    const tw = kpis.this;
    const working: string[] = [];
    const watch: string[] = [];
    let bottleneck = "";
    let worstScore = Infinity;

    const checks: Array<{ label: string; status: StatusColor; score: number }> = [
      {
        label: `Revenue ${fmtMoney(tw.totalRevenue)} this week`,
        status: revStatus(tw.totalRevenue / 7),
        score: tw.totalRevenue / 7,
      },
      { label: `AOV ${fmtMoney(tw.aov)}`, status: aovStatus(tw.aov), score: tw.aov },
      {
        label: `ROAS ${tw.roas === null ? "organic" : tw.roas.toFixed(1) + "x"}`,
        status: roasStatus(tw.roas),
        score: tw.roas ?? 99,
      },
      {
        label: `Refund rate ${fmtPct(tw.refundRate)}`,
        status: refundStatus(tw.refundRate),
        score: tw.refundRate === 0 ? 99 : 100 / tw.refundRate,
      },
      {
        label: `Conversion rate ${fmtPct(tw.conversionRate)}`,
        status: convStatus(tw.conversionRate),
        score: tw.conversionRate,
      },
      {
        label: `Email open rate ${fmtPct(tw.emailOpenRate)}`,
        status: openRateStatus(tw.emailOpenRate),
        score: tw.emailOpenRate,
      },
      {
        label: `Email CTR ${fmtPct(tw.emailCTR)}`,
        status: ctrStatus(tw.emailCTR),
        score: tw.emailCTR,
      },
    ];

    for (const c of checks) {
      if (c.status === "green") working.push(c.label);
      else if (c.status === "yellow") watch.push(c.label);
      else if (c.status === "red" && c.score < worstScore) {
        worstScore = c.score;
        bottleneck = c.label;
      }
    }

    return { working, watch, bottleneck };
  };

  const getTopActions = () => {
    if (!kpis) return [];
    const tw = kpis.this;
    const actions: Array<{ priority: number; text: string }> = [];

    if (convStatus(tw.conversionRate) === "red")
      actions.push({ priority: 1, text: "A/B test your headline — conversion rate is under 1%. One headline change can 3x this." });
    if (aovStatus(tw.aov) === "red")
      actions.push({ priority: 2, text: "Add or rework your order bump. AOV under $15 means buyers aren't seeing the upsell." });
    if (refundStatus(tw.refundRate) === "red")
      actions.push({ priority: 3, text: "Send a proactive 'how to use this' email within 24h of purchase. Refunds spike when buyers feel lost." });
    if (openRateStatus(tw.emailOpenRate) === "red")
      actions.push({ priority: 4, text: "Rewrite subject lines with curiosity gaps — open rates under 15% mean the subject isn't landing." });
    if (ctrStatus(tw.emailCTR) === "red")
      actions.push({ priority: 5, text: "Add a single bold CTA button per email — CTR under 1% means your email body isn't creating urgency." });
    if (roasStatus(tw.roas) === "red" && tw.roas !== null)
      actions.push({ priority: 6, text: "Pause your lowest-performing ad sets immediately — ROAS under 1 means you're paying to lose money." });

    return actions.slice(0, 3);
  };

  const health = getHealthItems();
  const topActions = getTopActions();

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
          <span className="text-xs sm:text-sm text-cream/50 font-medium">Weekly Dashboard</span>
          {calculated && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 text-cream/70 px-3 py-1.5 text-xs font-bold hover:border-white/40 hover:text-cream transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* PAGE TITLE */}
        <div className="mb-10">
          <p className="text-coral font-bold tracking-[0.2em] text-xs">ANALYTICS</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black">Weekly Metrics Dashboard</h1>
          <p className="mt-3 text-sm text-cream/60">
            Enter this week and last week's numbers to get your health score, charts, and action
            plan.
          </p>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* This week */}
            <div>
              <h2 className="text-lg font-extrabold mb-5 text-gold">This Week</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput label="Visitors" value={thisWeek.visitors} onChange={updateThis("visitors")} />
                <NumberInput label="Conversion Rate" suffix="%" value={thisWeek.conversionRate} onChange={updateThis("conversionRate")} />
                <NumberInput label="Units Sold" value={thisWeek.unitsSold} onChange={updateThis("unitsSold")} />
                <NumberInput label="Front-End Revenue" prefix="$" value={thisWeek.revFrontEnd} onChange={updateThis("revFrontEnd")} />
                <NumberInput label="Bump Revenue" prefix="$" value={thisWeek.revBump} onChange={updateThis("revBump")} />
                <NumberInput label="OTO1 Revenue" prefix="$" value={thisWeek.revOto1} onChange={updateThis("revOto1")} />
                <NumberInput label="OTO2 Revenue" prefix="$" value={thisWeek.revOto2} onChange={updateThis("revOto2")} />
                <NumberInput label="Downsell Revenue" prefix="$" value={thisWeek.revDownsell} onChange={updateThis("revDownsell")} />
                <NumberInput label="Ad Spend" prefix="$" value={thisWeek.adSpend} onChange={updateThis("adSpend")} />
                <NumberInput label="Email Open Rate" suffix="%" value={thisWeek.emailOpenRate} onChange={updateThis("emailOpenRate")} />
                <NumberInput label="Email CTR" suffix="%" value={thisWeek.emailCTR} onChange={updateThis("emailCTR")} />
                <NumberInput label="Refund Rate" suffix="%" value={thisWeek.refundRate} onChange={updateThis("refundRate")} />
                <div className="sm:col-span-2">
                  <NumberInput label="New Subscribers" value={thisWeek.newSubscribers} onChange={updateThis("newSubscribers")} />
                </div>
              </div>
            </div>

            {/* Last week */}
            <div>
              <h2 className="text-lg font-extrabold mb-5 text-cream/50">Last Week</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput label="Visitors" value={lastWeek.visitors} onChange={updateLast("visitors")} />
                <NumberInput label="Conversion Rate" suffix="%" value={lastWeek.conversionRate} onChange={updateLast("conversionRate")} />
                <NumberInput label="Units Sold" value={lastWeek.unitsSold} onChange={updateLast("unitsSold")} />
                <NumberInput label="Front-End Revenue" prefix="$" value={lastWeek.revFrontEnd} onChange={updateLast("revFrontEnd")} />
                <NumberInput label="Bump Revenue" prefix="$" value={lastWeek.revBump} onChange={updateLast("revBump")} />
                <NumberInput label="OTO1 Revenue" prefix="$" value={lastWeek.revOto1} onChange={updateLast("revOto1")} />
                <NumberInput label="OTO2 Revenue" prefix="$" value={lastWeek.revOto2} onChange={updateLast("revOto2")} />
                <NumberInput label="Downsell Revenue" prefix="$" value={lastWeek.revDownsell} onChange={updateLast("revDownsell")} />
                <NumberInput label="Ad Spend" prefix="$" value={lastWeek.adSpend} onChange={updateLast("adSpend")} />
                <NumberInput label="Email Open Rate" suffix="%" value={lastWeek.emailOpenRate} onChange={updateLast("emailOpenRate")} />
                <NumberInput label="Email CTR" suffix="%" value={lastWeek.emailCTR} onChange={updateLast("emailCTR")} />
                <NumberInput label="Refund Rate" suffix="%" value={lastWeek.refundRate} onChange={updateLast("refundRate")} />
                <div className="sm:col-span-2">
                  <NumberInput label="New Subscribers" value={lastWeek.newSubscribers} onChange={updateLast("newSubscribers")} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center gap-2 rounded-2xl bg-gold text-navy font-extrabold text-base sm:text-lg px-10 py-4 hover:-translate-y-1 transition-transform duration-200 shadow-[0_14px_30px_-10px_hsl(var(--gold)/0.55)]"
            >
              Calculate &rarr;
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        {calculated && kpis && delta && (
          <>
            <section className="mt-12">
              <p className="text-coral font-bold tracking-[0.2em] text-xs mb-5">KEY METRICS</p>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <KpiCard
                  label="Total Revenue"
                  value={fmtMoney(kpis.this.totalRevenue)}
                  status={revStatus(kpis.this.totalRevenue / 7)}
                  delta={delta.totalRevenue}
                />
                <KpiCard
                  label="AOV"
                  value={fmtMoney(kpis.this.aov)}
                  status={aovStatus(kpis.this.aov)}
                  delta={delta.aov}
                />
                <KpiCard
                  label="ROAS"
                  value={
                    kpis.this.roas === null
                      ? "Organic"
                      : `${kpis.this.roas.toFixed(1)}x`
                  }
                  status={roasStatus(kpis.this.roas)}
                  delta={delta.roas}
                />
                <KpiCard
                  label="Refund Rate"
                  value={fmtPct(kpis.this.refundRate)}
                  status={refundStatus(kpis.this.refundRate)}
                  delta={delta.refundRate}
                />
                <KpiCard
                  label="Conversion Rate"
                  value={fmtPct(kpis.this.conversionRate)}
                  status={convStatus(kpis.this.conversionRate)}
                  delta={delta.conversionRate}
                />
                <KpiCard
                  label="Email Open Rate"
                  value={fmtPct(kpis.this.emailOpenRate)}
                  status={openRateStatus(kpis.this.emailOpenRate)}
                  delta={delta.emailOpenRate}
                />
                <KpiCard
                  label="Email CTR"
                  value={fmtPct(kpis.this.emailCTR)}
                  status={ctrStatus(kpis.this.emailCTR)}
                  delta={delta.emailCTR}
                />
                <KpiCard
                  label="New Subscribers"
                  value={kpis.this.newSubscribers.toLocaleString()}
                  delta={delta.newSubscribers}
                />
              </div>
            </section>

            {/* CHARTS */}
            <section className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-extrabold mb-1">Revenue by Tier</h3>
                <p className="text-xs text-cream/50 mb-4">This week's $ per funnel stage</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueBreakdownData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={11}
                        tickFormatter={(v: number) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => [fmtMoney(v), "Revenue"]}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--coral))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-extrabold mb-1">Conversion Funnel</h3>
                <p className="text-xs text-cream/50 mb-4">Visitors → through each step</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={funnelData}
                      margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={11}
                        width={55}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => [v.toLocaleString(), "People"]}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--gold))"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* HEALTH CHECK */}
            <section className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-extrabold mb-5">Health Check</h3>
                {health.working.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-green-400 mb-2">What's Working</p>
                    <ul className="space-y-1.5">
                      {health.working.map((item) => (
                        <li key={item} className="text-sm text-cream/80 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">+</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {health.watch.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gold mb-2">What to Watch</p>
                    <ul className="space-y-1.5">
                      {health.watch.map((item) => (
                        <li key={item} className="text-sm text-cream/80 flex items-start gap-2">
                          <span className="text-gold mt-0.5">~</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {health.bottleneck && (
                  <div>
                    <p className="text-xs font-bold text-coral mb-2">#1 Bottleneck</p>
                    <p className="text-sm text-cream/80 flex items-start gap-2">
                      <span className="text-coral mt-0.5">!</span>
                      {health.bottleneck}
                    </p>
                  </div>
                )}
                {!health.working.length && !health.watch.length && !health.bottleneck && (
                  <p className="text-sm text-cream/40">Enter data above to see analysis.</p>
                )}
              </div>

              {/* TOP ACTIONS */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-extrabold mb-5">Top 3 Actions</h3>
                {topActions.length > 0 ? (
                  <ol className="space-y-4">
                    {topActions.map((action, i) => (
                      <li
                        key={i}
                        className="flex gap-4 pl-4 border-l-2 border-coral"
                      >
                        <div>
                          <p className="text-xs font-black text-coral mb-1">#{i + 1}</p>
                          <p className="text-sm text-cream/80 leading-relaxed">{action.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-green-400">
                    All key metrics are healthy. Keep it up!
                  </p>
                )}
              </div>
            </section>

            {/* WEEK-OVER-WEEK TABLE */}
            <section className="mt-12">
              <p className="text-coral font-bold tracking-[0.2em] text-xs mb-5">
                WEEK-OVER-WEEK
              </p>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 text-xs font-bold tracking-wider text-cream/50">
                        Metric
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-bold tracking-wider text-cream/50">
                        This Week
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-bold tracking-wider text-cream/50">
                        Last Week
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-bold tracking-wider text-cream/50">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "Total Revenue",
                        tw: fmtMoney(kpis.this.totalRevenue),
                        lw: fmtMoney(kpis.last.totalRevenue),
                        d: delta.totalRevenue,
                        fmt: (n: number) => (n >= 0 ? `+${fmtMoney(n)}` : fmtMoney(n)),
                      },
                      {
                        label: "AOV",
                        tw: fmtMoney(kpis.this.aov),
                        lw: fmtMoney(kpis.last.aov),
                        d: delta.aov,
                        fmt: (n: number) => (n >= 0 ? `+${fmtMoney(n)}` : fmtMoney(n)),
                      },
                      {
                        label: "Conversion Rate",
                        tw: fmtPct(kpis.this.conversionRate),
                        lw: fmtPct(kpis.last.conversionRate),
                        d: delta.conversionRate,
                        fmt: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`,
                      },
                      {
                        label: "Refund Rate",
                        tw: fmtPct(kpis.this.refundRate),
                        lw: fmtPct(kpis.last.refundRate),
                        d: delta.refundRate,
                        fmt: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`,
                      },
                      {
                        label: "Email Open Rate",
                        tw: fmtPct(kpis.this.emailOpenRate),
                        lw: fmtPct(kpis.last.emailOpenRate),
                        d: delta.emailOpenRate,
                        fmt: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`,
                      },
                      {
                        label: "Email CTR",
                        tw: fmtPct(kpis.this.emailCTR),
                        lw: fmtPct(kpis.last.emailCTR),
                        d: delta.emailCTR,
                        fmt: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`,
                      },
                      {
                        label: "New Subscribers",
                        tw: kpis.this.newSubscribers.toLocaleString(),
                        lw: kpis.last.newSubscribers.toLocaleString(),
                        d: delta.newSubscribers,
                        fmt: (n: number) => `${n >= 0 ? "+" : ""}${n.toLocaleString()}`,
                      },
                    ].map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-white/5 last:border-0 hover:bg-white/3"
                      >
                        <td className="px-5 py-3 text-cream/80 font-medium">{row.label}</td>
                        <td className="px-5 py-3 text-right text-cream font-bold tabular-nums">
                          {row.tw}
                        </td>
                        <td className="px-5 py-3 text-right text-cream/50 tabular-nums">
                          {row.lw}
                        </td>
                        <td
                          className={`px-5 py-3 text-right font-bold tabular-nums ${
                            row.d > 0
                              ? "text-green-400"
                              : row.d < 0
                              ? "text-coral"
                              : "text-cream/30"
                          }`}
                        >
                          {row.fmt(row.d)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-navy-deep text-cream/70 px-5 sm:px-8 py-10 text-center text-sm mt-12">
        © {new Date().getFullYear()} AP Digital · support@apdigital.co
      </footer>
    </div>
  );
};

export default Dashboard;
