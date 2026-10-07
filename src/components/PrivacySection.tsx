import React from 'react';
import { ShieldCheck, Lock, EyeOff, HardDrive, WifiOff, FileCheck } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with prominent shield */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 font-mono text-xs mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>SECURITY FIRST ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Your source code and secrets stay on your machine
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Developers should not have to upload proprietary IP or sensitive secrets to a third-party SaaS just to get smart context.
            CTX is engineered to run 100% locally with zero external network dependencies.
          </p>
        </div>

        {/* 4 Strict Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                Zero secret values stored or parsed
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                CTX inspects <code className="text-cyan-400 font-mono">.env.example</code> or your type schema to understand what environment variables exist. It strictly ignores and redacts <code className="text-zinc-300 font-mono">.env</code> values so production keys, tokens, and credentials are never indexed.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                Automated entropy secret scanner
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Built-in static analysis checks every token against high-entropy regex patterns (AWS tokens, Stripe secrets, private keys). If a developer accidentally hardcoded a token in a test file, CTX redacts it with <code className="text-emerald-400 font-mono">[REDACTED_SECRET]</code> prior to vectorization.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                Local-only SQLite storage
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                All extracted graphs, AST symbols, and hybrid MiniLM vector weights live in <code className="text-purple-400 font-mono">.ctx/index.db</code> inside your repository root. You have complete physical control over your indexed artifacts.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                Air-gapped and zero telemetry
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                CTX does not contain telemetry beacons, phone-home metrics, or remote logging. It operates flawlessly inside firewall-restricted enterprise virtual desktops and air-gapped CI runners without internet connectivity.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Snippet Box */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit local output at any time:</span>
            <code className="text-cyan-400">ctx extract --dry-run | jq .</code>
          </div>
          <span className="text-zinc-500">
            Inspect every single extracted byte in plain JSON
          </span>
        </div>
      </div>
    </section>
  );
};
