import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Shield,
  Trash2,
  Terminal,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export type ChatRole = 'architect' | 'mcp_specialist' | 'health_auditor' | 'fast_assistant';

export interface RoleInfo {
  id: ChatRole;
  name: string;
  badge: string;
  description: string;
  recommendedModel: string;
}

export const CHAT_ROLES: RoleInfo[] = [
  {
    id: 'architect',
    name: 'Context Architect',
    badge: 'Architecture & AST',
    description: 'Expert on codebase topology, AST extraction, and route/schema graphs.',
    recommendedModel: 'gemini-3.5-flash',
  },
  {
    id: 'mcp_specialist',
    name: 'MCP Specialist',
    badge: 'Cursor & Claude',
    description: 'Specialist in Model Context Protocol config, tools, and stdio JSON-RPC.',
    recommendedModel: 'gemini-3.5-flash',
  },
  {
    id: 'health_auditor',
    name: 'Health Auditor',
    badge: '0-100 Score',
    description: 'Audits missing type contracts, orphan migrations, and undocumented envs.',
    recommendedModel: 'gemini-3.1-pro-preview',
  },
  {
    id: 'fast_assistant',
    name: 'Fast Reference',
    badge: 'Fast Lookup',
    description: 'Ultra-low latency answers for CLI flags and immediate syntax snippets.',
    recommendedModel: 'gemini-3.1-flash-lite',
  },
];

export const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: 'gemini-3.5-flash',
    tag: 'General Tasks (Default)',
    desc: 'High speed, high accuracy reasoning for most development questions.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'gemini-3.1-flash-lite',
    tag: 'Fast Tasks',
    desc: 'Lowest latency, ideal for quick command flags and rapid lookups.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'gemini-3.1-pro-preview',
    tag: 'Complex Tasks',
    desc: 'Deep multi-step reasoning for intricate system architectures and AST trees.',
  },
];

const INITIAL_PROMPTS = [
  'How do I configure Cursor to read CTX MCP tools?',
  'How does CTX extract Prisma & Drizzle schemas without compiling code?',
  'What should I fix to boost my context health score from 84 to 100?',
  'Explain how hybrid TF-IDF + MiniLM search works in CTX.',
];

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I am your **CTX Codebase AI Assistant**, powered by Gemini.

I can help you map your codebase, configure MCP clients (Cursor, Claude Desktop, VS Code), audit your context health score, or debug schema extraction.

Select a specialized role or ask me any question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<ChatRole>('architect');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom of conversation thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleRoleChange = (role: ChatRole) => {
    setSelectedRole(role);
    const roleInfo = CHAT_ROLES.find((r) => r.id === role);
    if (roleInfo) {
      // Suggest the recommended model for the selected role
      setSelectedModel(roleInfo.recommendedModel);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Format messages history for multi-turn chat endpoint
      const payloadMessages = newHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // In case history only has the new message
      if (payloadMessages.length === 0) {
        payloadMessages.push({ role: 'user', content: text });
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      const assistantMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err.message || 'Unable to communicate with Gemini API. Check your network or API key.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: `Conversation reset. Select a role and ask me anything about CTX, MCP, or codebase context extraction.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
    setErrorMessage(null);
  };

  const activeRoleObj = CHAT_ROLES.find((r) => r.id === selectedRole) || CHAT_ROLES[0];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all transform hover:scale-105 border border-cyan-400/40"
          aria-label="Open CTX AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="tracking-wide">Ask CTX AI</span>
        </button>
      )}

      {/* Main Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full bg-zinc-950 border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
              isExpanded
                ? 'h-full sm:h-[92vh] sm:max-w-4xl'
                : 'h-[92vh] sm:h-[680px] sm:max-w-xl'
            }`}
          >
            {/* Window Top Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">CTX AI Assistant</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    Role: <span className="text-zinc-200">{activeRoleObj.name}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 text-zinc-400">
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role & Model Selector Sub-Bar */}
            <div className="p-2.5 bg-zinc-900/60 border-b border-zinc-800/80 flex flex-col gap-2">
              {/* Role Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
                <span className="text-zinc-400 pl-1 whitespace-nowrap">Role:</span>
                {CHAT_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleChange(role.id)}
                      className={`px-2 py-1 rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-zinc-800 text-cyan-400 border border-cyan-500/40 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span>{role.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Model Selector */}
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono px-1">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-200 outline-hidden focus:border-cyan-500"
                  >
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} ({m.tag})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-zinc-400 text-[10px] hidden sm:inline">
                  Multi-turn memory enabled
                </span>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-[13px] bg-zinc-950/70 select-text">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                        isUser
                          ? 'bg-cyan-600 text-white font-normal shadow-md'
                          : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 shadow-sm'
                      }`}
                    >
                      {/* Message Header info for model response */}
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-800/80 text-[10px] font-mono text-zinc-400">
                          <span className="text-cyan-400 font-semibold flex items-center gap-1">
                            <span>CTX Assistant</span>
                            {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>{msg.timestamp}</span>
                            <button
                              onClick={() => handleCopy(msg.content, msg.id)}
                              className="hover:text-white transition-colors"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message Content with basic Markdown & code snippet styling */}
                      <div className="space-y-2 whitespace-pre-wrap">
                        {msg.content.split('\n\n').map((paragraph, pIdx) => {
                          // Code block detection
                          if (paragraph.startsWith('```')) {
                            const lines = paragraph.split('\n');
                            const lang = lines[0].replace('```', '') || 'code';
                            const code = lines.slice(1, -1).join('\n');
                            const codeBlockId = `block-${msg.id}-${pIdx}`;

                            return (
                              <div
                                key={pIdx}
                                className="rounded-lg bg-zinc-950 border border-zinc-800 my-2 overflow-hidden font-mono text-xs"
                              >
                                <div className="px-3 py-1 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                                  <span>{lang}</span>
                                  <button
                                    onClick={() => handleCopy(code, codeBlockId)}
                                    className="hover:text-white transition-colors"
                                  >
                                    {copiedId === codeBlockId ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                <pre className="p-3 overflow-x-auto text-zinc-300">
                                  <code>{code}</code>
                                </pre>
                              </div>
                            );
                          }

                          return <p key={pIdx}>{paragraph}</p>;
                        })}
                      </div>

                      {/* Timestamp for user message */}
                      {isUser && (
                        <div className="mt-1 text-right text-[10px] text-cyan-200/80 font-mono">
                          {msg.timestamp}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-zinc-400 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{selectedModel} is thinking...</span>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-0.5">Gemini API Error</p>
                    <p className="text-zinc-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips (when few messages) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/60 overflow-x-auto flex items-center gap-1.5 text-xs">
                <span className="text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                  Suggestions:
                </span>
                {INITIAL_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 font-mono text-[11px] whitespace-nowrap border border-zinc-800 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${activeRoleObj.name} anything about your codebase...`}
                  rows={2}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-[13px] text-zinc-100 placeholder:text-zinc-400 font-sans outline-hidden focus:border-cyan-500 resize-none leading-relaxed"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-xl transition-colors flex items-center justify-center ${
                    input.trim() && !isLoading
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
                <span>Press Enter to send, Shift+Enter for newline</span>
                <span>Powered by @google/genai</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
