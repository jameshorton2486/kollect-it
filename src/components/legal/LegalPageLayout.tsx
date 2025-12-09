"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  label: string;
  title: string;
  sections: Section[];
}

export default function LegalPageLayout({
  label,
  title,
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal">
        <div className="container mx-auto max-w-4xl">
          <p className="text-label text-lux-gold mb-2">{label}</p>
          <h1 className="heading-page text-lux-black">{title}</h1>
        </div>
      </section>

      {/* Content with TOC */}
      <section className="section-normal">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[250px_1fr] gap-12">
            {/* Desktop Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === section.id
                          ? "text-lux-gold font-medium bg-lux-cream"
                          : "text-ink-700 hover:text-lux-gold hover:bg-lux-cream/50"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="max-w-4xl">
              <div className="space-y-10">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="heading-section text-lux-black mb-4">
                      {section.title}
                    </h2>
                    <div className="text-ink-600 space-y-4">{section.content}</div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
