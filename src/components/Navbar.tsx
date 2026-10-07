import React, { useState } from 'react';
import { Star, Sun, Moon, Github, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenDocs: () => void;
  onOpenChat?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDocs,
  isDarkMode = true,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Introduction', href: '#introduction' },
    { label: 'Videos', href: '#videos' },
    { label: 'About Us', href: '#about-us' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 group-hover:border-cyan-500/80 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 transition-colors">
              CTX
            </div>
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              CTX
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onOpenDocs}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Docs
            </button>
          </nav>
        </div>

        {/* Action Controls & Get Started CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Star Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-zinc-400" />
            <span className="flex items-center gap-0.5 text-zinc-400 text-[11px]">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              4.8k
            </span>
          </a>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Primary CTA: Get Started */}
          <a
            href="#get-started"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs font-mono transition-colors shadow-sm"
          >
            Get Started
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 space-y-2 font-mono text-xs">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-zinc-300 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDocs();
            }}
            className="block py-1.5 text-zinc-300 hover:text-cyan-400 transition-colors w-full text-left cursor-pointer"
          >
            Docs
          </button>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub (4.8k stars)</span>
            </a>
            <a
              href="#get-started"
              onClick={() => setMobileMenuOpen(false)}
              className="text-cyan-400 font-medium"
            >
              Get Started →
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
