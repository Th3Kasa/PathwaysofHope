import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1C1410] text-[#C4AE9A] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/kapoeta/logo.jpg"
                alt="Pathways of Hope"
                width={40}
                height={40}
                className="rounded-full object-cover opacity-90"
              />
              <span
                className="text-white text-lg font-semibold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Pathways of Hope
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#9A8578]">
              A faith-driven charity partnering with local leaders to bring
              safety, dignity, and a future to children in South Sudan.
            </p>
            <p className="text-xs mt-4 text-[#9A8578]">Registered Australian Charity · ABN TBC</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Navigate
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/missions", label: "Missions" },
                { href: "/missions/kapoeta", label: "Kapoeta Shelter" },
                { href: "/about", label: "About Us" },
                { href: "/donate", label: "Give Now" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#C4AE9A] hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Our Promise
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-[#9A8578]">
              <li>✓ 100% of donations reach the children</li>
              <li>✓ All travel costs self-funded by volunteers</li>
              <li>✓ Registered charity — donations tax-deductible</li>
              <li>✓ Full financial transparency on request</li>
              <li>✓ Led by Brother Hakim Peter — on the ground in Kapoeta</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3D2B1F] pt-8 text-xs text-[#6B5A52] text-center">
          © {new Date().getFullYear()} Pathways of Hope. All rights reserved. ·{" "}
          <Link href="/donate" className="hover:text-[#C4AE9A] transition-colors">
            Donate
          </Link>
        </div>
      </div>
    </footer>
  );
}
