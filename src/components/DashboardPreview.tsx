import React, { useState } from 'react';
import { LayoutGrid, Network, GitCommit, Search, ExternalLink, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routes' | 'er' | 'diff'>('routes');
  const [searchFilter, setSearchFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Sample route items
  const routes = [
    { method: 'POST', path: '/api/v2/auth/login', handler: 'handlers.AuthLogin', middleware: ['RateLimit(10/m)', 'JsonBody'], response: '200 AuthTokenResponse' },
    { method: 'GET', path: '/api/v2/workspaces', handler: 'handlers.ListWorkspaces', middleware: ['AuthRequired', 'TenantScope'], response: '200 WorkspaceList' },
    { method: 'POST', path: '/api/v2/workspaces/:id/members', handler: 'handlers.AddMember', middleware: ['AuthRequired', 'RequireRole(ADMIN)'], response: '201 MemberRecord' },
    { method: 'GET', path: '/api/v2/billing/invoices', handler: 'handlers.GetInvoices', middleware: ['AuthRequired', 'StripeSync'], response: '200 InvoicePage' },
    { method: 'DELETE', path: '/api/v2/sessions/:sessionId', handler: 'handlers.RevokeSession', middleware: ['AuthRequired'], response: '204 NoContent' },
    { method: 'POST', path: '/api/webhooks/stripe', handler: 'handlers.StripeWebhook', middleware: ['StripeSigVerify'], response: '200 WebhookStatus' },
  ];

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch = r.path.toLowerCase().includes(searchFilter.toLowerCase()) || r.handler.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || r.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <section id="dashboard" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-2">LOCAL WEB DASHBOARD</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Visual context map at <code className="text-cyan-400 font-mono text-xl sm:text-2xl">ctx ui</code>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Inspect your codebase topology locally in your browser. Inspect API contracts,
              interactive database schemas, and context history without leaving your terminal.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <span>Runs at</span>
            <span className="text-cyan-400 font-semibold">http://localhost:4242</span>
          </div>
        </div>

        {/* Dashboard Mock Window */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-2xl">
          {/* Top Mock Browser Address Bar */}
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="ml-2 font-mono text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                CTX UI – Local Dev Map
              </span>
            </div>

            {/* Simulated Address Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 max-w-xs flex-1 justify-center">
              <span>http://localhost:4242</span>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              commit: <span className="text-cyan-400">7f4a9b2</span>
            </div>
          </div>

          {/* Sub Navigation Bar inside Dashboard */}
          <div className="p-3 bg-zinc-950/80 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('routes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-colors ${
                  activeTab === 'routes'
                    ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>API Endpoints ({routes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('er')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-colors ${
                  activeTab === 'er'
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Schema ER Diagram</span>
              </button>
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-colors ${
                  activeTab === 'diff'
                    ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Context Diff History</span>
              </button>
            </div>

            {/* Quick search input */}
            {activeTab === 'routes' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Filter endpoints..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder:text-zinc-400 outline-hidden focus:border-cyan-500 w-44"
                  />
                </div>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 px-2 py-1 outline-hidden"
                >
                  <option value="ALL">ALL</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: ROUTES TABLE */}
          {activeTab === 'routes' && (
            <div className="overflow-x-auto min-h-[340px]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">METHOD</th>
                    <th className="py-2.5 px-4">ENDPOINT PATH</th>
                    <th className="py-2.5 px-4">AST HANDLER</th>
                    <th className="py-2.5 px-4">MIDDLEWARE CHAIN</th>
                    <th className="py-2.5 px-4">RESPONSE TYPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/60">
                  {filteredRoutes.map((r, i) => (
                    <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            r.method === 'GET'
                              ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                              : r.method === 'POST'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950/60 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {r.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-zinc-200 font-medium">
                        {r.path}
                      </td>
                      <td className="py-2.5 px-4 text-cyan-400">
                        {r.handler}
                      </td>
                      <td className="py-2.5 px-4 text-zinc-400">
                        <div className="flex gap-1 flex-wrap">
                          {r.middleware.map((m, mi) => (
                            <span key={mi} className="bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] border border-zinc-800 text-zinc-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-zinc-400">
                        {r.response}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: MERMAID-STYLE SVG ER DIAGRAM */}
          {activeTab === 'er' && (
            <div className="p-6 bg-zinc-950 min-h-[340px] flex flex-col items-center justify-center overflow-x-auto">
              <div className="w-full max-w-3xl">
                <svg viewBox="0 0 740 260" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                    </marker>
                  </defs>

                  {/* Table 1: User */}
                  <g transform="translate(20, 20)">
                    <rect width="180" height="180" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                    <rect width="180" height="28" rx="6" fill="#27272a" />
                    <text x="10" y="19" fill="#fafafa" fontFamily="monospace" fontSize="12" fontWeight="bold">User (Prisma)</text>
                    <text x="10" y="48" fill="#10b981" fontFamily="monospace" fontSize="11">PK  id: String (cuid)</text>
                    <text x="10" y="70" fill="#e4e4e7" fontFamily="monospace" fontSize="11">    email: String (unique)</text>
                    <text x="10" y="92" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    name: String?</text>
                    <text x="10" y="114" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    role: UserRole</text>
                    <text x="10" y="136" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    createdAt: DateTime</text>
                    <text x="10" y="158" fill="#06b6d4" fontFamily="monospace" fontSize="11">FK  accounts: Account[]</text>
                  </g>

                  {/* Relation line 1: User -> Membership */}
                  <path d="M 200 90 L 280 90" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow)" />

                  {/* Table 2: Membership */}
                  <g transform="translate(280, 20)">
                    <rect width="180" height="180" rx="6" fill="#18181b" stroke="#06b6d4" strokeWidth="1.5" />
                    <rect width="180" height="28" rx="6" fill="#083344" />
                    <text x="10" y="19" fill="#67e8f9" fontFamily="monospace" fontSize="12" fontWeight="bold">Membership (Join)</text>
                    <text x="10" y="48" fill="#10b981" fontFamily="monospace" fontSize="11">PK  id: String</text>
                    <text x="10" y="70" fill="#06b6d4" fontFamily="monospace" fontSize="11">FK  userId -&gt; User.id</text>
                    <text x="10" y="92" fill="#06b6d4" fontFamily="monospace" fontSize="11">FK  workspaceId -&gt; Ws.id</text>
                    <text x="10" y="114" fill="#e4e4e7" fontFamily="monospace" fontSize="11">    role: MemberRole</text>
                    <text x="10" y="136" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    joinedAt: DateTime</text>
                    <text x="10" y="158" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    invitedBy: String?</text>
                  </g>

                  {/* Relation line 2: Membership -> Workspace */}
                  <path d="M 460 90 L 540 90" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow)" />

                  {/* Table 3: Workspace */}
                  <g transform="translate(540, 20)">
                    <rect width="180" height="180" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                    <rect width="180" height="28" rx="6" fill="#27272a" />
                    <text x="10" y="19" fill="#fafafa" fontFamily="monospace" fontSize="12" fontWeight="bold">Workspace</text>
                    <text x="10" y="48" fill="#10b981" fontFamily="monospace" fontSize="11">PK  id: String (uuid)</text>
                    <text x="10" y="70" fill="#e4e4e7" fontFamily="monospace" fontSize="11">    slug: String (unique)</text>
                    <text x="10" y="92" fill="#e4e4e7" fontFamily="monospace" fontSize="11">    name: String</text>
                    <text x="10" y="114" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    billing_tier: Tier</text>
                    <text x="10" y="136" fill="#a1a1aa" fontFamily="monospace" fontSize="11">    stripeCustomerId: String</text>
                    <text x="10" y="158" fill="#06b6d4" fontFamily="monospace" fontSize="11">FK  members: Membership[]</text>
                  </g>
                </svg>
              </div>
              <div className="text-zinc-500 font-mono text-xs mt-3 flex items-center gap-2">
                <span>Diagram extracted automatically from <code className="text-zinc-400">schema.prisma</code></span>
              </div>
            </div>
          )}

          {/* TAB 3: CONTEXT DIFF TIMELINE */}
          {activeTab === 'diff' && (
            <div className="p-4 bg-zinc-950 min-h-[340px] font-mono text-xs">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-300 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">commit 92b0c1e</span>
                      <span className="text-zinc-400">• feat: add webhook endpoints for stripe billing</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">32 mins ago</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-emerald-400">+ Route added: POST /api/webhooks/stripe (StripeWebhookHandler)</div>
                    <div className="text-emerald-400">+ Schema field: Workspace.stripeCustomerId (String?)</div>
                    <div className="text-amber-400">~ Env requirement: STRIPE_WEBHOOK_SECRET (marked required)</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-300 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">commit f4811a4</span>
                      <span className="text-zinc-400">• refactor: migrate sessions to Redis cache</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">4 hours ago</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-red-400">- Table dropped: db.sessions (replaced by Redis TTL token key)</div>
                    <div className="text-amber-400">~ Middleware updated: AuthRequired() now queries redis cluster</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer bar */}
          <div className="px-4 py-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Synchronized with local SQLite: .ctx/index.db</span>
            <span className="text-cyan-400 flex items-center gap-1">
              Live watch enabled (0ms lag)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
