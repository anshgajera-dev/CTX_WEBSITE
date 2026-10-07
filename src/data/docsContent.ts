import { DocArticle } from '../types';

export const DOCS_ARTICLES: DocArticle[] = [
  {
    id: 'quickstart',
    category: 'Getting Started',
    title: 'Quickstart Guide',
    summary: 'Install CTX and connect your codebase to Cursor or Claude in under 60 seconds.',
    content: `### Quickstart Guide

CTX extracts structured project context from your codebase and exposes it to AI coding tools via the Model Context Protocol (MCP).

#### 1. Install CTX

Install the single standalone Go binary for your platform:

\`\`\`bash
# Linux / macOS
curl -fsSL https://getctx.dev | sh

# macOS via Homebrew
brew install ctx-org/tap/ctx

# Windows via Scoop
scoop bucket add ctx https://github.com/ctx-org/scoop-bucket
scoop install ctx
\`\`\`

#### 2. Initialize in your repository

Run \`ctx init\` at the root of any git repository:

\`\`\`bash
cd my-project
ctx init
\`\`\`

CTX automatically identifies your project structure (languages, web frameworks, ORMs, and migration files) and writes a minimal configuration file at \`.ctx/config.toml\`.

#### 3. Extract codebase context

Extract AST-level routes, database models, and environment variable requirements:

\`\`\`bash
ctx extract
\`\`\`

This parses the codebase locally and creates a fast SQLite index in \`.ctx/index.db\`. It takes 150ms to 400ms for a typical 50,000-line repository.

#### 4. Connect to your AI editor

To use CTX with **Cursor**, add it to your project's \`.cursor/mcp.json\`:

\`\`\`json
{
  "mcpServers": {
    "ctx": {
      "command": "ctx",
      "args": ["serve", "--mcp"]
    }
  }
}
\`\`\`

Restart Cursor or reload MCP servers. Your editor now queries live routes, schemas, and conventions directly from your codebase!
`
  },
  {
    id: 'how-mcp-works',
    category: 'Core Concepts',
    title: 'How MCP Serves Context',
    summary: 'Understanding the Model Context Protocol tools exposed by CTX to AI models.',
    content: `### Model Context Protocol (MCP) Integration

The Model Context Protocol (MCP) is an open standard created by Anthropic that allows AI models to interact with local development tools safely and transparently.

#### Tools exposed by CTX

When running \`ctx serve --mcp\`, CTX registers the following high-precision tools:

1. **\`ctx_search\`**:
   - Accepts a natural language query (e.g. \`"user invitation email flow"\`).
   - Uses hybrid search combining **TF-IDF token ranking** with **MiniLM local embeddings**.
   - Returns top 5 relevant code symbols, route declarations, and database schemas with file coordinates.

2. **\`ctx_get_schema\`**:
   - Accepts an entity name (e.g. \`"Workspace"\` or \`"users"\`).
   - Returns complete column definitions, foreign key relationships, indexes, and nullability.

3. **\`ctx_inspect_route\`**:
   - Accepts an HTTP method and path pattern (e.g. \`POST /api/webhooks/stripe\`).
   - Returns handler signature, expected request payload types, query parameters, and attached middleware.

4. **\`ctx_get_env_vars\`**:
   - Returns list of required and optional environment keys, expected types, and defaults.
   - **Guaranteed zero secret leakage:** Never reads or returns values from \`.env\`.

#### Stdio Transport

CTX communicates over standard input/output (stdio) using JSON-RPC 2.0 messages. It starts immediately with no network open ports required for local MCP clients.
`
  },
  {
    id: 'cli-reference',
    category: 'CLI Reference',
    title: 'Command Reference',
    summary: 'Complete reference for all CTX commands, flags, and environment overrides.',
    content: `### Command Reference

All CTX commands are designed to be fast, idempotent, and scriptable.

#### \`ctx init\`
Initializes a CTX repository index.
\`\`\`bash
ctx init [--force] [--config path]
\`\`\`
- \`--force\`: Overwrite existing \`.ctx/config.toml\`
- \`--no-ignore\`: Include files usually ignored by .gitignore

#### \`ctx extract\`
Parses the repository AST and updates the local SQLite index.
\`\`\`bash
ctx extract [--watch] [--verbose] [--dry-run]
\`\`\`
- \`--watch\`: Run as a file-watching background daemon that updates the index on save (<20ms incremental updates).
- \`--dry-run\`: Output extracted JSON to stdout without writing to database.

#### \`ctx health\`
Calculates the 0-100 codebase context health score and suggests fixes.
\`\`\`bash
ctx health [--json] [--fail-under=80]
\`\`\`
- \`--json\`: Machine-readable JSON output for CI/CD checks.
- \`--fail-under=N\`: Exits with code 1 if health score is below threshold.

#### \`ctx search <query>\`
Performs hybrid semantic and lexical search on indexed symbols.
\`\`\`bash
ctx search "stripe webhook handling"
\`\`\`

#### \`ctx ui\`
Launches the local web dashboard at \`http://localhost:4242\`.
\`\`\`bash
ctx ui [--port 4242] [--open]
\`\`\`

#### \`ctx diff [commit/branch]\`
Shows context schema and route diff between git commits.
\`\`\`bash
ctx diff main...feature-billing
\`\`\`
`
  },
  {
    id: 'privacy-security',
    category: 'Privacy & Security',
    title: 'Privacy Architecture & Threat Model',
    summary: 'How CTX ensures no secret values or source code ever leave your local machine.',
    content: `### Privacy Architecture & Threat Model

Developers should never have to sacrifice privacy to give AI tools accurate context. CTX is architected with strict local-first guarantees:

#### 1. Zero Secret Ingestion
- CTX parses \`.env.example\`, configuration schema declarations, and type definitions.
- It explicitly **ignores and redacts** values inside \`.env\`, \`.env.local\`, and secrets files.
- An automatic Shannon-entropy heuristic catches accidentally hardcoded tokens (AWS keys, JWTs, Stripe keys) and replaces them with \`[REDACTED_SECRET]\` before indexing.

#### 2. Local-Only Execution
- CTX is a single compiled Go binary.
- By default, it makes **zero network calls**.
- All vector embeddings and TF-IDF weights are computed on your CPU using an embedded quantized ONNX MiniLM runtime or local token hashing.
- The index is stored on your local disk in \`.ctx/index.db\` (SQLite).

#### 3. Air-Gapped Compatibility
CTX runs perfectly on air-gapped workstations and isolated CI runners. There is no telemetry, analytics beacon, or licensing server call.
`
  },
  {
    id: 'team-server',
    category: 'Team Server',
    title: 'Self-Hosted Team Server (ctx team)',
    summary: 'Sync indexes across your engineering team and CI/CD pipelines.',
    content: `### Self-Hosted Team Server

For engineering teams with large monorepos or multi-service repositories, CTX includes a lightweight self-hosted server written in Go.

#### Why use a team server?
- **Instant onboarding:** New team members pull the compiled codebase map in 50ms without running local extractions.
- **CI/CD Integration:** Run \`ctx extract\` and \`ctx team push\` in GitHub Actions on every merge to main.
- **PR Context Checks:** Post context diffs and health score changes directly as pull request comments.

#### Deployment via Docker Compose

\`\`\`yaml
version: '3.8'
services:
  ctx-server:
    image: ghcr.io/ctx-org/ctx-server:latest
    ports:
      - "8080:8080"
    environment:
      - CTX_AUTH_TOKEN=your-team-secret-key
      - CTX_STORAGE_PATH=/data
    volumes:
      - ctx-data:/data

volumes:
  ctx-data:
\`\`\`

#### Team CLI commands
\`\`\`bash
# Configure team server URL
ctx team login https://ctx.internal.company.com --token $CTX_AUTH_TOKEN

# Push fresh index after git merge
ctx team push

# Pull latest team index
ctx team pull
\`\`\`
`
  }
];
