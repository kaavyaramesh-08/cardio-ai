"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Assessment", href: "/assessment" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Patient Profiles", href: "/profiles" },
  { name: "Models", href: "/models" },
  { name: "ML Pipeline", href: "/pipeline" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F7FBF8]/90 backdrop-blur-md border-b border-[#D3E8DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#8FBF9F] flex items-center justify-center text-white shadow-sm group-hover:bg-[#7CAE8E] transition-colors">
              <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#1F3D2B]">
                Cardio<span className="text-[#52796F]">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-[#EAF6EE] text-[#1F3D2B] rounded-full border border-[#D3E8DA]">
                Research Prototype
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#EAF6EE] text-[#1F3D2B] font-semibold shadow-xs"
                      : "text-[#4F6B58] hover:text-[#1F3D2B] hover:bg-[#EAF6EE]/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-sm hover:shadow"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F3D2B] hover:bg-[#EAF6EE] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D3E8DA] bg-[#F7FBF8] px-4 pt-2 pb-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-[#EAF6EE] text-[#1F3D2B] font-semibold"
                    : "text-[#4F6B58] hover:bg-[#EAF6EE]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-[#8FBF9F] text-white"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
