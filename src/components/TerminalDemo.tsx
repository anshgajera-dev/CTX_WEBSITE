import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Sparkles, AlertTriangle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { DEMO_PROJECTS, QUICK_COMMANDS } from '../data/demoScripts';
import { ContextGraph } from './ContextGraph';
import { ProjectDemo } from '../types';

export const TerminalDemo: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<'nextjs' | 'fastapi' | 'gogin'>('nextjs');
  const project: ProjectDemo = DEMO_PROJECTS.find((p) => p.id === selectedProjectId) || DEMO_PROJECTS[0];

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [comparisonTab, setComparisonTab] = useState<'split' | 'before' | 'after'>('split');
  const terminalLogsRef = useRef<HTMLDivElement | null>(null);

  // Auto-run simulation sequence on mount or project switch
  useEffect(() => {
    setActiveStepIndex(0);
    setIsPlaying(true);
  }, [selectedProjectId]);

  useEffect(() => {
    if (!isPlaying) return;

    if (activeStepIndex < project.steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStepIndex((prev) => prev + 1);
      }, 2400);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [activeStepIndex, isPlaying, project.steps.length]);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [activeStepIndex]);

  const handleReplay = () => {
    setActiveStepIndex(0);
    setIsPlaying(true);
  };

  const handleSelectCommand = (cmd: string) => {
    setIsPlaying(false);
    const stepIdx = project.steps.findIndex((s) => s.command.toLowerCase().includes(cmd.toLowerCase().slice(0, 10)));
    if (stepIdx !== -1) {
      setActiveStepIndex(stepIdx);
    } else {
      // Set to last step for custom query
      setActiveStepIndex(project.steps.length - 1);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    handleSelectCommand(userInput.trim());
    setUserInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Compile executed steps up to activeStepIndex
  const executedSteps = project.steps.slice(0, activeStepIndex + 1);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Project Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-zinc-900/60 border border-zinc-800 rounded-xl backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 pl-2">Sample Project:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {DEMO_PROJECTS.map((p) => {
              const isSelected = p.id === selectedProjectId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-zinc-800 text-cyan-400 border border-cyan-500/30 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-cyan-950/60 text-cyan-300' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded border border-zinc-700/60 transition-colors"
            title="Replay sequence from beginning"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Replay demo</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Terminal + Right AI Tool View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Terminal & Interactive Graph */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Terminal Window */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="ml-2 font-mono text-xs text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  ctx-terminal ~ {project.id}-repo
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="hidden sm:inline">Go v1.23</span>
                <span className="text-zinc-600">•</span>
                <span className="text-cyan-400">ctx v0.9.4</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalLogsRef}
              className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-y-auto max-h-[380px] min-h-[320px] bg-zinc-950/90 text-zinc-200 select-text"
              aria-live="polite"
              aria-atomic="false"
            >
              {/* Terminal Initial Greeting */}
              <div className="text-zinc-400 mb-3 text-xs">
                # CTX CLI (Git for Context) – Extracting structured context for MCP
              </div>

              {/* Render Executed Steps */}
              {executedSteps.map((step, idx) => (
                <div key={idx} className="mb-4">
                  {/* Prompt Line */}
                  <div className="flex items-center gap-2 text-zinc-100 font-semibold mb-1">
                    <span className="text-cyan-400">user@dev:~/repo$</span>
                    <span className="text-white">{step.command}</span>
                  </div>

                  {/* Step Output */}
                  <div className="pl-3 border-l-2 border-zinc-800 space-y-0.5 text-zinc-300">
                    {step.output.map((line, lineIdx) => {
                      const isCheck = line.includes('✓');
                      const isWarn = line.includes('⚠');
                      const isBox = line.includes('┌') || line.includes('│') || line.includes('└');
                      const isCyan = line.startsWith('ctx:');

                      return (
                        <div
                          key={lineIdx}
                          className={`${
                            isCheck
                              ? 'text-emerald-400'
                              : isWarn
                              ? 'text-amber-400'
                              : isCyan
                              ? 'text-cyan-300 font-medium'
                              : isBox
                              ? 'text-zinc-400'
                              : 'text-zinc-300'
                          }`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Active Running Line or Idle Prompt */}
              {isPlaying ? (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse text-xs">
                  <span>Executing next step...</span>
                </div>
              ) : (
                <form onSubmit={handleUserSubmit} className="flex items-center gap-2 text-zinc-300 pt-1">
                  <span className="text-cyan-400">user@dev:~/repo$</span>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type 'ctx extract' or 'ctx health'..."
                    className="flex-1 bg-transparent border-none outline-hidden text-white font-mono placeholder:text-zinc-400 text-xs sm:text-[13px]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit command"
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Quick Command Suggestion Chips */}
            <div className="p-2.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-zinc-400 font-mono text-[11px] whitespace-nowrap pl-1">
                Run command:
              </span>
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleSelectCommand(cmd)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-cyan-300 font-mono text-xs whitespace-nowrap border border-zinc-700/50 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Context Graph Visualization (Tied to the same project) */}
          <div className="h-[260px] w-full">
            <ContextGraph
              nodes={project.graphNodes}
              activeStep={activeStepIndex}
              interactive={true}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: What The AI Tool Sees (Before vs After) */}
        <div className="lg:col-span-5 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Header & Mode Switcher */}
          <div className="p-3.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                What Your AI Tool Sees
              </span>
            </div>

            {/* Split / Before / After switcher */}
            <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px] font-mono">
              <button
                onClick={() => setComparisonTab('split')}
                className={`px-2 py-0.5 rounded ${
                  comparisonTab === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Side-by-side
              </button>
              <button
                onClick={() => setComparisonTab('before')}
                className={`px-2 py-0.5 rounded ${
                  comparisonTab === 'before' ? 'bg-red-950/80 text-red-300' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setComparisonTab('after')}
                className={`px-2 py-0.5 rounded ${
                  comparisonTab === 'after' ? 'bg-cyan-950/80 text-cyan-300' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                After (CTX)
              </button>
            </div>
          </div>

          {/* Prompt Question Being Tested */}
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800/80 text-xs">
            <div className="text-[11px] font-mono text-zinc-400 mb-1">USER QUERY TO AI:</div>
            <div className="text-zinc-200 font-medium">"{project.beforeAi.prompt}"</div>
          </div>

          {/* Before vs After Content Container */}
          <div className="flex-1 p-3.5 space-y-4 overflow-y-auto max-h-[580px]">
            {/* BEFORE PANEL (Without CTX) */}
            {(comparisonTab === 'split' || comparisonTab === 'before') && (
              <div className="rounded-lg border border-red-900/40 bg-red-950/10 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-red-950/30 border-b border-red-900/30 text-xs">
                  <div className="flex items-center gap-1.5 text-red-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Without CTX (AI Guessing)</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded">
                    Hallucination
                  </span>
                </div>

                <div className="p-3">
                  <pre className="font-mono text-xs text-red-200/90 overflow-x-auto leading-relaxed bg-zinc-950/80 p-2.5 rounded border border-red-900/20">
                    <code>{project.beforeAi.aiAnswer}</code>
                  </pre>

                  {/* List of critical flaws */}
                  <div className="mt-2.5 space-y-1">
                    <div className="text-[11px] font-mono text-red-400 font-semibold">
                      Why this breaks your build:
                    </div>
                    {project.beforeAi.flaws.map((flaw, i) => (
                      <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                        <span className="text-red-400 font-mono">✕</span>
                        <span>{flaw}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AFTER PANEL (With CTX) */}
            {(comparisonTab === 'split' || comparisonTab === 'after') && (
              <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/10 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-3 py-2 bg-cyan-950/30 border-b border-cyan-500/30 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>With CTX (Accurate Context via MCP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/40 px-1.5 py-0.5 rounded">
                      Zero guess
                    </span>
                    <button
                      onClick={() => handleCopy(project.afterAi.aiAnswer, 'after-code')}
                      className="text-zinc-400 hover:text-white p-1 rounded"
                      title="Copy code"
                    >
                      {copiedCode === 'after-code' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <pre className="font-mono text-xs text-cyan-100 overflow-x-auto leading-relaxed bg-zinc-950/90 p-2.5 rounded border border-cyan-500/20">
                    <code>{project.afterAi.aiAnswer}</code>
                  </pre>

                  {/* List of context highlights */}
                  <div className="mt-2.5 space-y-1">
                    <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                      Context provided automatically:
                    </div>
                    {project.afterAi.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-mono">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick MCP Bridge explanation footer */}
          <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span>Served via local MCP (stdio JSON-RPC)</span>
            <span className="text-zinc-400 flex items-center gap-1">
              Zero cloud latency <ArrowRight className="w-3 h-3 text-cyan-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
