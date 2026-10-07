import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Github, Terminal, ShieldCheck, Zap, Bot, Play } from 'lucide-react';
import { TerminalDemo } from './TerminalDemo';

interface HeroProps {
  onOpenDocs: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDocs, onOpenChat }) => {
  const [copiedQuickCmd, setCopiedQuickCmd] = useState(false);
  const quickInstall = 'curl -fsSL https://getctx.dev | sh';

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(quickInstall);
    setCopiedQuickCmd(true);
    setTimeout(() => setCopiedQuickCmd(false), 2000);
  };

  return (
    <section className="relative pt-10 pb-16 border-b border-zinc-800/80 bg-zinc-950 overflow-hidden">
      {/* Background glow subtle effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Top Product Announcement / Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Open Source CLI</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span>Written in Go</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span>MIT License</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] font-mono text-cyan-400">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>MCP 1.0 Standard</span>
          </div>
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-700/60 text-[11px] font-mono text-cyan-300 transition-colors"
          >
            <Bot className="w-3 h-3 text-cyan-400" />
            <span>Try Gemini Assistant</span>
          </button>
        </div>

        {/* Hero Title & Explanations */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
            Git for context.
            <span className="block text-zinc-400 font-semibold text-2xl sm:text-3xl mt-1">
              Give your AI tools an accurate map of your codebase.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            CTX extracts structured API endpoints, database schemas, environment contracts, and conventions from your repository.
            It serves them to Cursor, Claude Desktop, and VS Code via MCP with hybrid TF-IDF + MiniLM search. Zero cloud dependencies.
          </p>

          {/* Quick Install Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            {/* Command Copy Box */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex-1 font-mono text-xs">
              <div className="flex items-center gap-2 overflow-x-auto min-w-0 pr-2">
                <span className="text-zinc-500">$</span>
                <span className="text-zinc-200 truncate select-all">{quickInstall}</span>
              </div>
              <button
                onClick={handleCopyInstall}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex-shrink-0"
                title="Copy install command"
              >
                {copiedQuickCmd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <a
                href="#install"
                className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Install CTX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#how-to-use"
                className="px-3.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-cyan-300 hover:text-white font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>Watch Demo Video</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Centerpiece: The Live Interactive Terminal & Before/After Demo */}
        <div className="mt-8">
          <TerminalDemo />
        </div>
      </div>
    </section>
  );
};
