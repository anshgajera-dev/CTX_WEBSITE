import React, { useState } from 'react';
import { Star, GitBranch, Shield, ArrowUpRight, Check, Copy, Code2, Heart } from 'lucide-react';

export const OpenSourceSection: React.FC = () => {
  const [copiedClone, setCopiedClone] = useState(false);

  const cloneCmd = 'git clone https://github.com/ctx-org/ctx && cd ctx && make test';

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const roadmapItems = [
    {
      version: 'v0.9.4',
      status: 'Current Release',
      highlight: true,
      items: [
        'Full AST parsers for TypeScript, Python, and Go',
        'Model Context Protocol (MCP 1.0) stdio server',
        '0-100 codebase context health scoring and audit',
        'Local web dashboard (`ctx ui`)'
      ]
    },
    {
      version: 'v0.10',
      status: 'In Progress (Q4 2026)',
      highlight: false,
      items: [
        'Kotlin (Spring Boot / Ktor) & Rust SeaORM AST extractors',
        'Custom team context rules in `.ctx/rules.toml`',
        'Incremental SQLite write ahead logging for fast Git rebases'
      ]
    },
    {
      version: 'v1.0',
      status: 'Planned',
      highlight: false,
      items: [
        'Zero-overhead background watcher daemon (`ctx watch`)',
        'Self-hosted team index caching server with S3 backend',
        'Direct integration with JetBrains AI Assistant and Neovim MCP'
      ]
    }
  ];

  return (
    <section id="about-us" className="py-20 border-b border-zinc-800/80 bg-zinc-950 scroll-mt-14 relative">
      <span id="opensource" className="absolute -top-14" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono text-cyan-400 mb-2">COMMUNITY & ROADMAP</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            100% Free & Open Source under MIT
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            CTX is built by developers who believe AI development tools should be transparent,
            inspectable, and locally controlled. No telemetry, no paid tier restrictions, no closed-source components.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>GitHub Stars</span>
            </div>
            <div className="text-2xl font-bold text-white">4,829</div>
            <div className="text-[11px] text-zinc-500 mt-1">Growing community</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>License</span>
            </div>
            <div className="text-2xl font-bold text-white">MIT</div>
            <div className="text-[11px] text-zinc-500 mt-1">Commercial friendly</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Contributors</span>
            </div>
            <div className="text-2xl font-bold text-white">38</div>
            <div className="text-[11px] text-zinc-500 mt-1">Active pull requests</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Language</span>
            </div>
            <div className="text-2xl font-bold text-white">Go 1.23</div>
            <div className="text-[11px] text-zinc-500 mt-1">Zero dependencies</div>
          </div>
        </div>

        {/* Roadmap section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Product Roadmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapItems.map((col, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border flex flex-col justify-between ${
                  col.highlight
                    ? 'bg-zinc-900/80 border-cyan-500/40 shadow-lg'
                    : 'bg-zinc-900/30 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-base font-bold text-white">
                      {col.version}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        col.highlight
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {col.status}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    {col.items.map((it, itIdx) => (
                      <li key={itIdx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono mt-0.5">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Box */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-semibold text-white mb-1">
              Want to contribute a parser or MCP tool?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
              CTX is built with standard Go packages and straightforward test tables. Clone the repository and run our automated test suite in seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClone}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs transition-colors flex items-center gap-2 border border-zinc-700"
            >
              {copiedClone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied test command</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy clone command</span>
                </>
              )}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>GitHub Repo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
