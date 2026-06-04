"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Lock, LogOut, Loader2, Upload, Trash2, FileText,
  ImageIcon, Sparkles, CheckCircle2, TriangleAlert, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GoalMeta { id: string; title: string; defaultImage: string }
interface ReportItem { id: string; title: string; year: string; url: string; uploadedAt: string }
interface Config {
  images: Record<string, string>;
  reports: ReportItem[];
  goals: GoalMeta[];
  blobReady: boolean;
}

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
                  <strong>Storage not connected.</strong> Go to your Vercel dashboard → Storage → Create a Blob store → Connect to this project. The <code>BLOB_READ_WRITE_TOKEN</code> will be injected automatically. Until then, uploads cannot be saved.
                </div>
              </div>
            )}
            <PhotosSection config={config} reload={load} />
            <ReportsSection config={config} reload={load} />
          </div>
        )}
      </div>
    </div>
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
  return (
    <section className={card}>
      <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Donation card photos</h2>
      <p className="text-sm text-[#6b7280] mb-6">
        Upload a new photo or generate one with AI for each donation section. Photos appear on the donation cards and individual donation pages.
      </p>
      <div className="space-y-6">
        {config.goals.map((goal) => (
          <PhotoRow
            key={goal.id}
            goal={goal}
            currentImage={config.images[goal.id] ?? goal.defaultImage}
            hasOverride={Boolean(config.images[goal.id])}
            aiPrompt={AI_PROMPTS[goal.id] ?? `Photorealistic photo related to: ${goal.title}, South Sudan charity, documentary style`}
            reload={reload}
          />
        ))}
      </div>
    </section>
  );
}

function PhotoRow({ goal, currentImage, hasOverride, aiPrompt, reload }: {
  goal: GoalMeta; currentImage: string; hasOverride: boolean; aiPrompt: string; reload: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const upload = async (file: File) => {
    setUploading(true); setToast(null);
    const fd = new FormData();
    fd.append("kind", "image"); fd.append("key", goal.id); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) { setToast({ msg: "Photo updated.", kind: "ok" }); reload(); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Upload failed", kind: "err" }); }
  };

  const generate = async () => {
    setGenerating(true); setToast(null);
    const res = await fetch("/api/admin/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: goal.id, prompt: aiPrompt }),
    });
    setGenerating(false);
    if (res.ok) { setToast({ msg: "AI image generated and saved.", kind: "ok" }); reload(); }
    else { const d = await res.json().catch(() => ({})); setToast({ msg: d.error || "Generation failed", kind: "err" }); }
  };

  const reset = async () => {
    const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resetImageKey: goal.id }) });
    if (res.ok) { setToast({ msg: "Reset to default photo.", kind: "ok" }); reload(); }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
      {/* Preview */}
      <div className="relative w-full sm:w-40 h-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f5f4] border border-[#d6d3d1]">
        <Image src={currentImage} alt={goal.title} fill className="object-cover" sizes="160px" unoptimized />
        {hasOverride && (
          <span className="absolute top-1.5 left-1.5 text-[10px] bg-[#6366f1] text-white px-1.5 py-0.5 rounded-full font-semibold">Custom</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1e293b] mb-3">{goal.title}</p>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading || generating} className={btnGhost}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload photo
          </button>
          <button onClick={generate} disabled={uploading || generating} className={btnGhost}>
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? "Generating…" : "Generate AI photo"}
          </button>
          {hasOverride && (
            <button onClick={reset} disabled={uploading || generating} className={btnGhost} title="Restore default">
              <RefreshCw size={14} /> Reset
            </button>
          )}
        </div>
        {toast && <div className="mt-2"><Toast msg={toast.msg} kind={toast.kind} /></div>}
      </div>
    </div>
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
