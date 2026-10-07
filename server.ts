import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for specific roles
const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  architect: `You are the CTX Codebase Context Architect.
CTX is an open-source "Git for context" CLI tool written in Go that extracts structured project context (API endpoints, DB schemas, env vars, dependencies, conventions) from repositories and serves it to AI coding tools (Cursor, Claude Desktop, VS Code) via MCP (Model Context Protocol).
Your role:
- Provide authoritative, concise, and technically precise explanations of repository architecture, AST extraction, context graphs, and codebase topology.
- Help developers map out their APIs, database relationships, and conventions.
- Format code cleanly in Markdown with language tags. Avoid boilerplate, fluff, and generic introductory pleasantries. Speak like a senior systems engineer.`,

  mcp_specialist: `You are the CTX MCP (Model Context Protocol) Integration Engineer.
You specialize in connecting CTX to AI editors: Cursor, Claude Desktop, VS Code (Continue/Cline/Roo Code), Windsurf, and custom MCP clients.
Your role:
- Help users configure stdio JSON-RPC MCP servers and client config files (.cursor/mcp.json, claude_desktop_config.json, etc.).
- Explain the tools exposed by CTX (ctx_search, ctx_get_schema, ctx_inspect_route, ctx_get_env_vars).
- Debug connection errors, environment path issues, and tool invocation contracts.
- Provide direct copy-pasteable JSON configurations and terminal commands.`,

  health_auditor: `You are the CTX Context Health & Lint Auditor.
You focus on measuring and improving the 0-100 codebase context health score (ctx health).
Your role:
- Help developers audit their codebase for missing return types, phantom routes, orphan migrations, and undocumented environment variables.
- Explain why LLMs hallucinate when code contracts are ambiguous.
- Provide actionable fixes that boost the codebase context health score to 100/100.`,

  fast_assistant: `You are the CTX Fast Reference Assistant.
Your role:
- Give rapid, direct, 1-3 sentence answers and exact CLI commands or syntax snippets without extraneous explanations.
- Optimized for quick lookups on commands (ctx init, ctx extract, ctx serve, ctx ui, ctx diff, ctx team).`
};

// Multi-turn chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      model = 'gemini-3.5-flash',
      role = 'architect',
      customSystemInstruction
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required and must not be empty.' });
    }

    // Model validation based on requirements:
    // gemini-3.1-pro-preview (complex tasks), gemini-3.5-flash (general tasks), gemini-3.1-flash-lite (fast tasks)
    const validModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-3.8-flash'];
    const selectedModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please configure your API key in Settings > Secrets.',
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    // Determine system instruction
    const systemInstruction = customSystemInstruction || ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.architect;

    // Convert messages to GenAI contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'No response generated.';
    return res.json({
      reply: replyText,
      model: selectedModel,
      role,
    });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    const errorMessage = error?.message || 'Failed to generate response from Gemini API';
    return res.status(500).json({ error: errorMessage });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
