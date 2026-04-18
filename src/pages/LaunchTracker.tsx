import { useEffect, useMemo, useRef, useState } from "react";
import { CheckSquare, Download, Plus, RefreshCw, Rocket, Sparkles, Square, Trash2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "not-started" | "in-progress" | "done";
type Category = "Technical" | "Content" | "Email" | "Affiliates" | "Ads";

interface Task {
  id: string;
  text: string;
  category: Category;
  status: Status;
  notes: string;
}

interface DayData {
  day: number;
  tasks: Task[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ai-10k-launch-tracker";
const CATEGORIES: Category[] = ["Technical", "Content", "Email", "Affiliates", "Ads"];

const CATEGORY_COLORS: Record<Category, string> = {
  Technical: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Content: "bg-gold/15 text-gold border-gold/30",
  Email: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Affiliates: "bg-green-500/15 text-green-400 border-green-500/30",
  Ads: "bg-coral/15 text-coral border-coral/30",
};

// ─── Pre-loaded tasks ─────────────────────────────────────────────────────────

function makeid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeTask(text: string, category: Category): Task {
  return { id: makeid(), text, category, status: "not-started", notes: "" };
}

const PRESET_TASKS: Record<number, Task[]> = {
  [-7]: [
    makeTask("Set up checkout platform", "Technical"),
    makeTask("Create product listing", "Technical"),
    makeTask("Upload PDF and configure delivery", "Technical"),
    makeTask("Test full purchase flow", "Technical"),
  ],
  [-6]: [
    makeTask("Connect sales page to checkout URL", "Technical"),
    makeTask("Finalize all sales page copy", "Content"),
    makeTask("Set up order bump", "Technical"),
    makeTask("Test order bump flow", "Technical"),
  ],
  [-5]: [
    makeTask("Publish OTO1 and connect YES/NO links", "Technical"),
    makeTask("Publish OTO2 and connect YES/NO links", "Technical"),
    makeTask("Publish downsell page", "Technical"),
    makeTask("Test full post-checkout flow", "Technical"),
  ],
  [-4]: [
    makeTask("Set up welcome sequence (5 emails)", "Email"),
    makeTask("Set up cart abandonment sequence", "Email"),
    makeTask("Test all email automations", "Technical"),
    makeTask("Verify PDF delivery", "Technical"),
  ],
  [-3]: [
    makeTask("Record videos 1-5 using scripts", "Content"),
    makeTask("Record videos 6-10 using scripts", "Content"),
    makeTask("Edit and caption all 10 videos", "Content"),
    makeTask("Schedule videos Days -2 through +3", "Content"),
  ],
  [-2]: [
    makeTask("Schedule 20 tweets", "Content"),
    makeTask("Post Twitter thread", "Content"),
    makeTask("Write and schedule 5 LinkedIn posts", "Content"),
    makeTask("Schedule 10 Pinterest pins", "Content"),
  ],
  [-1]: [
    makeTask("Send 10 cold outreach DMs", "Affiliates"),
    makeTask("Send 10 warm DMs", "Affiliates"),
    makeTask("Email 10 larger creators", "Affiliates"),
    makeTask("Set up affiliate tracking links", "Affiliates"),
    makeTask('Send waitlist "Tomorrow. $9. Be ready." email', "Email"),
  ],
  [0]: [
    makeTask("Send launch blast email", "Email"),
    makeTask("Post Twitter announcement", "Content"),
    makeTask("Post Twitter thread", "Content"),
    makeTask("Post LinkedIn launch post", "Content"),
    makeTask("Post Instagram carousel", "Content"),
    makeTask("Post Instagram stories", "Content"),
    makeTask("Post TikTok launch video", "Content"),
    makeTask("Post Reddit in r/Entrepreneur", "Content"),
    makeTask("Monitor checkout for issues", "Technical"),
    makeTask("Verify emails delivering", "Technical"),
  ],
  [1]: [
    makeTask("Post 3 TikToks", "Content"),
    makeTask("Repost top performers from Day 0", "Content"),
    makeTask("Send Day 1 follow-up to non-buyers", "Email"),
  ],
  [2]: [
    makeTask("Share first buyer testimonials", "Content"),
    makeTask("Follow up non-responding affiliates", "Affiliates"),
    makeTask("Post 3 more TikToks", "Content"),
  ],
  [3]: [
    makeTask("Mid-launch bonus announcement email", "Email"),
    makeTask("Post bonus announcement all platforms", "Content"),
    makeTask("Post 3 TikToks", "Content"),
  ],
  [4]: [makeTask("Analyze top performing content from first 3 days", "Content")],
  [5]: [
    makeTask("Price increase warning email", "Email"),
    makeTask("Post price warning all platforms", "Content"),
    makeTask("Review ad performance — pause losers scale winners", "Ads"),
  ],
  [6]: [],
  [7]: [
    makeTask("Raise price to $27", "Technical"),
    makeTask("Send price raised email to non-buyers", "Email"),
    makeTask("Post results publicly", "Content"),
    makeTask("Post victory lap all platforms", "Content"),
  ],
};

const ALL_DAYS = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

function buildInitialDays(): DayData[] {
  return ALL_DAYS.map((day) => ({
    day,
    tasks: (PRESET_TASKS[day] ?? []).map((t) => ({ ...t, id: makeid() })),
  }));
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

interface StoredData {
  launchDate: string | null;
  days: DayData[];
}

function loadFromStorage(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredData;
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function getDayDate(launchDate: string, dayOffset: number): Date {
  const d = new Date(launchDate);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getTodayOffset(launchDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const launch = new Date(launchDate);
  launch.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - launch.getTime()) / 86400000);
}

function getCountdownParts(launchDate: string): {
  days: number;
  hours: number;
  minutes: number;
  launched: boolean;
} {
  const diff = new Date(launchDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, launched: true };
  const totalMin = Math.floor(diff / 60000);
  return {
    days: Math.floor(totalMin / 1440),
    hours: Math.floor((totalMin % 1440) / 60),
    minutes: totalMin % 60,
    launched: false,
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────

const LaunchTracker = () => {
  const initialized = useRef(false);

  const [launchDate, setLaunchDate] = useState<string | null>(null);
  const [days, setDays] = useState<DayData[]>(buildInitialDays);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");

  // Add-task form state
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCat, setNewTaskCat] = useState<Category>("Technical");

  // Notes expand state: taskId → boolean
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  // Launch date input (controlled separately before saving)
  const [launchDateInput, setLaunchDateInput] = useState("");

  // ── Load from localStorage once ────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = loadFromStorage();
    if (!stored) return;
    setLaunchDate(stored.launchDate);
    if (stored.days?.length) setDays(stored.days);
  }, []);

  // ── Persist whenever state changes ──────────────────────────────────────────
  useEffect(() => {
    if (!initialized.current) return;
    saveToStorage({ launchDate, days });
  }, [launchDate, days]);

  // ── Countdown (update every minute) ─────────────────────────────────────────
  const [countdown, setCountdown] = useState(() =>
    launchDate ? getCountdownParts(launchDate) : null
  );
  useEffect(() => {
    if (!launchDate) return;
    setCountdown(getCountdownParts(launchDate));
    const id = setInterval(() => setCountdown(getCountdownParts(launchDate)), 60000);
    return () => clearInterval(id);
  }, [launchDate]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const todayOffset = launchDate ? getTodayOffset(launchDate) : null;

  const totalTasks = useMemo(() => days.reduce((s, d) => s + d.tasks.length, 0), [days]);
  const doneTasks = useMemo(
    () => days.reduce((s, d) => s + d.tasks.filter((t) => t.status === "done").length, 0),
    [days]
  );

  const selectedDayData = days.find((d) => d.day === selectedDay);

  const visibleTasks = useMemo(
    () =>
      (selectedDayData?.tasks ?? []).filter(
        (t) => categoryFilter === "All" || t.category === categoryFilter
      ),
    [selectedDayData, categoryFilter]
  );

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const updateTask = (dayNum: number, taskId: string, patch: Partial<Task>) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day !== dayNum
          ? d
          : { ...d, tasks: d.tasks.map((t) => (t.id !== taskId ? t : { ...t, ...patch })) }
      )
    );
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: makeid(),
      text: newTaskText.trim(),
      category: newTaskCat,
      status: "not-started",
      notes: "",
    };
    setDays((prev) =>
      prev.map((d) => (d.day !== selectedDay ? d : { ...d, tasks: [...d.tasks, task] }))
    );
    setNewTaskText("");
    setAddingTask(false);
  };

  const deleteTask = (dayNum: number, taskId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day !== dayNum ? d : { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) }
      )
    );
  };

  const handleSetLaunchDate = () => {
    if (!launchDateInput) return;
    setLaunchDate(launchDateInput);
  };

  const handleReset = () => {
    if (!confirm("Reset all task statuses and notes? (Tasks are kept, only progress is cleared)"))
      return;
    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        tasks: d.tasks.map((t) => ({ ...t, status: "not-started" as Status, notes: "" })),
      }))
    );
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ launchDate, days }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `launch-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleNotes = (taskId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // ── Pill label helper ────────────────────────────────────────────────────────
  const pillLabel = (day: number) => {
    if (day === 0) return "DAY 0";
    return day < 0 ? `Day ${day}` : `Day +${day}`;
  };

  const dayHasOverdue = (d: DayData) => {
    if (!launchDate) return false;
    const dayDate = getDayDate(launchDate, d.day);
    dayDate.setHours(23, 59, 59, 999);
    return dayDate < new Date() && d.tasks.some((t) => t.status !== "done");
  };

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur border-b border-white/10 px-5 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between flex-1 gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-extrabold flex-shrink-0">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-coral text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              AP Digital
            </a>
            <span className="hidden sm:block text-cream/30">·</span>
            <span className="hidden sm:block text-xs sm:text-sm text-cream/50 font-medium">
              Launch Tracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 rounded-lg border border-coral/40 text-coral px-3 py-1.5 text-xs font-bold hover:border-coral hover:bg-coral/10 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 text-cream/50 px-3 py-1.5 text-xs font-bold hover:border-white/30 hover:text-cream/80 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 sm:min-w-[220px]">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral rounded-full transition-all duration-500"
              style={{ width: totalTasks > 0 ? `${(doneTasks / totalTasks) * 100}%` : "0%" }}
            />
          </div>
          <span className="text-[11px] font-bold text-cream/60 whitespace-nowrap">
            {doneTasks}/{totalTasks} tasks
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* LAUNCH DATE SETUP */}
        {!launchDate && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg mx-auto text-center">
            <Rocket className="h-12 w-12 text-gold mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">Set Your Launch Date</h2>
            <p className="text-sm text-cream/60 mb-6">
              Pick the day your product goes live. We'll map all 14 days around it.
            </p>
            <div className="flex gap-3">
              <input
                type="date"
                value={launchDateInput}
                onChange={(e) => setLaunchDateInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button
                type="button"
                onClick={handleSetLaunchDate}
                disabled={!launchDateInput}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold text-navy font-extrabold px-5 py-2.5 text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-40"
              >
                Set Launch Date &rarr;
              </button>
            </div>
          </div>
        )}

        {launchDate && (
          <>
            {/* COUNTDOWN BANNER */}
            <div className="mb-8 rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {countdown?.launched ? (
                <div className="flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-gold" />
                  <span className="text-xl font-black text-gold">LAUNCHED!</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Rocket className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="flex items-center gap-5 flex-wrap">
                    {[
                      { label: "DAYS", value: countdown?.days ?? 0 },
                      { label: "HOURS", value: countdown?.hours ?? 0 },
                      { label: "MINUTES", value: countdown?.minutes ?? 0 },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <p className="text-2xl font-black text-gold tabular-nums leading-none">
                          {String(value).padStart(2, "0")}
                        </p>
                        <p className="text-[9px] font-bold tracking-[0.15em] text-cream/40 mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-cream/60">until launch</p>
                </div>
              )}
              <p className="text-sm text-cream/50">
                Launch day:{" "}
                <span className="text-gold font-bold">
                  {new Date(launchDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>

            {/* DAY SELECTOR */}
            <div className="mb-6 overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-2 w-max">
                {days.map((d) => {
                  const isSelected = d.day === selectedDay;
                  const isToday = todayOffset === d.day;
                  const isLaunch = d.day === 0;
                  const overdue = dayHasOverdue(d);
                  const donePct =
                    d.tasks.length > 0
                      ? d.tasks.filter((t) => t.status === "done").length / d.tasks.length
                      : 1;

                  let pillClass =
                    "relative flex flex-col items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap flex-shrink-0 border ";

                  if (isSelected) {
                    pillClass += isLaunch
                      ? "bg-gold text-navy border-gold"
                      : "bg-coral text-white border-coral";
                  } else if (isLaunch) {
                    pillClass += "bg-gold/15 text-gold border-gold/40 hover:bg-gold/25";
                  } else if (isToday) {
                    pillClass += "bg-coral/20 text-coral border-coral/40 hover:bg-coral/30";
                  } else if (d.day < (todayOffset ?? -99)) {
                    pillClass += "bg-white/5 text-cream/40 border-white/10 hover:bg-white/10 hover:text-cream/60";
                  } else {
                    pillClass += "bg-white/5 text-cream/70 border-white/10 hover:bg-white/10";
                  }

                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d.day);
                        setCategoryFilter("All");
                        setAddingTask(false);
                      }}
                      className={pillClass}
                    >
                      {overdue && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-coral border border-navy" />
                      )}
                      <span>{pillLabel(d.day)}</span>
                      {launchDate && (
                        <span
                          className={`text-[9px] font-normal ${
                            isSelected ? "opacity-70" : "opacity-40"
                          }`}
                        >
                          {formatDate(getDayDate(launchDate, d.day))}
                        </span>
                      )}
                      {d.tasks.length > 0 && (
                        <div
                          className="w-full h-0.5 rounded-full overflow-hidden mt-0.5"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${donePct * 100}%`,
                              background: donePct === 1 ? "hsl(145 63% 55%)" : "currentColor",
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED DAY PANEL */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-black">
                    {selectedDay === 0
                      ? "Launch Day"
                      : selectedDay < 0
                      ? `Day ${selectedDay}`
                      : `Day +${selectedDay}`}
                    {launchDate && (
                      <span className="ml-2 text-base font-normal text-cream/50">
                        · {formatDate(getDayDate(launchDate, selectedDay))}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-cream/50 mt-0.5">
                    {visibleTasks.filter((t) => t.status === "done").length} /{" "}
                    {visibleTasks.length} done
                  </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2">
                  {(["All", ...CATEGORIES] as Array<Category | "All">).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
                        categoryFilter === cat
                          ? "bg-coral text-white border-coral"
                          : "bg-white/5 text-cream/60 border-white/10 hover:bg-white/10 hover:text-cream/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* TASK LIST */}
              <div className="space-y-3">
                {visibleTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                    <p className="text-sm text-cream/40">
                      {categoryFilter !== "All"
                        ? `No ${categoryFilter} tasks for this day.`
                        : "No tasks yet. Add one below."}
                    </p>
                  </div>
                )}

                {visibleTasks.map((task) => {
                  const isDone = task.status === "done";
                  const notesOpen = expandedNotes[task.id] ?? false;

                  return (
                    <div
                      key={task.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isDone
                          ? "bg-white/3 border-white/5"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() =>
                            updateTask(selectedDay, task.id, {
                              status: isDone ? "not-started" : "done",
                            })
                          }
                          className="mt-0.5 flex-shrink-0 text-coral hover:scale-110 transition-transform"
                          aria-label={isDone ? "Mark incomplete" : "Mark done"}
                        >
                          {isDone ? (
                            <CheckSquare className="h-5 w-5" />
                          ) : (
                            <Square className="h-5 w-5 text-cream/30 hover:text-coral" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start flex-wrap gap-2 mb-1">
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                isDone ? "line-through text-cream/40" : "text-cream"
                              }`}
                            >
                              {task.text}
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold flex-shrink-0 ${CATEGORY_COLORS[task.category]}`}
                            >
                              {task.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {/* Status selector */}
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTask(selectedDay, task.id, {
                                  status: e.target.value as Status,
                                })
                              }
                              className="rounded-lg border border-white/15 bg-white/5 text-cream/70 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-coral/40 cursor-pointer"
                            >
                              <option value="not-started">Not Started</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>

                            {/* Notes toggle */}
                            <button
                              type="button"
                              onClick={() => toggleNotes(task.id)}
                              className="text-xs text-cream/40 hover:text-cream/70 transition-colors"
                            >
                              {notesOpen ? "Hide notes" : "Add notes"}
                              {task.notes && " ·"}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => deleteTask(selectedDay, task.id)}
                              className="ml-auto text-cream/20 hover:text-coral transition-colors"
                              aria-label="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {notesOpen && (
                            <textarea
                              rows={2}
                              value={task.notes}
                              onChange={(e) =>
                                updateTask(selectedDay, task.id, { notes: e.target.value })
                              }
                              placeholder="Add notes..."
                              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cream placeholder:text-cream/30 focus:outline-none focus:ring-1 focus:ring-coral/40 resize-none"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ADD TASK */}
              <div className="mt-4">
                {!addingTask ? (
                  <button
                    type="button"
                    onClick={() => setAddingTask(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 text-cream/50 px-4 py-2.5 text-sm font-medium hover:border-white/40 hover:text-cream/80 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Task
                  </button>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        autoFocus
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addTask();
                          if (e.key === "Escape") setAddingTask(false);
                        }}
                        placeholder="Task description..."
                        className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/40"
                      />
                      <select
                        value={newTaskCat}
                        onChange={(e) => setNewTaskCat(e.target.value as Category)}
                        className="rounded-xl border border-white/15 bg-white/5 text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addTask}
                          className="flex-1 sm:flex-none rounded-xl bg-coral text-white font-bold px-5 py-2.5 text-sm hover:-translate-y-0.5 transition-transform"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingTask(false);
                            setNewTaskText("");
                          }}
                          className="flex-1 sm:flex-none rounded-xl border border-white/15 text-cream/50 font-bold px-5 py-2.5 text-sm hover:border-white/30 hover:text-cream/80 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-navy-deep text-cream/70 px-5 sm:px-8 py-10 text-center text-sm mt-12">
        © {new Date().getFullYear()} AP Digital · support@apdigital.co
      </footer>
    </div>
  );
};

export default LaunchTracker;
