import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  FastForward,
  Copy,
  Check,
  Terminal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  FolderGit2,
  Activity,
  Layers,
  Cpu,
  MousePointer2,
  Globe,
  Wifi,
  Battery,
  Search,
  Folder,
  FileCode,
  FileJson,
  Mic,
  MicOff,
  Radio,
  Bot,
  MessageSquare,
  Boxes
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  timeRange: string;
  startSec: number;
  endSec: number;
  tag: string;
  command: string;
  description: string;
  subtitle: string;
  narrationText: string;
  app: 'terminal' | 'ide';
}

// 80 seconds total (1 minute 20 seconds) - strictly within the 1:00 to 1:30 minute requirement!
const TOTAL_DURATION_SEC = 80;

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Install CTX Binary',
    timeRange: '0:00 - 0:13',
    startSec: 0,
    endSec: 13,
    tag: 'Install',
    command: 'curl -fsSL https://getctx.dev | sh',
    description: 'Download statically compiled Go binary with SHA-256 verification in <2s.',
    subtitle: 'Step 1: Installing standalone CTX binary. Zero runtime dependencies.',
    narrationText: 'First, install the standalone CTX binary using our quick curl script. It verifies the SHA-256 checksum and installs in under two seconds.',
    app: 'terminal',
  },
  {
    id: 2,
    title: 'Initialize Repository',
    timeRange: '0:13 - 0:26',
    startSec: 13,
    endSec: 26,
    tag: 'Init',
    command: 'ctx init',
    description: 'Auto-detect package managers, framework markers, and database schemas in 14ms.',
    subtitle: 'Step 2: Scanning repo layout and generating minimal .ctx/config.toml.',
    narrationText: 'Next, run ctx init in your repository. CTX auto-detects your web framework and ORM schemas, generating your configuration in just 14 milliseconds.',
    app: 'terminal',
  },
  {
    id: 3,
    title: 'Extract AST Context Graph',
    timeRange: '0:26 - 0:39',
    startSec: 26,
    endSec: 39,
    tag: 'Extract',
    command: 'ctx extract',
    description: 'Parse route handlers, DB models, and env contracts into local SQLite index.',
    subtitle: 'Step 3: Extracting AST graph and generating hybrid TF-IDF + MiniLM embeddings.',
    narrationText: 'Now, run ctx extract. Static analysis maps your API routes, database models, and environment tokens into a local SQLite index with MiniLM embeddings.',
    app: 'terminal',
  },
  {
    id: 4,
    title: 'Audit Health Score (0-100)',
    timeRange: '0:39 - 0:52',
    startSec: 39,
    endSec: 52,
    tag: 'Audit',
    command: 'ctx health',
    description: 'Detect missing response types, orphan migrations, and unmapped env vars.',
    subtitle: 'Step 4: Auditing code contracts to eliminate ambiguities that cause AI hallucinations.',
    narrationText: 'Run ctx health to audit code contracts. It identifies missing types and undocumented env vars, helping you achieve a perfect 100 out of 100 health score.',
    app: 'terminal',
  },
  {
    id: 5,
    title: 'Connect MCP to Any AI Tool',
    timeRange: '0:52 - 1:05',
    startSec: 52,
    endSec: 65,
    tag: 'Any AI Tool',
    command: 'ctx serve --mcp',
    description: 'Connect Cursor, Claude Desktop, VS Code (Continue/Cline), and Windsurf via MCP.',
    subtitle: 'Step 5: CTX serves live context via MCP to Cursor, Claude Desktop, VS Code, and any AI client.',
    narrationText: 'Now connect to any AI coding tool. CTX works via MCP with Cursor, Claude Desktop, VS Code Continue, Cline, and Windsurf. Just add ctx serve mcp, and your tools instantly see your codebase map.',
    app: 'ide',
  },
  {
    id: 6,
    title: 'AI Prompting in IDEs & Chats',
    timeRange: '1:05 - 1:20',
    startSec: 65,
    endSec: 80,
    tag: 'IDEs & Chats',
    command: 'ctx search "auth flow"',
    description: 'Prompt in Cursor, Claude Desktop chat, or VS Code inline with zero hallucination.',
    subtitle: 'Step 6: IDEs and AI chats query ctx_search & ctx_get_schema for verified answers.',
    narrationText: 'Whether you prompt inside Cursor Composer, VS Code inline chat, or Claude Desktop, your AI automatically queries ctx search and database schemas, writing accurate code with zero hallucination.',
    app: 'ide',
  },
];

export const HowToUseVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceName, setVoiceName] = useState<string>('Male Voice (Default)');
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Active AI Tool Tab in IDE scene: 'cursor' | 'claude' | 'vscode'
  const [activeAiTool, setActiveAiTool] = useState<'cursor' | 'claude' | 'vscode'>('cursor');

  const lastSpokenChapterIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= TOTAL_DURATION_SEC) {
          return 0; // loop
        }
        return prev + 0.1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Current active chapter based on time
  const activeChapter =
    CHAPTERS.find((ch) => currentSec >= ch.startSec && currentSec < ch.endSec) || CHAPTERS[0];

  // Elapsed seconds inside current chapter (0 to ~13s)
  const chapterSec = currentSec - activeChapter.startSec;

  // In chapter 5 & 6, cycle through AI tools smoothly to demonstrate broad support
  useEffect(() => {
    if (activeChapter.id === 5 || activeChapter.id === 6) {
      if (chapterSec < 4.5) {
        setActiveAiTool('cursor');
      } else if (chapterSec < 9) {
        setActiveAiTool('claude');
      } else {
        setActiveAiTool('vscode');
      }
    }
  }, [activeChapter.id, chapterSec]);

  // Male Voice Selection Helper
  const getMaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const maleKeywords = [
      'male',
      'david',
      'alex',
      'daniel',
      'guy',
      'mark',
      'george',
      'oliver',
      'james',
      'ryan',
      'tom',
      'fred',
      'aaron',
      'lee',
      'chris',
      'paul',
      'brian',
      'steven',
      'en-us-standard-b',
      'en-us-standard-d',
      'en-us-standard-j'
    ];

    const femaleKeywords = [
      'zira',
      'samantha',
      'victoria',
      'karen',
      'fiona',
      'moira',
      'tessa',
      'veena',
      'female',
      'catherine',
      'allison',
      'ava',
      'susan',
      'lisa',
      'katherine',
      'jenny'
    ];

    // Priority 1: explicitly matched male keyword
    const explicitMale = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
    );
    if (explicitMale) return explicitMale;

    // Priority 2: English voice that is not female
    const nonFemale = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        !femaleKeywords.some((fem) => v.name.toLowerCase().includes(fem))
    );
    if (nonFemale) return nonFemale;

    return voices.find((v) => v.lang.startsWith('en')) || voices[0];
  };

  // Background Speech Narration Engine (Configured for MALE VOICE)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (!isVoiceoverEnabled || !isPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Check if we entered a new chapter that hasn't been spoken yet
    if (lastSpokenChapterIdRef.current !== activeChapter.id) {
      lastSpokenChapterIdRef.current = activeChapter.id;
      window.speechSynthesis.cancel();

      try {
        const utterance = new SpeechSynthesisUtterance(activeChapter.narrationText);
        utterance.rate = 1.08; // natural, brisk developer pacing
        utterance.pitch = 0.92; // slightly lower pitch for a resonant masculine voice

        const maleVoice = getMaleVoice();
        if (maleVoice) {
          utterance.voice = maleVoice;
          setVoiceName(maleVoice.name);
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }, [activeChapter.id, isPlaying, isVoiceoverEnabled]);

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Compute animated mouse coordinates and actions
  let mouseX = 50;
  let mouseY = 50;
  let isMouseClicking = false;
  let mouseLabel = '';

  if (activeChapter.id === 1) {
    if (chapterSec < 3) {
      mouseX = 25 + (chapterSec / 3) * 20;
      mouseY = 35 + (chapterSec / 3) * 10;
    } else if (chapterSec < 6) {
      mouseX = 48;
      mouseY = 46;
      isMouseClicking = chapterSec > 4 && chapterSec < 4.6;
    } else {
      mouseX = 72;
      mouseY = 52;
    }
  } else if (activeChapter.id === 2) {
    if (chapterSec < 4) {
      mouseX = 30 + (chapterSec / 4) * 35;
      mouseY = 38 + (chapterSec / 4) * 8;
    } else {
      mouseX = 65;
      mouseY = 46;
    }
  } else if (activeChapter.id === 3) {
    if (chapterSec < 5) {
      mouseX = 40 + (chapterSec / 5) * 25;
      mouseY = 44;
    } else {
      mouseX = 62;
      mouseY = 58;
      mouseLabel = 'Inspecting .ctx/index.db';
    }
  } else if (activeChapter.id === 4) {
    if (chapterSec < 4) {
      mouseX = 35;
      mouseY = 40;
    } else if (chapterSec < 9) {
      mouseX = 68;
      mouseY = 50;
      isMouseClicking = chapterSec > 6 && chapterSec < 6.6;
      mouseLabel = 'Apply fix (+12)';
    } else {
      mouseX = 72;
      mouseY = 62;
    }
  } else if (activeChapter.id === 5) {
    if (chapterSec < 4) {
      mouseX = 30;
      mouseY = 24;
      isMouseClicking = chapterSec > 2 && chapterSec < 2.5;
      mouseLabel = 'Cursor MCP';
    } else if (chapterSec < 8.5) {
      mouseX = 48;
      mouseY = 24;
      isMouseClicking = chapterSec > 6 && chapterSec < 6.5;
      mouseLabel = 'Claude Desktop MCP';
    } else {
      mouseX = 68;
      mouseY = 24;
      isMouseClicking = chapterSec > 10 && chapterSec < 10.5;
      mouseLabel = 'VS Code Continue';
    }
  } else if (activeChapter.id === 6) {
    if (chapterSec < 4) {
      mouseX = 75;
      mouseY = 45;
      mouseLabel = 'Querying ctx_search';
    } else if (chapterSec < 9) {
      mouseX = 50;
      mouseY = 55;
      mouseLabel = 'Claude Desktop Stream';
    } else {
      mouseX = 80;
      mouseY = 65;
      mouseLabel = 'VS Code Inline Complete';
    }
  }

  // Typewriter effect for commands
  const getTypedCommand = (cmd: string, typingDurationSec: number = 2.5) => {
    if (chapterSec >= typingDurationSec) return cmd;
    const charCount = Math.floor((chapterSec / typingDurationSec) * cmd.length);
    return cmd.slice(0, Math.max(0, charCount));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentSec(val);
    lastSpokenChapterIdRef.current = null;
  };

  const handleJumpToChapter = (chapter: Chapter) => {
    setCurrentSec(chapter.startSec);
    setIsPlaying(true);
    lastSpokenChapterIdRef.current = null;
  };

  const toggleVoiceover = () => {
    if (isVoiceoverEnabled) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsVoiceoverEnabled(false);
      setIsSpeaking(false);
    } else {
      setIsVoiceoverEnabled(true);
      lastSpokenChapterIdRef.current = null;
    }
  };

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <section id="videos" className="py-20 border-b border-zinc-800/80 bg-zinc-950 scroll-mt-14 relative">
      <span id="how-to-use" className="absolute -top-14" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 font-mono text-xs mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>LIVE PC SCREANCAST • MALE VOICEOVER NARRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              How to use CTX with any AI tool in IDEs & chats (1:20 min)
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Complete PC screencast with natural male voiceover narration demonstrating installation,
              AST extraction, and serving context to Cursor, Claude Desktop, and VS Code.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            {/* Live Narration Indicator (Male Voice) */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : isPlaying ? 'bg-cyan-400' : 'bg-amber-400'}`} />
              <span className="text-zinc-300">
                {isSpeaking ? 'Male Voice: Speaking' : isPlaying ? 'Playing' : 'Ready (Click to Play)'}
              </span>
              {/* Equalizer animation */}
              {isSpeaking && (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-bounce" />
                  <span className="w-0.5 h-3.5 bg-emerald-400 animate-bounce delay-75" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-bounce delay-150" />
                </div>
              )}
            </div>

            <span className="text-zinc-600">|</span>
            <span className="text-cyan-400 font-semibold">1m 20s (80s)</span>
          </div>
        </div>

        {/* Video Player Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Simulated PC Monitor (8 Cols) */}
          <div
            ref={containerRef}
            className="lg:col-span-8 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative select-none ring-1 ring-zinc-800/80"
          >
            {/* Top macOS Menu Bar */}
            <div className="px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] font-sans text-zinc-300 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="font-bold text-zinc-100 text-xs"></span>
                <span className="font-semibold text-white">
                  {activeChapter.app === 'ide'
                    ? activeAiTool === 'claude'
                      ? 'Claude Desktop'
                      : activeAiTool === 'vscode'
                      ? 'VS Code (Continue)'
                      : 'Cursor IDE'
                    : 'Ghostty Terminal'}
                </span>
                <span className="hidden sm:inline text-zinc-400">File</span>
                <span className="hidden sm:inline text-zinc-400">Edit</span>
                <span className="hidden sm:inline text-zinc-400">View</span>
                <span className="hidden sm:inline text-zinc-400">AI Tools</span>
              </div>

              <div className="flex items-center gap-3 text-zinc-400 text-[11px] font-mono">
                <span className="text-cyan-400 font-semibold hidden sm:inline">MCP 1.0 Bridge</span>
                <Wifi className="w-3.5 h-3.5 text-zinc-300" />
                <Battery className="w-3.5 h-3.5 text-zinc-300" />
                <span>10:42 AM</span>
              </div>
            </div>

            {/* Simulated Desktop Screen / Active Application Window */}
            <div className="relative flex-1 min-h-[420px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
              {/* Desktop Ambient Glow */}
              <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Play Overlay when paused (video does NOT autoplay) */}
              {!isPlaying && (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
                  aria-label="Play demo video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 pl-1">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-zinc-950 text-zinc-950" />
                  </div>
                  <div className="mt-4 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-700 text-xs sm:text-sm font-mono text-white tracking-wide shadow-xl group-hover:border-cyan-400 transition-colors">
                    Click to Play Demo Screencast (1:20 min)
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-2">
                    Shows real terminal & IDE workflow with male voice narration
                  </div>
                </div>
              )}

              {/* MOVING MOUSE CURSOR */}
              <div
                className="absolute z-40 pointer-events-none transition-all duration-300 ease-out flex items-center gap-1.5"
                style={{
                  left: `${mouseX}%`,
                  top: `${mouseY}%`,
                  transform: 'translate(-2px, -2px)',
                }}
              >
                <div className="relative">
                  <MousePointer2 className="w-5 h-5 text-white fill-black drop-shadow-lg" />
                  {/* Click Ripple Animation */}
                  {isMouseClicking && (
                    <span className="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-ping" />
                  )}
                </div>
                {mouseLabel && (
                  <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md">
                    {mouseLabel}
                  </span>
                )}
              </div>

              {/* ACTIVE APP 1: TERMINAL (Chapters 1 to 4) */}
              {activeChapter.app === 'terminal' && (
                <div className="relative z-10 w-full max-w-2xl mx-auto rounded-xl bg-zinc-950/95 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
                  {/* Terminal Header */}
                  <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-zinc-400 text-[11px]">
                        dev@macbook-pro: ~/projects/saas-backend
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">zsh • 80x24</span>
                  </div>

                  {/* Terminal Screen Body */}
                  <div className="p-4 space-y-2.5 text-zinc-200 min-h-[260px] max-h-[300px] overflow-hidden leading-relaxed">
                    {/* SCENE 1: INSTALL */}
                    {activeChapter.id === 1 && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <div className="text-zinc-400 text-[11px]">
                          # Step 1: Install standalone CTX CLI binary
                        </div>
                        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span>➜ ~/projects $</span>
                          <span className="text-white">
                            {getTypedCommand('curl -fsSL https://getctx.dev | sh', 2.5)}
                          </span>
                          {chapterSec < 2.5 && <span className="w-2 h-4 bg-cyan-400 animate-pulse" />}
                        </div>

                        {chapterSec >= 2.5 && (
                          <div className="pl-3 border-l-2 border-zinc-800 space-y-1 text-zinc-300 text-[11px] pt-1">
                            <div>• Downloading ctx_darwin_arm64.tar.gz [18.2 MB]...</div>
                            <div className="w-48 bg-zinc-800 h-1 rounded-full overflow-hidden">
                              <div
                                className="bg-cyan-400 h-full transition-all duration-300"
                                style={{ width: `${Math.min(100, (chapterSec / 6) * 100)}%` }}
                              />
                            </div>
                            {chapterSec >= 5 && (
                              <>
                                <div className="text-zinc-400">
                                  • Verifying SHA-256 hash: <span className="text-cyan-400">9e4f2a... [VALID]</span>
                                </div>
                                <div className="text-zinc-400">• Installing binary to /usr/local/bin/ctx</div>
                                <div className="text-emerald-400 font-bold pt-1">
                                  ✓ ctx v0.9.4 ready! Run 'ctx init' in your repository.
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SCENE 2: INIT */}
                    {activeChapter.id === 2 && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span>➜ saas-backend (main) $</span>
                          <span className="text-white">
                            {getTypedCommand('ctx init', 2)}
                          </span>
                          {chapterSec < 2 && <span className="w-2 h-4 bg-cyan-400 animate-pulse" />}
                        </div>

                        {chapterSec >= 2 && (
                          <div className="pl-3 border-l-2 border-cyan-500/40 space-y-1 text-[11px] pt-1">
                            <div className="text-zinc-400">ctx: discovering repository layout...</div>
                            <div className="text-emerald-400">✓ detected Next.js (App Router) at /src/app</div>
                            <div className="text-emerald-400">✓ detected Prisma ORM schema at /prisma/schema.prisma</div>
                            <div className="text-emerald-400">✓ detected TypeScript 5.6 and NextAuth v5</div>
                            <div className="text-cyan-300">✓ created .ctx/config.toml (14ms)</div>
                            <div className="text-zinc-300 font-bold pt-1">
                              Initialized CTX repository in 18ms.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SCENE 3: EXTRACT */}
                    {activeChapter.id === 3 && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span>➜ saas-backend (main) $</span>
                          <span className="text-white">
                            {getTypedCommand('ctx extract', 2)}
                          </span>
                          {chapterSec < 2 && <span className="w-2 h-4 bg-cyan-400 animate-pulse" />}
                        </div>

                        {chapterSec >= 2 && (
                          <div className="pl-3 border-l-2 border-emerald-500/40 space-y-1 text-[11px] pt-1">
                            <div className="text-zinc-400">ctx: extracting structured codebase graph...</div>
                            <div className="text-cyan-300">[1/4] Routes:   14 API handlers (/api/auth, /api/workspaces, /api/teams)</div>
                            <div className="text-emerald-300">[2/4] Schemas:  9 Prisma models (User, Account, Workspace, Membership)</div>
                            <div className="text-amber-300">[3/4] Envs:     11 tokens (.env.example verified, 0 secret leaks)</div>
                            <div className="text-purple-300">[4/4] Vectors:  Hybrid TF-IDF + MiniLM embeddings generated for 42 blocks</div>
                            <div className="text-emerald-400 font-bold pt-1">
                              Indexed in 312ms. Context index: .ctx/index.db (412 KB).
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SCENE 4: HEALTH SCORE */}
                    {activeChapter.id === 4 && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span>➜ saas-backend (main) $</span>
                          <span className="text-white">
                            {getTypedCommand('ctx health', 2)}
                          </span>
                          {chapterSec < 2 && <span className="w-2 h-4 bg-cyan-400 animate-pulse" />}
                        </div>

                        {chapterSec >= 2 && (
                          <div className="pl-3 border-l-2 border-amber-500/40 space-y-1 text-[11px] pt-1">
                            <div className="text-zinc-200 font-bold">
                              Overall Score: {chapterSec < 7 ? (
                                <span className="text-amber-400">88 / 100 [A-]</span>
                              ) : (
                                <span className="text-emerald-400">100 / 100 [A+] (PERFECT)</span>
                              )}
                            </div>
                            <div className="text-zinc-400">✓ Route Coverage: 100% (14/14 handlers typed)</div>
                            <div className="text-zinc-400">✓ DB Relationships: 100% (all foreign keys resolved)</div>
                            {chapterSec < 7 ? (
                              <div className="text-amber-400">
                                ⚠ 2 env tokens missing .env.example fallback definitions (+12 pts)
                              </div>
                            ) : (
                              <div className="text-emerald-400">
                                ✓ Resolved: All env tokens documented in .env.example!
                              </div>
                            )}
                            <div className="text-cyan-300 font-bold pt-1">
                              {chapterSec < 7 ? 'Running automated audit repair...' : 'Codebase context verified! Ready for MCP.'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACTIVE APP 2: MULTI-AI TOOL ENVIRONMENT (Chapters 5 & 6) */}
              {activeChapter.app === 'ide' && (
                <div className="relative z-10 w-full max-w-2xl mx-auto rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
                  {/* Multi-Tool Switcher Header */}
                  <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />

                      {/* Tool Tabs: Cursor, Claude Desktop, VS Code */}
                      <div className="flex items-center gap-1 ml-3 font-sans">
                        <button
                          onClick={() => setActiveAiTool('cursor')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                            activeAiTool === 'cursor'
                              ? 'bg-zinc-800 text-cyan-300 border border-zinc-700'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Code2 className="w-3 h-3 text-cyan-400" />
                          <span>Cursor IDE</span>
                        </button>
                        <button
                          onClick={() => setActiveAiTool('claude')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                            activeAiTool === 'claude'
                              ? 'bg-zinc-800 text-amber-300 border border-zinc-700'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>Claude Desktop</span>
                        </button>
                        <button
                          onClick={() => setActiveAiTool('vscode')}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                            activeAiTool === 'vscode'
                              ? 'bg-zinc-800 text-blue-300 border border-zinc-700'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Boxes className="w-3 h-3 text-blue-400" />
                          <span>VS Code (Continue)</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-semibold">stdio MCP Active</span>
                    </div>
                  </div>

                  {/* Multi-Tool Interface View */}
                  <div className="grid grid-cols-12 min-h-[260px] max-h-[300px] overflow-hidden text-zinc-200">
                    {/* Left: Configuration or Explorer */}
                    <div className="col-span-12 sm:col-span-6 p-3 bg-zinc-950 font-mono text-[11px] border-r border-zinc-800 overflow-y-auto space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
                        <span className="text-zinc-300 font-semibold flex items-center gap-1">
                          <FileJson className="w-3 h-3 text-cyan-400" />
                          {activeAiTool === 'cursor'
                            ? '.cursor/mcp.json'
                            : activeAiTool === 'claude'
                            ? 'claude_desktop_config.json'
                            : '.continue/config.json'}
                        </span>
                        <span className="text-zinc-500 font-mono">MCP Configuration</span>
                      </div>

                      <pre className="text-cyan-300 leading-relaxed text-[10.5px]">
{activeAiTool === 'cursor'
  ? `{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp"]
    }
  }
}`
  : activeAiTool === 'claude'
  ? `{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp", "--project", "/repo"]
    }
  }
}`
  : `{
  "mcpServers": [
    {
      "name": "ctx",
      "command": "ctx",
      "args": ["serve", "--mcp"]
    }
  ]
}`}
                      </pre>

                      <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                        <span className="text-emerald-400 font-bold">✓ Universal Standard: </span>
                        Works with Cursor, Claude, VS Code, Cline, and Windsurf identically.
                      </div>
                    </div>

                    {/* Right: AI Chat & Inline Code Generation */}
                    <div className="col-span-12 sm:col-span-6 bg-zinc-900/90 p-3 flex flex-col justify-between text-[11px] font-sans">
                      <div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 mb-2 font-mono text-[10px]">
                          <span className="font-sans font-bold text-xs text-zinc-200 flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5 text-cyan-400" />
                            {activeAiTool === 'cursor'
                              ? 'Cursor Composer'
                              : activeAiTool === 'claude'
                              ? 'Claude Desktop Chat'
                              : 'VS Code Inline Assistant'}
                          </span>
                          <span className="text-cyan-400 bg-cyan-950 px-1 py-0.2 rounded font-mono">
                            MCP Tools
                          </span>
                        </div>

                        {activeChapter.id === 5 ? (
                          <div className="space-y-1.5 text-zinc-300 text-[10px] font-mono">
                            <div className="text-zinc-400">Registered MCP Tools:</div>
                            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                              <div className="text-cyan-400">• ctx_search(query)</div>
                              <div className="text-emerald-400">• ctx_get_schema(model_name)</div>
                              <div className="text-amber-400">• ctx_inspect_route(method, path)</div>
                            </div>
                            <div className="text-zinc-400 pt-1">
                              Ready for interactive prompts and autonomous refactoring.
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-[10px] font-mono">
                            <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 font-sans">
                              <span className="text-zinc-400 font-mono text-[10px]">Prompt: </span>
                              "{getTypedCommand('How do I add OAuth and read active session?', 2.5)}"
                            </div>
                            <div className="text-cyan-400 text-[9.5px]">
                              → AI invoked tool: ctx_search("session auth")...
                            </div>
                            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-emerald-300 text-[10px] space-y-0.5">
                              <div>import &#123; auth &#125; from "@/auth";</div>
                              <div>const membership = await prisma.membership.findFirst...</div>
                            </div>
                            <div className="text-emerald-400 font-bold text-[9.5px]">
                              ✓ 100% verified AST contracts. Zero hallucinated models.
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                        <span>Universal MCP protocol</span>
                        <span className="text-cyan-400 font-bold">100% Local</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom macOS Dock Simulation */}
              <div className="relative z-20 mx-auto mt-4 px-3 py-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl shadow-2xl flex items-center gap-3 select-none">
                {/* App 1: Terminal */}
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      activeChapter.app === 'terminal'
                        ? 'bg-zinc-800 border border-cyan-400/80 shadow-md scale-105'
                        : 'bg-zinc-800/80 hover:bg-zinc-750'
                    }`}
                  >
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                  {activeChapter.app === 'terminal' && (
                    <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1" />
                  )}
                </div>

                {/* App 2: Cursor IDE */}
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      activeChapter.app === 'ide' && activeAiTool === 'cursor'
                        ? 'bg-zinc-800 border border-cyan-400/80 shadow-md scale-105'
                        : 'bg-zinc-800/80 hover:bg-zinc-750'
                    }`}
                  >
                    <Code2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  {activeChapter.app === 'ide' && activeAiTool === 'cursor' && (
                    <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1" />
                  )}
                </div>

                {/* App 3: Claude Desktop */}
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      activeChapter.app === 'ide' && activeAiTool === 'claude'
                        ? 'bg-zinc-800 border border-amber-400/80 shadow-md scale-105'
                        : 'bg-zinc-800/80 hover:bg-zinc-750'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  {activeChapter.app === 'ide' && activeAiTool === 'claude' && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1" />
                  )}
                </div>

                {/* App 4: VS Code Continue */}
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      activeChapter.app === 'ide' && activeAiTool === 'vscode'
                        ? 'bg-zinc-800 border border-blue-400/80 shadow-md scale-105'
                        : 'bg-zinc-800/80 hover:bg-zinc-750'
                    }`}
                  >
                    <Boxes className="w-4 h-4 text-blue-400" />
                  </div>
                  {activeChapter.app === 'ide' && activeAiTool === 'vscode' && (
                    <span className="w-1 h-1 rounded-full bg-blue-400 mt-1" />
                  )}
                </div>
              </div>

              {/* Subtitles Overlay Bar */}
              {showCaptions && (
                <div className="relative z-30 mt-3 mx-auto max-w-xl text-center px-4 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-sans text-zinc-100 shadow-2xl">
                  {activeChapter.subtitle}
                </div>
              )}
            </div>

            {/* Video Player Controls Bar */}
            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex flex-col gap-2">
              {/* Scrubbable Seek Bar */}
              <div className="relative flex items-center group">
                <input
                  type="range"
                  min={0}
                  max={TOTAL_DURATION_SEC}
                  step={0.1}
                  value={currentSec}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-3">
                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  {/* Replay */}
                  <button
                    onClick={() => {
                      setCurrentSec(0);
                      setIsPlaying(true);
                      lastSpokenChapterIdRef.current = null;
                    }}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Time Counter */}
                  <div className="text-zinc-400 text-[11px] font-mono">
                    <span className="text-zinc-100 font-semibold">{formatTime(currentSec)}</span> /{' '}
                    <span>{formatTime(TOTAL_DURATION_SEC)}</span>
                  </div>

                  {/* Active Chapter Name */}
                  <span className="hidden sm:inline-block text-cyan-400 font-semibold text-[11px] truncate max-w-[180px]">
                    {activeChapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Spoken Voiceover Narration Toggle (Male Voice) */}
                  <button
                    onClick={toggleVoiceover}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                      isVoiceoverEnabled
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                    title={isVoiceoverEnabled ? 'Turn off Male Voice' : 'Turn on Male Voice'}
                  >
                    {isVoiceoverEnabled ? (
                      <>
                        <Mic className="w-3 h-3 text-cyan-400" />
                        <span className="hidden sm:inline">Male Voice: ON</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3 h-3 text-zinc-400" />
                        <span className="hidden sm:inline">Voice: OFF</span>
                      </>
                    )}
                  </button>

                  {/* Playback speed toggle */}
                  <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-[11px]">
                    {[1, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          playbackSpeed === spd
                            ? 'bg-zinc-800 text-cyan-400 font-bold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Subtitles Toggle */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      showCaptions
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    title="Toggle Subtitles"
                  >
                    <Subtitles className="w-3.5 h-3.5" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters & Steps Sidebar (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                  Video Chapters
                </span>
                <span className="text-cyan-400 text-[11px]">Total 1m 20s</span>
              </div>

              {/* Chapters list */}
              <div className="space-y-2">
                {CHAPTERS.map((ch) => {
                  const isActive = activeChapter.id === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleJumpToChapter(ch)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                        isActive
                          ? 'bg-zinc-800/90 border-cyan-500/50 text-white shadow-md'
                          : 'bg-zinc-950/60 border-zinc-800/70 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-cyan-400 font-semibold">
                          0{ch.id}. {ch.tag}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          {ch.timeRange}
                        </span>
                      </div>
                      <div className="font-medium text-zinc-100 text-xs mb-1">
                        {ch.title}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Command Box for current active chapter */}
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                <span>Active step command:</span>
                <button
                  onClick={() => handleCopy(activeChapter.command, `cmd-${activeChapter.id}`)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                >
                  {copiedCmd === `cmd-${activeChapter.id}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 truncate select-all">
                $ {activeChapter.command}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
