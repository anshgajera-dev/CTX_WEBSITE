import React, { useEffect, useRef, useState } from 'react';
import { GraphNode } from '../types';

interface ContextGraphProps {
  nodes: GraphNode[];
  activeStep?: number;
  highlightedNodeId?: string | null;
  onNodeSelect?: (node: GraphNode) => void;
  interactive?: boolean;
}

export const ContextGraph: React.FC<ContextGraphProps> = ({
  nodes,
  activeStep = 4,
  highlightedNodeId,
  onNodeSelect,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const animFrameRef = useRef<number | null>(null);

  // Filter visible nodes based on active demo step
  // Step 0: init (2 nodes)
  // Step 1: extract (all nodes appearing)
  // Step 2: health (all)
  // Step 3: search (auth nodes highlighted)
  const visibleCount = activeStep === 0 ? 3 : activeStep === 1 ? Math.min(nodes.length, 6) : nodes.length;
  const currentNodes = nodes.slice(0, visibleCount).filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = !document.hidden;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let animationTime = 0;

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      animationTime += 0.015;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw subtle grid dots
      ctx.fillStyle = 'rgba(113, 113, 122, 0.15)';
      const gridSize = 28;
      for (let x = 14; x < rect.width; x += gridSize) {
        for (let y = 14; y < rect.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pre-calculate positions
      const positions: Record<string, { x: number; y: number }> = {};
      currentNodes.forEach((node, index) => {
        // Add subtle organic floating motion
        const floatOffset = Math.sin(animationTime + index * 0.8) * 3;
        const px = (node.x / 100) * rect.width;
        const py = (node.y / 100) * rect.height + floatOffset;
        positions[node.id] = { x: px, y: py };
      });

      // Draw connection lines
      ctx.lineWidth = 1.2;
      currentNodes.forEach((node) => {
        const fromPos = positions[node.id];
        if (!fromPos) return;

        node.connections.forEach((targetId) => {
          const toPos = positions[targetId];
          if (!toPos) return;

          const isHighlighted =
            highlightedNodeId === node.id ||
            highlightedNodeId === targetId ||
            (hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === targetId));

          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);

          // Subtle curved line
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2 - 8;
          ctx.quadraticCurveTo(midX, midY, toPos.x, toPos.y);

          if (isHighlighted) {
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = 'rgba(113, 113, 122, 0.28)';
            ctx.lineWidth = 1.2;
          }
          ctx.stroke();

          // Draw small flow pulse particle
          if (isHighlighted) {
            const t = (animationTime * 0.8) % 1;
            const px = (1 - t) * (1 - t) * fromPos.x + 2 * (1 - t) * t * midX + t * t * toPos.x;
            const py = (1 - t) * (1 - t) * fromPos.y + 2 * (1 - t) * t * midY + t * t * toPos.y;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#06b6d4';
            ctx.fill();
          }
        });
      });

      // Draw Nodes
      currentNodes.forEach((node) => {
        const pos = positions[node.id];
        if (!pos) return;

        const isHovered = hoveredNode?.id === node.id;
        const isHighlighted = highlightedNodeId === node.id || isHovered;

        // Color coding based on node type
        let strokeColor = '#06b6d4'; // Route: cyan
        let fillColor = 'rgba(6, 182, 212, 0.12)';
        let typeBadge = 'ROUTE';

        if (node.type === 'schema') {
          strokeColor = '#10b981'; // Schema: emerald
          fillColor = 'rgba(16, 185, 129, 0.12)';
          typeBadge = 'SCHEMA';
        } else if (node.type === 'env') {
          strokeColor = '#f59e0b'; // Env: amber
          fillColor = 'rgba(245, 158, 11, 0.12)';
          typeBadge = 'ENV';
        } else if (node.type === 'middleware') {
          strokeColor = '#8b5cf6'; // Middleware: purple
          fillColor = 'rgba(139, 92, 246, 0.12)';
          typeBadge = 'MW';
        }

        // Outer glow when active
        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = fillColor.replace('0.12', '0.35');
          ctx.fill();
        }

        // Main node pill / circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHighlighted ? 14 : 11, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? '#18181b' : '#09090b';
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isHighlighted ? 2.5 : 1.8;
        ctx.stroke();

        // Node center indicator
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();

        // Label box below or next to node
        ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        const textMetrics = ctx.measureText(node.label);
        const padding = 4;
        const labelY = pos.y + (isHighlighted ? 18 : 14);

        // Label background badge
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(
          pos.x - textMetrics.width / 2 - padding,
          labelY - 2,
          textMetrics.width + padding * 2,
          16
        );
        ctx.strokeStyle = isHighlighted ? strokeColor : 'rgba(82, 82, 91, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          pos.x - textMetrics.width / 2 - padding,
          labelY - 2,
          textMetrics.width + padding * 2,
          16
        );

        ctx.fillStyle = isHighlighted ? '#fafafa' : '#d4d4d8';
        ctx.fillText(node.label, pos.x, labelY);
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentNodes, highlightedNodeId, hoveredNode]);

  // Handle mouse move for hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !interactive) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: GraphNode | null = null;
    currentNodes.forEach((node) => {
      const px = (node.x / 100) * rect.width;
      const py = (node.y / 100) * rect.height;
      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist < 26) {
        found = node;
      }
    });
    setHoveredNode(found);
  };

  const handleClick = () => {
    if (hoveredNode && onNodeSelect) {
      onNodeSelect(hoveredNode);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-zinc-950/70 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-xs select-none">
      {/* Top Header / Filter Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60 bg-zinc-900/50 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Codebase Context Graph</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 font-mono">
            {currentNodes.length} nodes indexed
          </span>
        </div>

        {/* Node Type Filter */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'route', label: 'Routes', color: 'text-cyan-400' },
            { id: 'schema', label: 'Schemas', color: 'text-emerald-400' },
            { id: 'env', label: 'Envs', color: 'text-amber-400' },
            { id: 'middleware', label: 'MW', color: 'text-purple-400' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                filterType === btn.id
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className={btn.color}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 min-h-[220px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={handleClick}
          className="w-full h-full cursor-crosshair block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Hover Inspector Tooltip */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs pointer-events-none p-2.5 rounded-lg bg-zinc-900/95 border border-cyan-500/40 text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-semibold text-zinc-200">
                {hoveredNode.label}
              </span>
              <span
                className={`uppercase text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  hoveredNode.type === 'route'
                    ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
                    : hoveredNode.type === 'schema'
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                    : hoveredNode.type === 'env'
                    ? 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                    : 'border-purple-500/40 text-purple-400 bg-purple-950/40'
                }`}
              >
                {hoveredNode.type}
              </span>
            </div>
            {hoveredNode.metadata && (
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {hoveredNode.metadata}
              </p>
            )}
            <div className="mt-1.5 pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
              Connections: {hoveredNode.connections.length} linked symbols
            </div>
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-3 py-1.5 border-t border-zinc-800/60 bg-zinc-950/40 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            API Routes
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            DB Schemas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Env Vars
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Middleware
          </span>
        </div>
        <span className="text-zinc-400 hidden sm:inline">Updated via AST</span>
      </div>
    </div>
  );
};
