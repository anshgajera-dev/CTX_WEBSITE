import React, { useState } from 'react';
import { Copy, Check, FileJson, Cpu, ExternalLink } from 'lucide-react';

export const McpIntegration: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<'cursor' | 'claude' | 'vscode' | 'cline'>('cursor');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const configs = {
    cursor: {
      client: 'Cursor',
      file: '.cursor/mcp.json',
      config: `{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp"]
    }
  }
}`,
      notes: 'Add to the root of your workspace or global Cursor MCP settings in Settings > MCP.'
    },
    claude: {
      client: 'Claude Desktop',
      file: 'claude_desktop_config.json',
      config: `{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp", "--project", "/absolute/path/to/your/repo"]
    }
  }
}`,
      notes: 'Located at ~/Library/Application Support/Claude/claude_desktop_config.json on macOS, or %APPDATA%\\Claude\\claude_desktop_config.json on Windows.'
    },
    vscode: {
      client: 'VS Code (Continue / Roo)',
      file: '.continue/config.json',
      config: `{
  "models": [...],
  "mcpServers": [
    {
      "name": "ctx",
      "command": "ctx",
      "args": ["serve", "--mcp"]
    }
  ]
}`,
      notes: 'Supported natively by Continue extension and Roo Code for inline codebase querying.'
    },
    cline: {
      client: 'Cline / Roo Code',
      file: 'cline_mcp_settings.json',
      config: `{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp"],
      "disabled": false,
      "autoApprove": [
        "ctx_search",
        "ctx_get_schema",
        "ctx_inspect_route"
      ]
    }
  }
}`,
      notes: 'Auto-approves harmless read-only context inspections so autonomous agents work without interruption.'
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeConfig = configs[selectedClient];

  return (
    <section id="mcp" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono text-cyan-400 mb-2">MODEL CONTEXT PROTOCOL</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Works with any MCP-compatible AI client
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            CTX adheres strictly to the Model Context Protocol 1.0 standard.
            One single entry in your MCP configuration connects your favorite editor in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Client Tabs & JSON Config */}
          <div className="lg:col-span-7 flex flex-col rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl">
            {/* Client Tabs */}
            <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 overflow-x-auto text-xs font-mono">
              {(Object.keys(configs) as Array<keyof typeof configs>).map((key) => {
                const isSelected = selectedClient === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedClient(key)}
                    className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-zinc-800 text-cyan-400 border border-zinc-700 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    {configs[key].client}
                  </button>
                );
              })}
            </div>

            {/* Config Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2 font-mono text-zinc-400">
                <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeConfig.file}</span>
              </div>
              <button
                onClick={() => handleCopy(activeConfig.config, 'mcp-config')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700/60 transition-colors"
              >
                {copiedId === 'mcp-config' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied config</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Config Code */}
            <pre className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-200 bg-zinc-950 overflow-x-auto whitespace-pre">
              <code>{activeConfig.config}</code>
            </pre>

            {/* Usage notes */}
            <div className="p-3 bg-zinc-900/60 border-t border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">File location: </strong>
              {activeConfig.notes}
            </div>
          </div>

          {/* Right Column: MCP Tools Provided by CTX */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>MCP Tools Provided to your LLM</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                When your model needs context, it autonomously executes these high-precision read-only tools:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="text-cyan-400 font-bold mb-0.5">ctx_search(query)</div>
                  <div className="text-zinc-400 text-[11px] font-sans">
                    Hybrid TF-IDF + MiniLM vector search across routes, schemas, and helpers.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="text-emerald-400 font-bold mb-0.5">ctx_get_schema(model_name)</div>
                  <div className="text-zinc-400 text-[11px] font-sans">
                    Returns exact column types, primary keys, nullability, and relations.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="text-amber-400 font-bold mb-0.5">ctx_inspect_route(method, path)</div>
                  <div className="text-zinc-400 text-[11px] font-sans">
                    Fetches handler signature, request validation schema, and middleware.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="text-purple-400 font-bold mb-0.5">ctx_get_env_vars()</div>
                  <div className="text-zinc-400 text-[11px] font-sans">
                    Returns required env keys & defaults. Secrets are completely redacted.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
