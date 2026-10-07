import React, { useState } from 'react';
import { Terminal, Layers, Cpu, Check, Copy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopy = (cmd: string, stepNum: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      num: 1,
      name: 'ctx init',
      title: 'Auto-detect project architecture',
      desc: 'Discovers package managers, framework markers, database ORMs, and language toolchains without executing your code.',
      badge: '< 15ms execution',
      code: `$ cd your-repo\n$ ctx init\n✓ detected Next.js 15, Prisma 5, TypeScript 5.6\n✓ generated .ctx/config.toml`,
      highlight: 'Discovers file structure and framework conventions'
    },
    {
      num: 2,
      name: 'ctx extract',
      title: 'Extract structured code symbols',
      desc: 'Parses Abstract Syntax Trees (AST) for route handlers, database schemas, environment contracts, and conventions into a local SQLite index.',
      badge: '200-400ms static parse',
      code: `$ ctx extract\n[1/4] Routes: 18 API route handlers\n[2/4] Schemas: 12 database tables\n[3/4] Envs: 9 config tokens mapped (0 secrets logged)\n[4/4] Embeddings: MiniLM vectors generated`,
      highlight: 'AST parsing without running untrusted scripts'
    },
    {
      num: 3,
      name: 'ctx serve',
      title: 'Serve via Model Context Protocol (MCP)',
      desc: 'Runs a lightning-fast local MCP server over stdio or HTTP. AI coding tools like Cursor and Claude automatically query the exact symbols they need.',
      badge: 'Local stdio / JSON-RPC',
      code: `$ ctx serve --mcp\nListening on stdio (MCP 1.0 JSON-RPC 2.0)\nExposing tools: ctx_search, ctx_get_schema, ctx_inspect_route\nReady for Cursor, Claude Desktop, and VS Code.`,
      highlight: 'Zero latency, pure local IPC bridge'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono text-cyan-400 mb-2">THREE-STEP WORKFLOW</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            How CTX maps and serves your project
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Everything runs as a single compiled Go binary on your machine.
            No cloud accounts, no API tokens, and no long indexing queues.
          </p>
        </div>

        {/* Stepped Layout */}
        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Number, Title, Description */}
              <div className="lg:col-span-5 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-cyan-400">
                  0{step.num}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <code className="text-sm font-mono font-bold text-white bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
                      {step.name}
                    </code>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-3">
                    {step.desc}
                  </p>
                  <div className="text-xs font-mono text-zinc-500">
                    Key advantage: <span className="text-zinc-300">{step.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Code block output */}
              <div className="lg:col-span-7">
                <div className="relative rounded-lg bg-zinc-950 border border-zinc-800/80 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/60 border-b border-zinc-800/60 text-xs">
                    <span className="font-mono text-zinc-400 text-[11px]">
                      terminal execution
                    </span>
                    <button
                      onClick={() => handleCopy(step.name, step.num)}
                      className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors"
                      title="Copy command"
                    >
                      {copiedStep === step.num ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy command</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-300 overflow-x-auto whitespace-pre">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
