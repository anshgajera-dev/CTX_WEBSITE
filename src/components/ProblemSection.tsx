import React from 'react';
import { AlertCircle, FileX, Database, KeyRound, ShieldAlert } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="introduction" className="py-20 border-b border-zinc-800/80 bg-zinc-950 scroll-mt-14 relative">
      <span id="problem" className="absolute -top-14" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Why AI coding tools guess about your codebase
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Large Language Models are brilliant at syntax, but blind to your project architecture.
            Without an extracted map of your routes, database schemas, and configuration, they invent endpoints
            and query tables that don't exist.
          </p>
        </div>

        {/* 3 Concrete Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phantom API Routes */}
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400 mb-4">
                <FileX className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                1. Phantom API endpoints
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                When you ask for a client call, your AI invents <code className="text-red-400 bg-red-950/40 px-1 py-0.5 rounded font-mono">/api/v1/user/profile</code> instead of using your actual <code className="text-cyan-400 bg-cyan-950/40 px-1 py-0.5 rounded font-mono">/api/v2/account/me</code> handler.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-red-300">
              <span className="text-zinc-500">// Result:</span> 404 Not Found in production
            </div>
          </div>

          {/* Card 2: Broken DB Schemas */}
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                2. Hallucinated database columns
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                It queries <code className="text-amber-400 bg-amber-950/40 px-1 py-0.5 rounded font-mono">users.company_id</code> when your schema actually relies on a many-to-many <code className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded font-mono">memberships</code> join table.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-amber-300">
              <span className="text-zinc-500">// Result:</span> SQL / ORM foreign key exceptions
            </div>
          </div>

          {/* Card 3: Missing Environment Variables */}
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                3. Mystery config variables
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                It references environment variables that your team never configured, with no defaults or documentation in your repository.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-purple-300">
              <span className="text-zinc-500">// Result:</span> Silent undefined runtime crash
            </div>
          </div>
        </div>

        {/* The CTX Solution Banner */}
        <div className="mt-10 p-5 rounded-xl bg-zinc-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <p className="text-sm text-zinc-200">
              <strong className="text-white font-medium">How CTX fixes this:</strong> Static AST extraction turns your codebase into a typed map, served directly into your model via MCP before it writes code.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded whitespace-nowrap">
            100% deterministic context
          </span>
        </div>
      </div>
    </section>
  );
};
