"use client";

import { useState } from "react";
import { Lock, LogOut, Save, Loader2, CheckCircle2, TriangleAlert } from "lucide-react";

const CONTACT = "pathways_of_hope@outlook.com";

function Toast({ msg, kind }: { msg: string; kind: "ok" | "err" }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 ${
        kind === "ok"
          ? "bg-green-50 border border-green-200 text-green-700"
          : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      {kind === "ok" ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
      {msg}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      setAuthed(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect password");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setPassword("");
  };

  if (!authed) {
    return (
      <div className="bg-[#e7e5e4] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
              <Lock size={22} className="text-[#6366f1]" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
              Admin
            </h1>
          </div>
          <form onSubmit={login} className="bg-white rounded-2xl border border-[#d6d3d1] shadow-sm p-7 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-[#d6d3d1] rounded-xl text-sm text-[#1e293b] focus:outline-none focus:border-[#6366f1] transition-colors"
                autoFocus
                required
              />
            </div>
            {error && <Toast msg={error} kind="err" />}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
            Admin
          </h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl border border-[#d6d3d1] text-sm font-medium text-[#374151] hover:border-[#6366f1] transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>

        <div className="space-y-6">
          <ManualAdjustments />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}

const GOALS = [
  { id: "solar-system", label: "Solar Power System" },
  { id: "chicken-coop", label: "Chicken Coop & 200 Chicks" },
  { id: "water-pump", label: "Water Pump" },
  { id: "ongoing-operations", label: "Ongoing Operations" },
  { id: "sponsor-a-child", label: "Sponsor a Child" },
];

function ManualAdjustments() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(GOALS.map((g) => [g.id, "0"]))
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const save = async () => {
    setSaving(true);
    setToast(null);
    const adjustments: Record<string, number> = {};
    for (const g of GOALS) adjustments[g.id] = Number(values[g.id]) || 0;
    const res = await fetch("/api/admin/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adjustments }),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ msg: "Adjustments saved — totals updated on the donate page.", kind: "ok" });
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({ msg: data.error || "Save failed", kind: "err" });
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#d6d3d1] shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Manual donation adjustments</h2>
      <p className="text-sm text-[#6b7280] mb-6">
        Add offline gifts (cash or bank transfer) on top of live Stripe totals. These appear on the
        donate page. Enter cumulative AUD received per project.
      </p>
      <div className="space-y-3">
        {GOALS.map((g) => (
          <div key={g.id} className="flex items-center gap-4">
            <label className="flex-1 text-sm text-[#374151]">{g.label}</label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280]">A$</span>
              <input
                type="number"
                min="0"
                value={values[g.id]}
                onChange={(e) => setValues((v) => ({ ...v, [g.id]: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 border-2 border-[#d6d3d1] rounded-xl text-sm text-[#1e293b] focus:outline-none focus:border-[#6366f1] transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save adjustments
        </button>
        {toast && <Toast msg={toast.msg} kind={toast.kind} />}
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <section className="bg-white rounded-2xl border border-[#d6d3d1] shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Annual reports & photos</h2>
      <p className="text-sm text-[#6b7280] leading-relaxed">
        To upload annual reports or swap section photos, email{" "}
        <a href={`mailto:${CONTACT}`} className="text-[#6366f1] underline font-medium">
          {CONTACT}
        </a>{" "}
        with the files and details. We&apos;ll add them to the site within a business day.
      </p>
    </section>
  );
}
