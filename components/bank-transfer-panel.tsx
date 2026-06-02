import { Landmark } from "lucide-react";

/**
 * Shown at the bottom of every donation screen — lets donors give by direct
 * bank transfer and avoid the card processing fee entirely.
 */
export function BankTransferPanel() {
  const rows = [
    { label: "Account name", value: "PATHWAYS OF HOPE LTD" },
    { label: "BSB", value: "062-217" },
    { label: "Account number", value: "1102 4438" },
  ];

  return (
    <div className="rounded-2xl border border-[#EDD9B4] bg-[#FDF8F0] p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0">
          <Landmark size={18} className="text-[#B85C38]" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-semibold text-[#1C1410] text-sm">
            Prefer to give directly?
          </h3>
          <p className="text-xs text-[#8C7B72] leading-relaxed mt-0.5">
            Donate by bank transfer to skip the card processing fee — 100% reaches the children.
          </p>
        </div>
      </div>
      <dl className="divide-y divide-[#EDD9B4] rounded-xl bg-white border border-[#EDD9B4] overflow-hidden">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs uppercase tracking-wider text-[#8C7B72] font-medium">
              {r.label}
            </dt>
            <dd className="text-sm font-semibold text-[#1C1410] tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
