import React, { useState } from 'react';
import { Check, X, Search, Filter } from 'lucide-react';
import { STACK_MATRIX } from '../data/stackMatrix';

export const StackMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Language', 'Framework', 'ORM / DB', 'Config'];

  const filteredItems = STACK_MATRIX.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="stack" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-2">COMPATIBILITY MATRIX</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Supported languages, frameworks & ORMs
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              CTX utilizes dedicated native AST parsers for each ecosystem to produce high-fidelity context graphs without compiling your code.
            </p>
          </div>

          {/* Category Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-zinc-800 text-cyan-400 border border-zinc-700 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder:text-zinc-500 outline-hidden focus:border-cyan-500 w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[11px]">
                <tr>
                  <th className="py-3 px-4">ECOSYSTEM / TOOL</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">AST LEVEL</th>
                  <th className="py-3 px-4">ROUTES</th>
                  <th className="py-3 px-4">SCHEMAS</th>
                  <th className="py-3 px-4">KEY FEATURES</th>
                  <th className="py-3 px-4">VERSION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/40">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.supportLevel === 'Full AST'
                            ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50'
                            : item.supportLevel === 'Supported'
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                        }`}
                      >
                        {item.supportLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.routeDetection ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.schemaExtraction ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      <div className="flex gap-1 flex-wrap">
                        {item.features.map((f, fi) => (
                          <span
                            key={fi}
                            className="bg-zinc-900/80 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 border border-zinc-800/80"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-sans text-[11px]">
                      {item.version}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
          <span>Showing {filteredItems.length} supported frameworks and runtimes</span>
          <span>Missing your framework? Open a parser request on GitHub</span>
        </div>
      </div>
    </section>
  );
};
