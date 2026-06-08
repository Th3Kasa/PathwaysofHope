"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Lock, LogOut, Loader2, Upload, Trash2, FileText,
  Sparkles, CheckCircle2, TriangleAlert, RefreshCw,
  Plus, Eye, EyeOff, Landmark, ChevronDown, Newspaper, Pencil,
} from "lucide-react";
import { MANAGED_IMAGES, MANAGED_IMAGE_GROUPS, defaultAiPrompt, galleryExtraKey, KAPOETA_GALLERY_GROUP } from "@/lib/managed-images";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GoalMeta { id: string; title: string; defaultImage: string }
interface ReportItem { id: string; title: string; year: string; url: string; uploadedAt: string }

interface ExtraGoal {
  id: string;
  missionName: string;
  title: string;
  short: string;
  description: string;
  goalAmount: number;
  recurring: boolean;
  image?: string;
  imageAlt?: string;
  addedAt: string;
}

interface ManualDonation {
  id: string;
  goalId: string;
  amount: number;
  note?: string;
  addedAt: string;
}

interface NewsletterPost {
  id: string;
  titleEn: string;
  titleAr?: string;
  bodyEn: string;
  bodyAr?: string;
  imageUrl?: string;
  imageUrls: string[];
  imageAlt?: string;
  author: string;
  publishedAt: string;
}

interface Config {
  images: Record<string, string>;
  captions: Record<string, string>;
  reports: ReportItem[];
  goals: GoalMeta[];
  blobReady: boolean;
  disabledGoalIds: string[];
  extraGoals: ExtraGoal[];
  manualDonations: ManualDonation[];
  hiddenGalleryKeys: string[];
  galleryExtraIds: string[];
  newsletterPosts: NewsletterPost[];
}

const fmtAUD = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

// ─── Shared UI ────────────────────────────────────────────────────────────────

const btn = "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50";
const btnPrimary = `${btn} bg-[#6366f1] text-white hover:bg-[#4f46e5]`;
const btnGhost = `${btn} border border-[#d6d3d1] text-[#374151] hover:border-[#6366f1]`;
const input = "w-full px-4 py-2.5 border-2 border-[#d6d3d1] rounded-xl text-sm text-[#1e293b] focus:outline-none focus:border-[#6366f1] transition-colors";
const card = "bg-white rounded-2xl border border-[#d6d3d1] shadow-sm p-6 sm:p-8";

function Toast({ msg, kind }: { msg: string; kind: "ok" | "err" }) {
  return (
    <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 ${kind === "ok" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
      {kind === "ok" ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}
      <span>{msg}</span>
    </div>
  );
}

function CollapsibleCard({ title, subtitle, count, defaultOpen = false, children }: {
  title: string; subtitle?: string; count?: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={card}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-start justify-between gap-3 text-left">
        <div>
          <h2 className="text-lg font-semibold text-[#1e293b]">
            {title}
            {count !== undefined && <span className="ml-2 text-sm font-normal text-[#9ca3af]">({count})</span>}
          </h2>
          {subtitle && <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>}
        </div>
        <ChevronDown size={20} className={`text-[#6b7280] flex-shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-6">{children}</div>}
    </section>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setLoading(false);
    if (res.ok) onSuccess();
    else { const d = await res.json().catch(() => ({})); setErr(d.error || "Incorrect password"); }
  };

  return (
    <div className="bg-[#e7e5e4] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
            <Lock size={22} className="text-[#6366f1]" />
          </div>
          <h1 className="text-2xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>Admin</h1>
        </div>
        <form onSubmit={submit} className={`${card} space-y-4`}>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} autoFocus required />
          </div>
          {err && <Toast msg={err} kind="err" />}
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadErr(null);
    const res = await fetch("/api/admin/config", { cache: "no-store" });
    if (res.status === 401) return onLogout();
    if (!res.ok) { setLoadErr("Failed to load config"); return; }
    setConfig(await res.json());
  }, [onLogout]);

  useEffect(() => { load(); }, [load]);

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); onLogout(); };

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>Admin</h1>
          <button onClick={logout} className={btnGhost}><LogOut size={15} /> Sign out</button>
        </div>

        {loadErr && <Toast msg={loadErr} kind="err" />}
        {!config && !loadErr && <div className="flex items-center gap-2 text-[#6b7280]"><Loader2 size={18} className="animate-spin" /> Loading…</div>}

        {config && (
          <div className="space-y-8">
            {!config.blobReady && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 flex gap-3">
                <TriangleAlert size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <strong>Storage not connected.</strong> If you have already connected a Vercel Blob store, trigger a new deployment — Vercel will inject the <code>BLOB_READ_WRITE_TOKEN</code> automatically. If you haven&apos;t connected one yet, go to Vercel dashboard → Storage → Connect your Blob store to this project. Until the token is present, uploads cannot be saved.
                </div>
              </div>
            )}
            <GoalsManagementSection config={config} reload={load} />
            <NewsletterSection config={config} reload={load} />
            <PhotosSection config={config} reload={load} />
            <SitePhotosSection config={config} reload={load} />
            <ReportsSection config={config} reload={load} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Goals Management ─────────────────────────────────────────────────────────

function GoalsManagementSection({ config, reload }: { config: Config; reload: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const [form, setForm] = useState({
    missionName: "", title: "", short: "", description: "",
    goalAmount: "", recurring: false,
  });
  const [saving, setSaving] = useState(false);

  const toggle = async (id: string) => {
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggleGoalVisibility: { id } }),
    });
    if (res.ok) { reload(); }
    else setToast({ msg: "Failed to update goal visibility", kind: "err" });
  };

  const removeExtra = async (id: string) => {
    if (!confirm("Delete this goal? This cannot be undone.")) return;
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeExtraGoal: { id } }),
    });
    if (res.ok) { setToast({ msg: "Goal removed.", kind: "ok" }); reload(); }
    else setToast({ msg: "Failed to remove goal", kind: "err" });
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.short.trim()) {
      setToast({ msg: "Title and short description are required.", kind: "err" }); return;
    }
    setSaving(true); setToast(null);
    const newGoal: ExtraGoal = {
      id: `extra-${Math.random().toString(36).slice(2, 10)}`,
      missionName: form.missionName.trim() || "General",
      title: form.title.trim(),
      short: form.short.trim(),
      description: form.description.trim() || form.short.trim(),
      goalAmount: Number(form.goalAmount) || 0,
      recurring: form.recurring,
      addedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addExtraGoal: newGoal }),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ msg: "Goal added — live on site.", kind: "ok" });
      setForm({ missionName: "", title: "", short: "", description: "", goalAmount: "", recurring: false });
      setShowAddForm(false);
      reload();
    } else {
      setToast({ msg: "Failed to add goal", kind: "err" });
    }
  };

  const allGoals = [
    ...config.goals.map(g => ({ id: g.id, title: g.title, mission: "Kapoeta", isExtra: false })),
    ...config.extraGoals.map(g => ({ id: g.id, title: g.title, mission: g.missionName, isExtra: true })),
  ];

  return (
    <section className={card}>
      <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Missions &amp; Goals</h2>
      <p className="text-sm text-[#6b7280] mb-6">
        Show or hide donation goals on the site, record offline bank / direct-debit gifts, and add new goals for current or future missions.
      </p>

      <div className="space-y-2 mb-6">
        {allGoals.map((g) => (
          <GoalRow
            key={g.id}
            goal={g}
            hidden={config.disabledGoalIds.includes(g.id)}
            manualDonations={(config.manualDonations ?? []).filter((d) => d.goalId === g.id)}
            onToggle={() => toggle(g.id)}
            onRemoveExtra={() => removeExtra(g.id)}
            reload={reload}
          />
        ))}
      </div>

      {toast && <div className="mb-4"><Toast msg={toast.msg} kind={toast.kind} /></div>}

      {!showAddForm ? (
        <button onClick={() => setShowAddForm(true)} className={btnPrimary}>
          <Plus size={15} /> Add new goal
        </button>
      ) : (
        <form onSubmit={addGoal} className="border border-[#d6d3d1] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#1e293b]">New donation goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Mission name</label>
              <input placeholder="e.g. Kapoeta, Uganda Mission" value={form.missionName}
                onChange={e => setForm(f => ({ ...f, missionName: e.target.value }))} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Goal title *</label>
              <input placeholder="e.g. Build a Classroom" required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={input} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Short description * (shown on donation card)</label>
            <input placeholder="One-line summary for donors" required value={form.short}
              onChange={e => setForm(f => ({ ...f, short: e.target.value }))} className={input} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Full description (shown on donation page)</label>
            <textarea placeholder="More detail about this goal…" value={form.description} rows={3}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className={`${input} resize-none`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Target amount (AUD) — leave 0 for open-ended</label>
              <input type="number" min="0" placeholder="e.g. 10000" value={form.goalAmount}
                onChange={e => setForm(f => ({ ...f, goalAmount: e.target.value }))} className={input} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#374151]">
              <input type="checkbox" checked={form.recurring}
                onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
                className="w-4 h-4 accent-[#6366f1]" />
              Recurring by nature (monthly/weekly donations)
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add goal
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className={btnGhost}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

// ─── Goal row (visibility + offline donations) ─────────────────────────────────

function GoalRow({ goal, hidden, manualDonations, onToggle, onRemoveExtra, reload }: {
  goal: { id: string; title: string; mission: string; isExtra: boolean };
  hidden: boolean;
  manualDonations: ManualDonation[];
  onToggle: () => void;
  onRemoveExtra: () => void;
  reload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  // Optimistic visibility — flips instantly on click, reconciled when the
  // parent reloads config so the badge/button never feels laggy.
  const [optHidden, setOptHidden] = useState(hidden);
  const prevHidden = useRef(hidden);
  if (prevHidden.current !== hidden) {
    prevHidden.current = hidden;
    setOptHidden(hidden);
  }

  const manualTotal = manualDonations.reduce((s, d) => s + d.amount, 0);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) { setToast({ msg: "Enter an amount greater than 0.", kind: "err" }); return; }
    setSaving(true); setToast(null);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addManualDonation: { goalId: goal.id, amount: amt } }),
    });
    setSaving(false);
    if (res.ok) {
      setAmount("");
      setToast({ msg: "Donation recorded — bar & supporters updated.", kind: "ok" });
      reload();
    } else {
      const d = await res.json().catch(() => ({}));
      setToast({ msg: d.error || "Failed to record donation", kind: "err" });
    }
  };

  const remove = async (id: string) => {
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeManualDonation: { id } }),
    });
    if (res.ok) reload();
    else setToast({ msg: "Failed to remove entry", kind: "err" });
  };

  return (
    <div className="rounded-xl border border-[#d6d3d1]">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-[#1e293b]">{goal.title}</span>
          <span className="ml-2 text-xs text-[#6b7280]">{goal.mission}</span>
          {manualTotal > 0 && (
            <span className="ml-2 text-xs text-[#6366f1] font-medium">
              +{fmtAUD(manualTotal)} offline · {manualDonations.length} {manualDonations.length === 1 ? "gift" : "gifts"}
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${optHidden ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
          {optHidden ? "Hidden" : "Live"}
        </span>
        <button onClick={() => setOpen((o) => !o)} className={`${btnGhost} py-1.5 px-3 text-xs`} title="Record a bank / direct-debit gift">
          <Landmark size={14} /> Donation
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <button
          onClick={() => { setOptHidden((h) => !h); onToggle(); }}
          className={`${btnGhost} py-1.5 px-3 text-xs`}
          title={optHidden ? "Show on site" : "Hide from site"}
        >
          {optHidden ? <Eye size={14} /> : <EyeOff size={14} />}
          {optHidden ? "Show" : "Hide"}
        </button>
        {goal.isExtra && (
          <button onClick={onRemoveExtra} className="text-[#6b7280] hover:text-red-600 transition-colors p-1.5" title="Delete goal">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {open && (
        <div className="border-t border-[#d6d3d1] px-4 py-4 space-y-3 bg-[#faf9f8] rounded-b-xl">
          <p className="text-xs text-[#6b7280]">
            Record a gift received by bank transfer or direct debit. Each entry adds to this goal&apos;s total and counts as one supporter on the live progress bar.
          </p>
          <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#374151] mb-1">Amount (AUD)</label>
              <input type="number" min="0" step="0.01" placeholder="e.g. 10000" value={amount}
                onChange={(e) => setAmount(e.target.value)} className={input} />
            </div>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
            </button>
          </form>

          {toast && <Toast msg={toast.msg} kind={toast.kind} />}

          {manualDonations.length > 0 ? (
            <ul className="space-y-1.5">
              {manualDonations.map((d) => (
                <li key={d.id} className="flex items-center gap-3 text-sm rounded-lg bg-white border border-[#d6d3d1] px-3 py-2">
                  <span className="font-semibold text-[#1e293b] tabular-nums">{fmtAUD(d.amount)}</span>
                  {d.note && <span className="text-xs text-[#6b7280] truncate">{d.note}</span>}
                  <span className="ml-auto text-xs text-[#9ca3af]">{new Date(d.addedAt).toLocaleDateString("en-AU")}</span>
                  <button onClick={() => remove(d.id)} className="text-[#6b7280] hover:text-red-600 transition-colors flex-shrink-0" title="Remove this entry">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#6b7280] italic">No offline gifts recorded for this goal yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];
const DEFAULT_AUTHOR = "Hanan Morkos";

const NEWSLETTER_AI_PROMPT =
  "Photorealistic wide-angle documentary photo related to a charity mission in Kapoeta, South Sudan — children, shelter, community, warm golden light, hope and dignity";

function emptyPostForm() {
  return {
    titleEn: "", titleAr: "", bodyEn: "", bodyAr: "",
    imageAlt: "", author: DEFAULT_AUTHOR, publishedAt: TODAY,
    imageUrls: [] as string[],
  };
}

function NewsletterSection({ config, reload }: { config: Config; reload: () => void }) {
  const posts = config.newsletterPosts ?? [];
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPostForm());
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const busy = uploading || generating || saving || formatting;

  const openAdd = () => {
    setForm(emptyPostForm());
    setPendingImage(null);
    setExistingImage(null);
    setEditId(null);
    setToast(null);
    setMode("add");
  };

  const openEdit = (post: NewsletterPost) => {
    setForm({
      titleEn: post.titleEn, titleAr: post.titleAr ?? "", bodyEn: post.bodyEn, bodyAr: post.bodyAr ?? "",
      imageAlt: "", author: post.author, publishedAt: post.publishedAt.split("T")[0],
      imageUrls: post.imageUrls ?? [],
    });
    setPendingImage(null);
    setExistingImage(post.imageUrl ?? null);
    setEditId(post.id);
    setToast(null);
    setMode("edit");
  };

  const cancel = () => { setMode("list"); setToast(null); };

  const IMAGE_PROMPTS = [
    "Photorealistic wide-angle documentary photo — children at the Kapoeta shelter in South Sudan, warm golden hour light, hopeful atmosphere",
    "Photorealistic close-up — smiling South Sudanese child at a shelter, warm natural light, dignity and joy",
    "Photorealistic documentary — community gathering or activity at a charity mission in South Sudan, people working together",
    "Photorealistic wide shot — sunset over a shelter in South Sudan, hope and peace, golden light",
  ];

  const formatAndGenerate = async () => {
    if (!form.titleEn.trim() || !form.bodyEn.trim()) {
      setToast({ msg: "Add a title and body first.", kind: "err" }); return;
    }
    setFormatting(true); setToast({ msg: "Formatting text and generating images…", kind: "ok" });

    const titleHint = form.titleEn.trim() ? ` — related to: ${form.titleEn}` : "";
    const imagePromises = IMAGE_PROMPTS.map((basePrompt, i) =>
      fetch("/api/admin/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: `newsletter-img-${i + 1}-${editId ?? "new"}`,
          prompt: basePrompt + titleHint,
          commit: false,
        }),
      }).then(async r => {
        const d = await r.json().catch(() => ({ error: `HTTP ${r.status}` })) as Record<string, unknown>;
        if (!r.ok) throw new Error(String(d.error ?? `HTTP ${r.status}`));
        return d;
      })
    );

    const [formatRes, ...imageResults] = await Promise.allSettled([
      fetch("/api/admin/format-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.titleEn, body: form.bodyEn }),
      }),
      ...imagePromises,
    ]);

    setFormatting(false);

    // Apply formatted text — capture the exact failure reason
    let textOk = false;
    let textError = "";
    if (formatRes.status === "fulfilled" && formatRes.value.ok) {
      const d = await formatRes.value.json().catch(() => ({})) as Record<string, unknown>;
      if (d.body) {
        setForm(f => ({
          ...f,
          titleEn: d.title ? String(d.title) : f.titleEn,
          bodyEn: String(d.body),
          titleAr: d.titleAr ? String(d.titleAr) : f.titleAr,
          bodyAr: d.bodyAr ? String(d.bodyAr) : f.bodyAr,
        }));
        textOk = true;
      } else {
        textError = "Model returned no text";
      }
    } else if (formatRes.status === "rejected") {
      textError = (formatRes as PromiseRejectedResult).reason?.message ?? "network error";
    } else if (formatRes.status === "fulfilled" && !formatRes.value.ok) {
      const d = await formatRes.value.json().catch(() => ({})) as Record<string, unknown>;
      textError = String(d.error ?? `Format error ${formatRes.value.status}`);
    }

    // Apply images (partial success is fine)
    const urls = (imageResults as PromiseSettledResult<Record<string, unknown>>[])
      .filter((r): r is PromiseFulfilledResult<Record<string, unknown>> => r.status === "fulfilled" && Boolean(r.value.url))
      .map(r => r.value.url as string);
    const imgErrors = imageResults.filter(r => r.status === "rejected").length;

    if (urls.length > 0) setForm(f => ({ ...f, imageUrls: urls }));

    const imgNote = imgErrors ? ` (${imgErrors} image${imgErrors > 1 ? "s" : ""} failed)` : "";
    if (textOk && urls.length > 0) {
      setToast({ msg: `Ready — review and publish.${imgNote}`, kind: "ok" });
    } else if (textOk) {
      setToast({ msg: "Text formatted. Images failed — you can still publish.", kind: "err" });
    } else {
      // Text failed — always show the real error so we can diagnose
      setToast({ msg: `Text formatting failed: ${textError}`, kind: "err" });
    }
  };

  const upload = async (file: File) => {
    setUploading(true); setToast(null);
    const fd = new FormData();
    fd.append("kind", "image");
    fd.append("key", `newsletter-${editId ?? "new"}`);
    fd.append("file", file);
    fd.append("commit", "false");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) { const d = await res.json(); setPendingImage(d.url); setToast({ msg: "Photo ready — save to publish.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Upload failed", kind: "err" }); }
  };

  const generate = async () => {
    setGenerating(true); setToast(null);
    const prompt = form.titleEn
      ? `${NEWSLETTER_AI_PROMPT} — scene related to: ${form.titleEn}`
      : NEWSLETTER_AI_PROMPT;
    const res = await fetch("/api/admin/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: `newsletter-${editId ?? "new"}`, prompt, commit: false }),
    });
    setGenerating(false);
    if (res.ok) { const d = await res.json(); setPendingImage(d.url); setToast({ msg: "AI image ready — save to publish.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Generation failed", kind: "err" }); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleEn.trim() || !form.bodyEn.trim()) {
      setToast({ msg: "Title and body are required.", kind: "err" }); return;
    }
    setSaving(true); setToast(null);

    // Use the first AI-generated image as the card thumbnail. Only auto-generate
    // a single fallback image if none exist (i.e. the user skipped "Format with AI").
    let autoImageUrl: string | undefined;
    if (mode === "add" && form.imageUrls.length === 0 && !pendingImage && !existingImage) {
      try {
        setToast({ msg: "Generating article image…", kind: "ok" });
        const tempId = `newsletter-draft-${Date.now()}`;
        const aiPrompt = `Photorealistic documentary photo for a charity mission article: "${form.titleEn.trim()}" — Kapoeta, South Sudan, children, community, warm light, hope and dignity`;
        const genRes = await fetch("/api/admin/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goalId: tempId, prompt: aiPrompt, commit: false }),
        });
        if (genRes.ok) {
          const gd = await genRes.json();
          autoImageUrl = gd.url;
        }
      } catch { /* image generation failure is non-fatal */ }
    }

    const imageUrl = form.imageUrls[0] ?? autoImageUrl ?? pendingImage ?? existingImage ?? undefined;
    const payload: Record<string, unknown> = {
      titleEn: form.titleEn.trim(),
      bodyEn: form.bodyEn.trim(),
      titleAr: form.titleAr.trim() || undefined,
      bodyAr: form.bodyAr.trim() || undefined,
      imageUrl,
      imageUrls: form.imageUrls,
      author: form.author.trim() || DEFAULT_AUTHOR,
      publishedAt: mode === "add" ? new Date().toISOString() : new Date(form.publishedAt).toISOString(),
    };
    const body = mode === "edit" && editId
      ? { updateNewsletterPost: { id: editId, ...payload } }
      : { addNewsletterPost: payload };
    const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      setToast({ msg: mode === "edit" ? "Update saved." : "Post published.", kind: "ok" });
      reload();
      setMode("list");
    } else {
      const d = await res.json().catch(() => ({}));
      setToast({ msg: d.error || "Save failed", kind: "err" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeNewsletterPost: { id } }),
    });
    if (res.ok) { setToast({ msg: "Post deleted.", kind: "ok" }); reload(); }
    else setToast({ msg: "Failed to delete post", kind: "err" });
  };

  const previewSrc = pendingImage ?? existingImage;

  return (
    <section className={card}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
            <Newspaper size={18} className="text-[#6366f1]" />
            Newsletter / Updates
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Publish project updates with images. Each post appears on the public <a href="/newsletter" target="_blank" className="text-[#6366f1] hover:underline">/newsletter</a> page.
          </p>
        </div>
        {mode === "list" && (
          <button onClick={openAdd} className={`${btnPrimary} flex-shrink-0`}>
            <Plus size={14} /> New post
          </button>
        )}
      </div>

      {toast && mode === "list" && <div className="mt-4"><Toast msg={toast.msg} kind={toast.kind} /></div>}

      {/* ── Form (add / edit) ── */}
      {(mode === "add" || mode === "edit") && (
        <form onSubmit={save} className="mt-6 space-y-5 border border-[#d6d3d1] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1e293b]">
            {mode === "add" ? "New post" : "Edit post"}
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Title *</label>
            <input required value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} className={input} placeholder="e.g. Solar System Installed" />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Body *</label>
            <textarea required rows={8} value={form.bodyEn} onChange={e => setForm(f => ({ ...f, bodyEn: e.target.value }))} className={`${input} resize-y`} placeholder="Write the full update here…" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={formatAndGenerate} disabled={busy} className={btnGhost}>
              {formatting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {formatting ? "Working…" : "Format with AI"}
            </button>
          </div>

          {form.imageUrls.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#374151] mb-2">Generated images</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {form.imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-[#f5f5f4] border border-[#d6d3d1]">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Author</label>
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className={input} placeholder="Hanan Morkos" />
          </div>

          {toast && <Toast msg={toast.msg} kind={toast.kind} />}

          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={btnPrimary}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {mode === "edit" ? "Save changes" : "Publish post"}
            </button>
            <button type="button" onClick={cancel} className={btnGhost}>Cancel</button>
          </div>
        </form>
      )}

      {/* ── Post list ── */}
      {mode === "list" && (
        <div className="mt-6 space-y-3">
          {posts.length === 0 && (
            <p className="text-sm text-[#6b7280] italic">No posts yet. Click "New post" to publish your first update.</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="flex items-start gap-3 rounded-xl border border-[#d6d3d1] p-4">
              {post.imageUrl && (
                <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f5f5f4]">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e293b] truncate">{post.titleEn}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  {post.author} · {new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{post.bodyEn.slice(0, 120)}{post.bodyEn.length > 120 ? "…" : ""}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(post)} className={`${btnGhost} py-1.5 px-3 text-xs`} title="Edit post">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => remove(post.id)} className="text-[#6b7280] hover:text-red-600 transition-colors p-1.5" title="Delete post">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Section Photos ────────────────────────────────────────────────────────────

const AI_PROMPTS: Record<string, string> = {
  "solar-system": "Photorealistic wide-angle shot of solar panels being installed on a rooftop in rural South Sudan, warm golden afternoon light, children visible in background near a simple concrete shelter, documentary photography style",
  "chicken-coop": "Photorealistic image of African children feeding chickens outside a sturdy wooden chicken coop in a rural African setting, warm sunlight, candid documentary photo",
  "water-pump": "Photorealistic photo of a young African girl operating a hand water pump in rural South Sudan, golden hour light, dusty earth, village in background, documentary style",
  "ongoing-operations": "Photorealistic documentary photo of African children in school uniforms sitting at desks inside a simple classroom in South Sudan, natural window light, teacher visible",
  "sponsor-a-child": "Photorealistic portrait-style photo of a group of smiling African children at a shelter in South Sudan, warm afternoon light, genuine candid expressions, documentary photography",
  "where-most-needed": "Photorealistic wide-shot of a children's shelter compound in rural South Sudan, children playing in the courtyard, warm golden light, documentary style photography",
};

function PhotosSection({ config, reload }: { config: Config; reload: () => void }) {
  const allGoals: GoalMeta[] = [
    ...config.goals,
    ...config.extraGoals.map(eg => ({ id: eg.id, title: eg.title, defaultImage: eg.image ?? "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg" })),
  ];

  return (
    <CollapsibleCard
      title="Donation card photos"
      subtitle="Photos on the donation cards and individual donation pages. Upload or generate with AI, then click Save to publish."
      count={allGoals.length}
    >
      <div className="space-y-6">
        {allGoals.map((goal) => (
          <PhotoRow
            key={goal.id}
            goal={goal}
            currentImage={config.images[goal.id] ?? goal.defaultImage}
            savedCaption={config.captions[goal.id] ?? ""}
            hasOverride={Boolean(config.images[goal.id])}
            aiPrompt={AI_PROMPTS[goal.id] ?? `Photorealistic photo related to: ${goal.title}, South Sudan charity, documentary style`}
            reload={reload}
          />
        ))}
      </div>
    </CollapsibleCard>
  );
}

function PhotoRow({ goal, currentImage, savedCaption, hasOverride, aiPrompt, reload, extraAction }: {
  goal: GoalMeta; currentImage: string; savedCaption: string; hasOverride: boolean; aiPrompt: string; reload: () => void;
  extraAction?: React.ReactNode;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [caption, setCaption] = useState(savedCaption);
  // A newly uploaded / generated image that is staged but not yet published.
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  // Keep caption input in sync when parent reloads config
  const prevSavedCaption = useRef(savedCaption);
  if (prevSavedCaption.current !== savedCaption) {
    prevSavedCaption.current = savedCaption;
    setCaption(savedCaption);
  }

  const busy = uploading || generating || saving;

  // Upload only stages the file (commit=false); publishing happens on Save.
  const upload = async (file: File) => {
    setUploading(true); setToast(null);
    const fd = new FormData();
    fd.append("kind", "image"); fd.append("key", goal.id); fd.append("file", file); fd.append("commit", "false");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) { const d = await res.json(); setPendingImage(d.url); setToast({ msg: "Photo ready — click Save to publish.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Upload failed", kind: "err" }); }
  };

  const generate = async () => {
    setGenerating(true); setToast(null);
    const res = await fetch("/api/admin/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: goal.id, prompt: aiPrompt, commit: false }),
    });
    setGenerating(false);
    if (res.ok) { const d = await res.json(); setPendingImage(d.url); setToast({ msg: "AI image ready — click Save to publish.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Generation failed", kind: "err" }); }
  };

  // Save publishes the staged image and/or caption in a single request.
  const save = async () => {
    const body: Record<string, unknown> = {};
    if (pendingImage) body.setImage = { key: goal.id, url: pendingImage };
    if (caption !== savedCaption) body.saveCaption = { key: goal.id, value: caption };
    if (Object.keys(body).length === 0) return;
    setSaving(true); setToast(null);
    const res = await fetch("/api/admin/config", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) { setPendingImage(null); setToast({ msg: "Saved — live on site.", kind: "ok" }); reload(); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Save failed", kind: "err" }); }
  };

  const reset = async () => {
    setToast(null);
    const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resetImageKey: goal.id }) });
    if (res.ok) { setPendingImage(null); setToast({ msg: "Reset to default photo.", kind: "ok" }); reload(); }
    else setToast({ msg: "Reset failed", kind: "err" });
  };

  const dirty = pendingImage !== null || caption !== savedCaption;
  const previewSrc = pendingImage ?? currentImage;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
      {/* Preview */}
      <div className="relative w-full sm:w-40 h-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f5f4] border border-[#d6d3d1]">
        <Image src={previewSrc} alt={goal.title} fill className="object-cover" sizes="160px" unoptimized />
        {pendingImage ? (
          <span className="absolute top-1.5 left-1.5 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">Unsaved</span>
        ) : hasOverride ? (
          <span className="absolute top-1.5 left-1.5 text-[10px] bg-[#6366f1] text-white px-1.5 py-0.5 rounded-full font-semibold">Custom</span>
        ) : null}
      </div>

      {/* Controls */}
      <div className="flex-1 min-w-0 space-y-3">
        <p className="text-sm font-semibold text-[#1e293b]">{goal.title}</p>

        {/* Caption */}
        <input
          type="text"
          placeholder="Caption / alt text shown on site (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className={input}
        />

        {/* Photo action buttons */}
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} disabled={busy} className={btnGhost}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload photo
          </button>
          <button onClick={generate} disabled={busy} className={btnGhost}>
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? "Generating…" : "Generate AI photo"}
          </button>
          <button onClick={save} disabled={busy || !dirty} className={btnPrimary} title="Publish changes to the website">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Save
          </button>
          {(hasOverride || pendingImage) && (
            <button onClick={reset} disabled={busy} className={btnGhost} title="Restore default photo">
              <RefreshCw size={14} /> Reset
            </button>
          )}
          {extraAction}
        </div>

        {dirty && !toast && (
          <p className="text-xs text-amber-600 font-medium">Unsaved changes — click Save to publish.</p>
        )}
        {toast && <Toast msg={toast.msg} kind={toast.kind} />}
      </div>
    </div>
  );
}

// ─── Website Photos (all managed images, grouped by page/section) ───────────────

const GALLERY_PLACEHOLDER = "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg";

// Add a brand-new photo to the Kapoeta gallery: stage an upload / AI image,
// then Save to publish it as a new gallery item.
function AddGalleryPhoto({ reload }: { reload: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(Math.random().toString(36).slice(2, 10));
  const [pending, setPending] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const key = galleryExtraKey(idRef.current);
  const busy = uploading || generating || saving;

  const upload = async (file: File) => {
    setUploading(true); setToast(null);
    const fd = new FormData();
    fd.append("kind", "image"); fd.append("key", key); fd.append("file", file); fd.append("commit", "false");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) { const d = await res.json(); setPending(d.url); setToast({ msg: "Photo ready — click Save to add it.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Upload failed", kind: "err" }); }
  };

  const generate = async () => {
    setGenerating(true); setToast(null);
    const res = await fetch("/api/admin/generate-image", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: key, prompt: defaultAiPrompt("children's daily life at the shelter"), commit: false }),
    });
    setGenerating(false);
    if (res.ok) { const d = await res.json(); setPending(d.url); setToast({ msg: "AI image ready — click Save to add it.", kind: "ok" }); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Generation failed", kind: "err" }); }
  };

  const save = async () => {
    if (!pending) { setToast({ msg: "Upload or generate a photo first.", kind: "err" }); return; }
    setSaving(true); setToast(null);
    const body: Record<string, unknown> = {
      addGalleryExtra: { id: idRef.current },
      setImage: { key, url: pending },
    };
    if (caption.trim()) body.saveCaption = { key, value: caption };
    const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      setToast({ msg: "Photo added to the gallery.", kind: "ok" });
      idRef.current = Math.random().toString(36).slice(2, 10);
      setPending(null); setCaption("");
      reload();
    } else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Failed to add photo", kind: "err" }); }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#d6d3d1] p-5 space-y-3">
      <p className="text-sm font-semibold text-[#1e293b]">Add a new gallery photo</p>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        <div className="relative w-full sm:w-40 h-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f5f4] border border-[#d6d3d1] flex items-center justify-center">
          {pending ? (
            <Image src={pending} alt="New gallery photo" fill className="object-cover" sizes="160px" unoptimized />
          ) : (
            <span className="text-xs text-[#9ca3af]">No photo yet</span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <input type="text" placeholder="Caption / alt text (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className={input} />
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={busy} className={btnGhost}>
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload photo
            </button>
            <button onClick={generate} disabled={busy} className={btnGhost}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? "Generating…" : "Generate AI photo"}
            </button>
            <button onClick={save} disabled={busy || !pending} className={btnPrimary}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Save to gallery
            </button>
          </div>
          {toast && <Toast msg={toast.msg} kind={toast.kind} />}
        </div>
      </div>
    </div>
  );
}

function GalleryManagerSection({ config, reload }: { config: Config; reload: () => void }) {
  const items = MANAGED_IMAGES.filter((m) => m.group === KAPOETA_GALLERY_GROUP);
  const visibleCount =
    items.filter((m) => !config.hiddenGalleryKeys.includes(m.key)).length + config.galleryExtraIds.length;

  const toggleHide = async (key: string) => {
    await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toggleGalleryItem: { key } }) });
    reload();
  };

  const removeExtra = async (id: string) => {
    if (!confirm("Remove this photo from the gallery? This cannot be undone.")) return;
    await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ removeGalleryExtra: { id } }) });
    reload();
  };

  return (
    <CollapsibleCard
      title={KAPOETA_GALLERY_GROUP}
      subtitle="Add new photos, replace or caption existing ones, or remove any you don't want. Changes publish on Save."
      count={visibleCount}
    >
      <div className="space-y-8">
        <AddGalleryPhoto reload={reload} />

        {config.galleryExtraIds.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#6366f1] uppercase tracking-widest mb-4">Added photos ({config.galleryExtraIds.length})</h4>
            <div className="space-y-6">
              {config.galleryExtraIds.map((id) => {
                const key = galleryExtraKey(id);
                return (
                  <PhotoRow
                    key={key}
                    goal={{ id: key, title: "Added gallery photo", defaultImage: config.images[key] ?? GALLERY_PLACEHOLDER }}
                    currentImage={config.images[key] ?? GALLERY_PLACEHOLDER}
                    savedCaption={config.captions[key] ?? ""}
                    hasOverride={false}
                    aiPrompt={defaultAiPrompt("children's daily life at the shelter")}
                    reload={reload}
                    extraAction={
                      <button onClick={() => removeExtra(id)} className={`${btnGhost} text-red-600 hover:border-red-300`} title="Remove from gallery">
                        <Trash2 size={14} /> Remove
                      </button>
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-[#6366f1] uppercase tracking-widest mb-4">Original photos ({items.length})</h4>
          <div className="space-y-6">
            {items.map((m) => {
              const hidden = config.hiddenGalleryKeys.includes(m.key);
              return (
                <div key={m.key} className={hidden ? "opacity-60" : ""}>
                  <PhotoRow
                    goal={{ id: m.key, title: hidden ? `${m.label} (hidden)` : m.label, defaultImage: m.defaultSrc }}
                    currentImage={config.images[m.key] ?? m.defaultSrc}
                    savedCaption={config.captions[m.key] ?? ""}
                    hasOverride={Boolean(config.images[m.key])}
                    aiPrompt={defaultAiPrompt(m.label)}
                    reload={reload}
                    extraAction={
                      <button onClick={() => toggleHide(m.key)} className={btnGhost} title={hidden ? "Show in gallery" : "Remove from gallery"}>
                        {hidden ? <><Eye size={14} /> Show</> : <><EyeOff size={14} /> Remove</>}
                      </button>
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}

function SitePhotosSection({ config, reload }: { config: Config; reload: () => void }) {
  return (
    <>
      {MANAGED_IMAGE_GROUPS.map((group) => {
        if (group === KAPOETA_GALLERY_GROUP) {
          return <GalleryManagerSection key={group} config={config} reload={reload} />;
        }
        const items = MANAGED_IMAGES.filter((m) => m.group === group);
        return (
          <CollapsibleCard
            key={group}
            title={group}
            subtitle="Upload or generate each photo with AI, then click Save to publish to the website."
            count={items.length}
          >
            <div className="space-y-6">
              {items.map((m) => (
                <PhotoRow
                  key={m.key}
                  goal={{ id: m.key, title: m.label, defaultImage: m.defaultSrc }}
                  currentImage={config.images[m.key] ?? m.defaultSrc}
                  savedCaption={config.captions[m.key] ?? ""}
                  hasOverride={Boolean(config.images[m.key])}
                  aiPrompt={defaultAiPrompt(m.label)}
                  reload={reload}
                />
              ))}
            </div>
          </CollapsibleCard>
        );
      })}
    </>
  );
}

// ─── Annual Reports ────────────────────────────────────────────────────────────

function ReportsSection({ config, reload }: { config: Config; reload: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setToast({ msg: "Choose a PDF first.", kind: "err" }); return; }
    setUploading(true); setToast(null);
    const fd = new FormData();
    fd.append("kind", "report"); fd.append("title", title || "Annual Report"); fd.append("year", year); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      setTitle(""); if (fileRef.current) fileRef.current.value = "";
      setToast({ msg: "Report uploaded.", kind: "ok" }); reload();
    } else {
      const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Upload failed", kind: "err" });
    }
  };

  const remove = async (id: string) => {
    const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ removeReportId: id }) });
    if (res.ok) reload();
    else setToast({ msg: "Remove failed", kind: "err" });
  };

  return (
    <section className={card}>
      <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Annual reports</h2>
      <p className="text-sm text-[#6b7280] mb-6">Upload PDF annual reports. They appear publicly on the <a href="/reports" className="text-[#6366f1] underline" target="_blank">/reports</a> page.</p>

      <div className="space-y-3 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Report title (e.g. Annual Report 2025)" value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
          <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className={input} />
        </div>
        <input ref={fileRef} type="file" accept="application/pdf" className="text-sm text-[#374151]" />
        <div className="flex items-center gap-4">
          <button onClick={upload} disabled={uploading} className={btnPrimary}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload report
          </button>
          {toast && <Toast msg={toast.msg} kind={toast.kind} />}
        </div>
      </div>

      {config.reports.length > 0 && (
        <ul className="space-y-2 border-t border-[#d6d3d1] pt-5">
          {config.reports.map((r) => (
            <li key={r.id} className="flex items-center gap-3 rounded-xl border border-[#d6d3d1] px-4 py-3">
              <FileText size={16} className="text-[#6366f1] flex-shrink-0" />
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-sm text-[#1e293b] hover:underline truncate">
                {r.title} · {r.year}
              </a>
              <button onClick={() => remove(r.id)} className="text-[#6b7280] hover:text-red-600 transition-colors">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {config.reports.length === 0 && (
        <p className="text-sm text-[#6b7280] italic">No reports uploaded yet.</p>
      )}
    </section>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export function AdminDashboard({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  return authed
    ? <Dashboard onLogout={() => setAuthed(false)} />
    : <Login onSuccess={() => setAuthed(true)} />;
}
