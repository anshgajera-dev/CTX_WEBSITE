import React, { useState } from 'react';
import { Search, Copy, Check, BookOpen, ArrowLeft, Terminal, Shield, Cpu, Users, ChevronRight } from 'lucide-react';
import { DOCS_ARTICLES } from '../data/docsContent';
import { DocArticle } from '../types';

interface DocsViewProps {
  onBackToLanding: () => void;
}

export const DocsView: React.FC<DocsViewProps> = ({ onBackToLanding }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(DOCS_ARTICLES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const categories = Array.from(new Set(DOCS_ARTICLES.map((a) => a.category)));

  const filteredArticles = DOCS_ARTICLES.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
    );
  });

  const activeArticle =
    DOCS_ARTICLES.find((a) => a.id === selectedArticleId) || filteredArticles[0] || DOCS_ARTICLES[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Docs Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Site</span>
          </button>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-600 flex items-center justify-center font-mono font-black text-xs text-white">
              C
            </div>
            <span className="font-bold text-sm text-white">CTX Docs</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              v0.9.4
            </span>
          </div>
        </div>

        {/* Search input in header */}
        <div className="relative w-48 sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search docs (e.g. mcp, init)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder:text-zinc-500 outline-hidden focus:border-cyan-500"
          />
        </div>
      </header>

      {/* Main Documentation Layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 border-r border-zinc-800/80 p-4 space-y-6 flex-shrink-0 bg-zinc-950/40">
          {searchQuery && (
            <div className="text-xs font-mono text-zinc-500 px-2">
              Found {filteredArticles.length} result(s)
            </div>
          )}

          {categories.map((cat) => {
            const articlesInCat = filteredArticles.filter((a) => a.category === cat);
            if (articlesInCat.length === 0) return null;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2">
                  {cat}
                </div>
                <div className="space-y-1">
                  {articlesInCat.map((art) => {
                    const isSelected = activeArticle.id === art.id;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setSelectedArticleId(art.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-zinc-800 text-cyan-400 font-semibold border border-zinc-700/60'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                      >
                        <span className="truncate">{art.title}</span>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Right Article Reader */}
        <main className="flex-1 p-6 sm:p-10 max-w-4xl">
          {activeArticle ? (
            <article className="prose prose-invert max-w-none">
              {/* Category & Title */}
              <div className="mb-8 pb-6 border-b border-zinc-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">
                  {activeArticle.category}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  {activeArticle.title}
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Render Article Content with customized markdown look */}
              <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
                {activeArticle.content.split('\n\n').map((paragraph, pIdx) => {
                  // Check if it's a code block
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const language = lines[0].replace('```', '') || 'bash';
                    const code = lines.slice(1, -1).join('\n');
                    const codeId = `code-${pIdx}`;

                    return (
                      <div
                        key={pIdx}
                        className="rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden my-4 not-prose"
                      >
                        <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                          <span>{language}</span>
                          <button
                            onClick={() => handleCopyCode(code, codeId)}
                            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            {copiedCodeId === codeId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  }

                  // Heading level 3
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-lg font-semibold text-white pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }

                  // Heading level 4
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={pIdx} className="text-base font-semibold text-zinc-200 pt-1">
                        {paragraph.replace('#### ', '')}
                      </h4>
                    );
                  }

                  // List items
                  if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                    return (
                      <div key={pIdx} className="space-y-1.5 pl-2 font-sans">
                        {paragraph.split('\n').map((li, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-2 text-zinc-300">
                            <span className="text-cyan-400 font-mono mt-1">•</span>
                            <span>{li.replace(/^-\s+|^\d+\.\s+/, '')}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p key={pIdx} className="text-zinc-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </article>
          ) : (
            <div className="py-20 text-center text-zinc-500 font-mono">
              No matching documentation articles found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
