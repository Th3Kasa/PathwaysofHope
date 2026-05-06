import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Thank You — Pathways of Hope",
  description: "Your donation to Pathways of Hope is on its way to Kapoeta. Thank you for partnering with us.",
};

export default function ThankYouPage() {
  return (
    <div className="bg-[#FDFAF6] min-h-[80vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="/images/kapoeta/logo.jpg"
              alt="Pathways of Hope"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Confirmation mark */}
        <div className="w-16 h-16 rounded-full bg-[#B85C38]/10 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-[#B85C38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Thank you. Your gift is on its way to Kapoeta.
        </h1>

        <p className="text-[#3D2B1F] text-lg leading-relaxed mb-4">
          A receipt has been sent to your email. Your donation goes directly to Brother Hakim Peter and the sixty children in his care — not to administration, not to travel, not to anything except the children themselves.
        </p>

        <p className="text-[#8C7B72] leading-relaxed mb-10">
          We will send you updates from Kapoeta — real updates, with real stories and real faces. You are now part of this community.
        </p>

        {/* Callout */}
        <div className="bg-[#F5EFE6] rounded-2xl p-8 mb-10 text-left">
          <h2
            className="text-xl font-semibold text-[#1C1410] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            What your gift makes possible
          </h2>
          <ul className="space-y-2 text-sm text-[#3D2B1F]">
            <li className="flex gap-3">
              <span className="text-[#B85C38] flex-shrink-0">✓</span>
              <span>A$25 feeds a child for a full week</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#B85C38] flex-shrink-0">✓</span>
              <span>A$100 covers a month of medical supplies</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#B85C38] flex-shrink-0">✓</span>
              <span>A$600 sponsors one child for an entire year</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#B85C38] flex-shrink-0">✓</span>
              <span>A$12,500 funds the water tower and solar pump</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/missions/kapoeta"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors"
          >
            Read the full story
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-full border border-[#DDD0C0] text-[#3D2B1F] hover:bg-[#F5EFE6] transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
