import React, { useState } from 'react';
import { Server, Users, GitPullRequest, ArrowUpRight, Copy, Check, Terminal } from 'lucide-react';

export const TeamServer: React.FC = () => {
  const [copiedDocker, setCopiedDocker] = useState(false);

  const dockerCommand = `docker run -d \\
  -p 8080:8080 \\
  -e CTX_AUTH_TOKEN="sec_team_991823" \\
  -v /var/data/ctx:/data \\
  ghcr.io/ctx-org/ctx-server:latest`;

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <section id="team" className="py-20 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono text-cyan-400 mb-2">SELF-HOSTED COLLABORATION</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Self-hosted team server: <code className="text-cyan-400 font-mono">ctx team</code>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            In large teams and monorepos, parsing hundreds of thousands of lines on every laptop is wasteful.
            The CTX Team Server lets CI extract the graph once on merge, and shares it instantly with your entire team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Team workflow features */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  50ms developer onboarding
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  New engineers run <code className="text-cyan-400 font-mono">ctx team pull</code> after cloning to immediately obtain full MCP context for all microservices without installing local dependencies.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Pull Request context diffing
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  The team server automatically verifies whether a PR breaks route contracts or introduces orphan database migrations, leaving a succinct summary comment on GitHub or GitLab.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  100% self-hosted Go binary
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Run on your own AWS ECS, Kubernetes, or Fly.io cluster. The team server stores encrypted context snapshots on S3 or local volume with zero vendor lock-in.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Deployment Docker snippet */}
          <div className="lg:col-span-6 flex flex-col rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>deploy-team-server.sh</span>
              </div>
              <button
                onClick={handleCopyDocker}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700/60 transition-colors"
              >
                {copiedDocker ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy deploy command</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 font-mono text-xs leading-relaxed text-zinc-300 bg-zinc-950 overflow-x-auto whitespace-pre">
              <code>{dockerCommand}</code>
            </pre>

            <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/80 font-mono text-xs space-y-2">
              <div className="text-zinc-400"># Typical CI/CD Pipeline workflow:</div>
              <div className="text-zinc-300">$ ctx extract</div>
              <div className="text-zinc-300">$ ctx team push --branch main</div>
              <div className="text-emerald-400">✓ Uploaded context graph (380KB) to team server in 42ms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
