import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';

interface Tip {
  id: string;
  points: number;
  category: string;
  title: string;
  codeSnippet: string;
  fixed: boolean;
}

export const HealthScore: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([
    {
      id: 'tip1',
      points: 6,
      category: 'Routes',
      title: 'Missing response return type on POST /api/v2/webhooks',
      codeSnippet: 'Add export type WebhookResponse to handler return signature.',
      fixed: false
    },
    {
      id: 'tip2',
      points: 4,
      category: 'Schemas',
      title: 'Missing enum comment on accounts.billing_tier',
      codeSnippet: 'Add /// [Free, Pro, Enterprise] docstring in schema.prisma.',
      fixed: false
    },
    {
      id: 'tip3',
      points: 3,
      category: 'Environment',
      title: 'Undeclared fallback for REDIS_CLUSTER_PORT in .env.example',
      codeSnippet: 'Add REDIS_CLUSTER_PORT=6379 to .env.example template.',
      fixed: false
    },
    {
      id: 'tip4',
      points: 3,
      category: 'Migrations',
      title: 'Orphan migration 0042_add_tenants has no rollback definition',
      codeSnippet: 'Add down() migration function or drop foreign key constraint rule.',
      fixed: false
    }
  ]);

  const baseScore = 84;
  const currentBonus = tips.filter((t) => t.fixed).reduce((acc, t) => acc + t.points, 0);
  const currentScore = Math.min(100, baseScore + currentBonus);

  const toggleTip = (id: string) => {
    setTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, fixed: !t.fixed } : t))
    );
  };

  const handleFixAll = () => {
    setTips((prev) => prev.map((t) => ({ ...t, fixed: true })));
  };

  const handleReset = () => {
    setTips((prev) => prev.map((t) => ({ ...t, fixed: false })));
  };

  // Circumference for circular gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <section id="health" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono text-cyan-400 mb-2">CODEBASE CONTEXT METRICS</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Context health score: 0–100 gauge
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            AI models hallucinate most when code contracts are ambiguous.
            <code className="text-cyan-400 font-mono mx-1">ctx health</code> audits your repository for missing schema relations, untyped routes, and undocumented environment variables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Animated Radial Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#27272a"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Dynamic Value Arc */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={currentScore === 100 ? '#10b981' : '#06b6d4'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Gauge Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-mono font-bold text-white tracking-tight">
                  {currentScore}
                </span>
                <span className="text-xs font-mono text-zinc-400">/ 100</span>
                <span
                  className={`mt-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                    currentScore === 100
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}
                >
                  {currentScore === 100 ? 'GRADE: A+ (PERFECT)' : 'GRADE: A-'}
                </span>
              </div>
            </div>

            <div className="text-center max-w-xs">
              <h4 className="text-sm font-semibold text-zinc-200 mb-1">
                {currentScore === 100
                  ? 'All context contracts verified!'
                  : 'Actionable improvements detected'}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click each fix on the right to simulate resolution and boost your score.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={handleFixAll}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply all fixes</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tips Checklist */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-zinc-400">RECOMMENDED FIXES</span>
              <span className="text-xs font-mono text-cyan-400">
                {tips.filter((t) => t.fixed).length} of {tips.length} resolved
              </span>
            </div>

            <div className="space-y-3">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  onClick={() => toggleTip(tip.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    tip.fixed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {tip.fixed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-600 hover:border-cyan-400 flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                            +
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                            {tip.category}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {tip.title}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">
                          {tip.codeSnippet}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold px-2 py-1 rounded whitespace-nowrap ${
                        tip.fixed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {tip.fixed ? 'RESOLVED' : `+${tip.points} pts`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CLI Tip */}
            <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Run in CI to enforce standards:</span>
              <code className="text-cyan-400">ctx health --fail-under=90</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
