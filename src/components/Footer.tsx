import React from 'react';
import { Terminal, Github, BookOpen, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 py-12 text-zinc-400 font-sans text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                CTX
              </div>
              <span className="font-bold text-sm text-white">CTX CLI</span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm mb-4 text-xs">
              Git for context. Extracts structured AST maps from your codebase and serves them to AI coding tools via Model Context Protocol (MCP).
            </p>
            <div className="font-mono text-[11px] text-zinc-400">
              MIT License • Built in Go • Statically linked binary
            </div>
          </div>

          {/* Links: Documentation */}
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase text-zinc-300 mb-3">
              Documentation
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-zinc-200 transition-colors text-left"
                >
                  Quickstart Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-zinc-200 transition-colors text-left"
                >
                  Model Context Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-zinc-200 transition-colors text-left"
                >
                  CLI Reference
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-zinc-200 transition-colors text-left"
                >
                  Team Server Deploy
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Product */}
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase text-zinc-300 mb-3">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#problem" className="hover:text-zinc-200 transition-colors">
                  Why AI Guesses
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-zinc-200 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-zinc-200 transition-colors">
                  Local Dashboard
                </a>
              </li>
              <li>
                <a href="#health" className="hover:text-zinc-200 transition-colors">
                  Health Score
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-zinc-200 transition-colors">
                  Privacy Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Community & Open Source */}
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase text-zinc-300 mb-3">
              Open Source
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  Issues & Bug Reports
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  Security Policy
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-200 transition-colors"
                >
                  Changelog (v0.9.4)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} CTX Project Contributors. Open source under the MIT License.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              No tracking cookies • 100% local-first
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
