import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Laptop, ShieldCheck, Download } from 'lucide-react';

export const InstallSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'unix' | 'windows' | 'source' | 'docker'>('unix');
  const [detectedOS, setDetectedOS] = useState<string>('Linux / macOS');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto OS detection on client
  useEffect(() => {
    try {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('win')) {
        setDetectedOS('Windows (x86_64 / arm64)');
        setSelectedTab('windows');
      } else if (userAgent.includes('mac')) {
        setDetectedOS('macOS (Apple Silicon / Intel)');
        setSelectedTab('unix');
      } else if (userAgent.includes('linux')) {
        setDetectedOS('Linux (x86_64 / aarch64)');
        setSelectedTab('unix');
      }
    } catch (e) {
      // Default to unix
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const installMethods = {
    unix: {
      title: 'Linux & macOS',
      primaryLabel: 'Install via shell script (Recommended)',
      primaryCmd: 'curl -fsSL https://getctx.dev | sh',
      alts: [
        { label: 'macOS Homebrew', cmd: 'brew install ctx-org/tap/ctx' },
        { label: 'Arch Linux (AUR)', cmd: 'yay -S ctx-bin' },
        { label: 'Debian / Ubuntu (.deb)', cmd: 'curl -LO https://github.com/ctx-org/ctx/releases/latest/download/ctx_linux_amd64.deb && sudo dpkg -i ctx_linux_amd64.deb' }
      ]
    },
    windows: {
      title: 'Windows',
      primaryLabel: 'Install via Scoop',
      primaryCmd: 'scoop bucket add ctx https://github.com/ctx-org/scoop-bucket && scoop install ctx',
      alts: [
        { label: 'Windows Package Manager (Winget)', cmd: 'winget install CTX.CTX' },
        { label: 'PowerShell Install Script', cmd: 'irm https://getctx.dev/install.ps1 | iex' }
      ]
    },
    source: {
      title: 'From Source (Go)',
      primaryLabel: 'Install via Go Toolchain (Go 1.22+ required)',
      primaryCmd: 'go install github.com/ctx-org/ctx/cmd/ctx@latest',
      alts: [
        { label: 'Build from cloned git repository', cmd: 'git clone https://github.com/ctx-org/ctx && cd ctx && make build' }
      ]
    },
    docker: {
      title: 'Docker Container',
      primaryLabel: 'Run CTX in ephemeral Docker container',
      primaryCmd: 'docker run --rm -v $(pwd):/workspace -w /workspace ghcr.io/ctx-org/ctx:latest extract',
      alts: [
        { label: 'Pull latest image', cmd: 'docker pull ghcr.io/ctx-org/ctx:latest' }
      ]
    }
  };

  const activeMethod = installMethods[selectedTab];

  return (
    <section id="get-started" className="py-20 border-b border-zinc-800/80 bg-zinc-950 scroll-mt-14 relative">
      <span id="install" className="absolute -top-14" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono text-cyan-400 mb-2">INSTALLATION</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Install CTX on your development machine
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Statically compiled binary with zero runtime dependencies. Binary size is under 18 MB.
          </p>
        </div>

        {/* OS Detection Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Detected environment:</span>
            <span className="text-white font-semibold">{detectedOS}</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            SHA-256 Verified
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto text-xs font-mono">
          {(Object.keys(installMethods) as Array<keyof typeof installMethods>).map((key) => {
            const isSelected = selectedTab === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-zinc-800 text-cyan-400 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {installMethods[key].title}
              </button>
            );
          })}
        </div>

        {/* Main Command Box */}
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl mb-6">
          <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400">
              {activeMethod.primaryLabel}
            </span>
            <button
              onClick={() => handleCopy(activeMethod.primaryCmd, 'primary')}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700/60 transition-colors"
            >
              {copiedKey === 'primary' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied install command</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy install command</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-zinc-950/80 font-mono text-xs sm:text-[13px] text-cyan-300 flex items-center gap-3">
            <span className="text-zinc-500">$</span>
            <code className="text-white select-all">{activeMethod.primaryCmd}</code>
          </div>
        </div>

        {/* Alternative Package Managers */}
        {activeMethod.alts.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Alternative package managers:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeMethod.alts.map((alt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-zinc-400 text-[11px] mb-1">{alt.label}</div>
                    <code className="text-zinc-200 block truncate">{alt.cmd}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(alt.cmd, `alt-${i}`)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex-shrink-0 transition-colors"
                    title="Copy command"
                  >
                    {copiedKey === `alt-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
