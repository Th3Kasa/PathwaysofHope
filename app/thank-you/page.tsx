import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Thank You — Pathways of Hope",
  description: "Your donation to Pathways of Hope is on its way to Kapoeta. Thank you for partnering with us.",
};

export default function ThankYouPage() {
  return (
    <div className="bg-[#e7e5e4] min-h-[80vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="/logo.png"
              alt="Pathways of Hope"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Confirmation mark */}
        <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Thank you. Your gift is on its way to Kapoeta.
        </h1>

        <p className="text-[#374151] text-lg leading-relaxed mb-4">
          A receipt has been sent to your email. Your donation goes directly to Hakim Peter and the children in his care — not to administration, not to travel, not to anything except the children themselves.
        </p>

        <p className="text-[#6b7280] leading-relaxed mb-10">
          We will send you updates from Kapoeta — real updates, with real stories and real faces. You are now part of this community.
        </p>

        {/* Callout */}
        <div className="bg-[#f5f5f4] rounded-2xl p-8 mb-10 text-left">
          <h2
            className="text-xl font-semibold text-[#1e293b] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            What your gift makes possible
          </h2>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li className="flex gap-3">
              <span className="text-[#6366f1] flex-shrink-0">✓</span>
              <span>A$25 feeds a child for a full week</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#6366f1] flex-shrink-0">✓</span>
              <span>A$100 covers a month of medical supplies</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#6366f1] flex-shrink-0">✓</span>
              <span>A$600 sponsors one child for an entire year</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#6366f1] flex-shrink-0">✓</span>
              <span>A$5,000 builds the chicken coop and stocks 200 chicks</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/missions/kapoeta"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors"
          >
            Read the full story
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-full border border-[#d6d3d1] text-[#374151] hover:bg-[#f5f5f4] transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
