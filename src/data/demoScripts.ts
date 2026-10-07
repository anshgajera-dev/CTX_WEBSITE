import { ProjectDemo } from '../types';

export const DEMO_PROJECTS: ProjectDemo[] = [
  {
    id: 'nextjs',
    name: 'Next.js 15 (App Router)',
    badge: 'TypeScript + Prisma',
    tech: 'TypeScript, Next.js, Prisma, NextAuth, Tailwind',
    steps: [
      {
        command: 'ctx init',
        output: [
          'ctx: discovering repository layout...',
          '  ✓ detected Next.js (App Router) at /src/app',
          '  ✓ detected Prisma ORM schema at /prisma/schema.prisma',
          '  ✓ detected TypeScript 5.6 & ESLint 9',
          '  ✓ created .ctx/config.toml (14ms)',
          'Initialized CTX repository in 18ms.'
        ],
        highlightCategory: 'init'
      },
      {
        command: 'ctx extract',
        output: [
          'ctx: extracting structured codebase graph...',
          '  [1/4] Routes:    14 API route handlers (/api/auth/[...nextauth], /api/v2/workspaces, /api/teams)',
          '  [2/4] Schemas:   9 Prisma models (User, Account, Workspace, Membership, AuditLog)',
          '  [3/4] Envs:      11 environment tokens (.env.example validated, 0 values leaked)',
          '  [4/4] Vectors:   Hybrid TF-IDF + MiniLM embeddings generated for 42 semantic blocks',
          'Indexed in 312ms. Context index: .ctx/index.db (412 KB).'
        ],
        highlightCategory: 'extract'
      },
      {
        command: 'ctx health',
        output: [
          '┌── CTX CONTEXT HEALTH REPORT ─────────────────────────────┐',
          '│ Overall Score: 88 / 100 [A-]                              │',
          '│   ✓ Route Coverage:    100% (14/14 handlers typed)       │',
          '│   ✓ DB Relationships:  100% (all foreign keys resolved)  │',
          '│   ⚠ Env Variables:     82% (2 vars missing .env.example) │',
          '│   ⚠ Schema Docs:       74% (3 models lack field docstrings)│',
          '│ Suggested fixes:                                         │',
          '│   - Add NEXT_PUBLIC_POSTHOG_KEY to .env.example (+4 pts) │',
          '│   - Document Workspace.billing_tier enum in schema (+8 pts)│',
          '└──────────────────────────────────────────────────────────┘'
        ],
        highlightCategory: 'health'
      },
      {
        command: 'ctx search "auth flow"',
        output: [
          'ctx: hybrid search (TF-IDF + MiniLM) for "auth flow":',
          '  1. [Route]  POST /api/auth/[...nextauth] (src/app/api/auth/[...nextauth]/route.ts)',
          '              Handlers: credentials, github. Session strategy: JWT + DB adapter.',
          '  2. [Model]  Account (prisma/schema.prisma:18)',
          '              Relations: User -> Account (1:N), compound key [provider, providerAccountId]',
          '  3. [Env]    NEXTAUTH_SECRET, NEXTAUTH_URL (Required in production)',
          '  4. [M/ware] middleware.ts: protects /dashboard/*, checks req.auth token'
        ],
        highlightCategory: 'search'
      }
    ],
    beforeAi: {
      prompt: 'How do I add a new OAuth provider and read the active session in our workspace API?',
      aiAnswer: `// AI Guessing (Without CTX):
import { getSession } from "next-auth/react"; // ❌ Wrong: App Router server routes cannot use client hook!

export async function GET(req) {
  const session = await getSession(); // ❌ Fails at runtime
  // Assuming user table has 'companyId'
  const workspace = await db.company.findFirst({ // ❌ No 'company' table exists! Model is 'Workspace'
    where: { userId: session.user.id }
  });
  return Response.json(workspace);
}`,
      flaws: [
        'Called client-side getSession() inside Next.js App Router route handler',
        'Invented a db.company table (actual Prisma model is Workspace)',
        'Missed existing auth() wrapper from NextAuth v5'
      ]
    },
    afterAi: {
      prompt: 'How do I add a new OAuth provider and read the active session in our workspace API?',
      aiAnswer: `// Accurate Context (Via CTX MCP):
import { auth } from "@/auth"; // ✓ Exact auth helper indexed by CTX
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  // Schema verified: User -> Membership -> Workspace
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true }
  });
  return Response.json(membership?.workspace);
}`,
      highlights: [
        'Used exact NextAuth v5 auth() pattern from src/auth.ts',
        'Navigated exact Prisma relation: User -> Membership -> Workspace',
        'Recognized verified TypeScript return types and route conventions'
      ]
    },
    graphNodes: [
      { id: 'auth_route', label: 'POST /api/auth/[...]', type: 'route', x: 20, y: 35, connections: ['user_model', 'env_nextauth'], metadata: 'NextAuth v5 handler' },
      { id: 'workspaces_route', label: 'GET /api/workspaces', type: 'route', x: 75, y: 25, connections: ['workspace_model', 'membership_model'], metadata: 'Tenant workspace listing' },
      { id: 'teams_route', label: 'POST /api/teams', type: 'route', x: 80, y: 70, connections: ['workspace_model'], metadata: 'Team creator' },
      { id: 'user_model', label: 'Model: User', type: 'schema', x: 25, y: 75, connections: ['membership_model', 'account_model'], metadata: 'Prisma schema (id, email, role)' },
      { id: 'account_model', label: 'Model: Account', type: 'schema', x: 10, y: 55, connections: ['user_model'], metadata: 'OAuth credentials' },
      { id: 'workspace_model', label: 'Model: Workspace', type: 'schema', x: 50, y: 45, connections: ['membership_model'], metadata: 'Tenancy root' },
      { id: 'membership_model', label: 'Model: Membership', type: 'schema', x: 45, y: 80, connections: ['workspace_model', 'user_model'], metadata: 'User <-> Workspace M2M' },
      { id: 'env_nextauth', label: 'ENV: NEXTAUTH_SECRET', type: 'env', x: 15, y: 15, connections: ['auth_route'], metadata: 'JWT signing secret' },
      { id: 'env_db', label: 'ENV: DATABASE_URL', type: 'env', x: 55, y: 15, connections: ['workspace_model', 'user_model'], metadata: 'PostgreSQL connection' },
      { id: 'mw_auth', label: 'MW: middleware.ts', type: 'middleware', x: 85, y: 45, connections: ['auth_route', 'workspaces_route'], metadata: 'Route edge protector' },
    ]
  },
  {
    id: 'fastapi',
    name: 'FastAPI (Python 3.12)',
    badge: 'SQLAlchemy + Pydantic',
    tech: 'Python, FastAPI, SQLAlchemy 2.0, Alembic, Redis',
    steps: [
      {
        command: 'ctx init',
        output: [
          'ctx: discovering repository layout...',
          '  ✓ detected FastAPI application at app/main.py',
          '  ✓ detected SQLAlchemy models at app/models/*.py',
          '  ✓ detected Alembic migrations directory at alembic/versions',
          '  ✓ created .ctx/config.toml (11ms)',
          'Initialized CTX repository in 14ms.'
        ],
        highlightCategory: 'init'
      },
      {
        command: 'ctx extract',
        output: [
          'ctx: extracting structured codebase graph...',
          '  [1/4] Routes:    22 APIRouter endpoints (auth, telemetry, billing, orders)',
          '  [2/4] Schemas:   12 SQLAlchemy DeclarativeBase classes & 18 Pydantic v2 schemas',
          '  [3/4] Envs:      8 pydantic-settings fields parsed (.env.example verified)',
          '  [4/4] Vectors:   Hybrid TF-IDF + MiniLM embeddings generated for 58 code units',
          'Indexed in 284ms. Context index: .ctx/index.db (498 KB).'
        ],
        highlightCategory: 'extract'
      },
      {
        command: 'ctx health',
        output: [
          '┌── CTX CONTEXT HEALTH REPORT ─────────────────────────────┐',
          '│ Overall Score: 92 / 100 [A]                               │',
          '│   ✓ Route Coverage:    100% (all endpoints have response_model)│',
          '│   ✓ Schema Validation: 96% (Pydantic v2 types match ORM) │',
          '│   ✓ Alembic Migrations:100% (head revision matches models)│',
          '│   ⚠ Env Variables:     87% (REDIS_PORT has no fallback)  │',
          '│ Suggested fixes:                                         │',
          '│   - Add default 6379 to app/config.py:Settings.redis_port (+8 pts) │',
          '└──────────────────────────────────────────────────────────┘'
        ],
        highlightCategory: 'health'
      },
      {
        command: 'ctx search "auth flow"',
        output: [
          'ctx: hybrid search (TF-IDF + MiniLM) for "auth flow":',
          '  1. [Route]  POST /api/v1/auth/token (app/routers/auth.py:42)',
          '              Depends(OAuth2PasswordRequestForm), returns TokenResponse(access_token, token_type)',
          '  2. [Model]  UserAccount (app/models/user.py:15)',
          '              Columns: id, email, hashed_password, is_active, role: UserRoleEnum',
          '  3. [Depend] get_current_active_user (app/dependencies/auth.py:28)',
          '              Validates JWT sub against redis revocation set'
        ],
        highlightCategory: 'search'
      }
    ],
    beforeAi: {
      prompt: 'How do I protect an endpoint and get the current user in our billing router?',
      aiAnswer: `# AI Guessing (Without CTX):
from fastapi import Depends
from flask_login import current_user # ❌ Mixed framework hallucination!

@router.post("/checkout")
def checkout(user = Depends(current_user)): # ❌ Completely broken syntax
    # Assuming user has stripe_id
    customer = stripe.Customer.retrieve(user.stripe_customer_id) # ❌ Field doesn't exist
    return customer`,
      flaws: [
        'Hallucinated flask_login in a modern FastAPI codebase',
        'Invented user.stripe_customer_id instead of reading BillingAccount model',
        'Omitted async def matching repository conventions'
      ]
    },
    afterAi: {
      prompt: 'How do I protect an endpoint and get the current user in our billing router?',
      aiAnswer: `# Accurate Context (Via CTX MCP):
from fastapi import APIRouter, Depends, status
from app.dependencies.auth import get_current_active_user
from app.models.user import UserAccount
from app.schemas.billing import CheckoutResponse

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/checkout", response_model=CheckoutResponse)
async def checkout(
    current_user: UserAccount = Depends(get_current_active_user),
):
    # CTX verified: billing relations live on user.billing_profile
    return await process_checkout(current_user.billing_profile.customer_id)`,
      highlights: [
        'Imported exact get_current_active_user dependency from app/dependencies/auth.py',
        'Used project standard response_model schema',
        'Correctly referenced user.billing_profile navigation property'
      ]
    },
    graphNodes: [
      { id: 'auth_token', label: 'POST /api/v1/auth/token', type: 'route', x: 20, y: 30, connections: ['user_account', 'env_jwt'], metadata: 'OAuth2 password grant' },
      { id: 'billing_route', label: 'POST /billing/checkout', type: 'route', x: 75, y: 35, connections: ['billing_profile', 'user_account'], metadata: 'Checkout endpoint' },
      { id: 'user_account', label: 'Model: UserAccount', type: 'schema', x: 35, y: 65, connections: ['billing_profile'], metadata: 'SQLAlchemy 2.0 Base' },
      { id: 'billing_profile', label: 'Model: BillingProfile', type: 'schema', x: 65, y: 70, connections: ['user_account'], metadata: 'Stripe customer reference' },
      { id: 'env_jwt', label: 'ENV: SECRET_KEY', type: 'env', x: 20, y: 15, connections: ['auth_token'], metadata: 'HS256 encryption' },
      { id: 'env_redis', label: 'ENV: REDIS_URL', type: 'env', x: 50, y: 15, connections: ['dep_auth'], metadata: 'Token revocation' },
      { id: 'dep_auth', label: 'Dep: get_current_user', type: 'middleware', x: 50, y: 40, connections: ['auth_token', 'billing_route', 'user_account'], metadata: 'JWT dependency' }
    ]
  },
  {
    id: 'gogin',
    name: 'Go / Gin (v1.10)',
    badge: 'GORM + Postgres',
    tech: 'Go 1.23, Gin, GORM, Viper, PostgreSQL, Redis',
    steps: [
      {
        command: 'ctx init',
        output: [
          'ctx: discovering repository layout...',
          '  ✓ detected Go module github.com/acme/backend at go.mod',
          '  ✓ detected Gin engine routes in internal/server/routes.go',
          '  ✓ detected GORM entities in internal/models/*.go',
          '  ✓ created .ctx/config.toml (8ms)',
          'Initialized CTX repository in 11ms.'
        ],
        highlightCategory: 'init'
      },
      {
        command: 'ctx extract',
        output: [
          'ctx: extracting structured codebase graph...',
          '  [1/4] Routes:    19 Gin endpoints across 4 route groups (/v1/auth, /v1/orgs, /v1/events)',
          '  [2/4] Schemas:   8 GORM struct models with GORM tags & foreign keys',
          '  [3/4] Envs:      14 Viper config keys mapped from internal/config/config.go',
          '  [4/4] Vectors:   Hybrid TF-IDF + MiniLM embeddings generated for 36 Go packages',
          'Indexed in 194ms. Context index: .ctx/index.db (340 KB).'
        ],
        highlightCategory: 'extract'
      },
      {
        command: 'ctx health',
        output: [
          '┌── CTX CONTEXT HEALTH REPORT ─────────────────────────────┐',
          '│ Overall Score: 95 / 100 [A+]                              │',
          '│   ✓ Route Coverage:    100% (19/19 handler signatures)   │',
          '│   ✓ GORM Tag Integrity:100% (all foreign keys validated) │',
          '│   ✓ Envs Documented:   93% (all Viper defaults present)  │',
          '│ Suggested fixes:                                         │',
          '│   - Add gorm index tag to internal/models/event.go:TraceID (+5 pts) │',
          '└──────────────────────────────────────────────────────────┘'
        ],
        highlightCategory: 'health'
      },
      {
        command: 'ctx search "auth flow"',
        output: [
          'ctx: hybrid search (TF-IDF + MiniLM) for "auth flow":',
          '  1. [Route]  POST /v1/auth/login (internal/handlers/auth.go:34)',
          '              Binds LoginRequest, issues ECDSA JWT via internal/token/jwt.go',
          '  2. [Model]  models.User (internal/models/user.go:12)',
          '              Fields: ID (uuid), Email (uniqueIndex), PasswordHash, OrgID (fk)',
          '  3. [M/ware] middleware.AuthRequired() (internal/middleware/auth.go:18)',
          '              Validates Authorization: Bearer, sets "claims" in c.Keys'
        ],
        highlightCategory: 'search'
      }
    ],
    beforeAi: {
      prompt: 'How do I extract the authenticated user ID and check organization access in a Gin handler?',
      aiAnswer: `// AI Guessing (Without CTX):
func HandleOrg(c *gin.Context) {
  // Hallucinating generic claims pattern
  userId := c.GetString("user_id") // ❌ Wrong key! Repo sets "claims" (*TokenClaims)
  var user User
  db.Find(&user, "id = ?", userId)
  // Hallucinating non-existent OrgMember table
  var member OrgMember // ❌ Real model is models.OrganizationUser
  db.Where("org_id = ? AND user_id = ?", c.Param("id"), userId).First(&member)
}`,
      flaws: [
        'Called c.GetString("user_id") instead of reading context claims struct',
        'Invented an OrgMember struct that does not exist in codebase',
        'Ignored error handling standard error response helper'
      ]
    },
    afterAi: {
      prompt: 'How do I extract the authenticated user ID and check organization access in a Gin handler?',
      aiAnswer: `// Accurate Context (Via CTX MCP):
package handlers

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "github.com/acme/backend/internal/middleware"
  "github.com/acme/backend/internal/models"
)

func (h *Handler) GetOrg(c *gin.Context) {
  claims := middleware.GetClaims(c) // ✓ CTX indexed exact helper
  orgID := c.Param("orgID")

  var org models.Organization
  err := h.db.Where("id = ? AND owner_id = ?", orgID, claims.Subject).First(&org).Error
  if err != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": "organization not found"})
    return
  }
  c.JSON(http.StatusOK, org)
}`,
      highlights: [
        'Used exact middleware.GetClaims(c) helper from internal/middleware',
        'Referenced models.Organization with exact owner_id column',
        'Followed codebase dependency injection on *Handler struct'
      ]
    },
    graphNodes: [
      { id: 'auth_login', label: 'POST /v1/auth/login', type: 'route', x: 20, y: 35, connections: ['user_struct', 'env_jwt'], metadata: 'ECDSA JWT issuer' },
      { id: 'org_get', label: 'GET /v1/orgs/:orgID', type: 'route', x: 80, y: 30, connections: ['org_struct', 'mw_auth'], metadata: 'Org profile' },
      { id: 'user_struct', label: 'Struct: models.User', type: 'schema', x: 25, y: 70, connections: ['org_struct'], metadata: 'UUID pk, GORM entity' },
      { id: 'org_struct', label: 'Struct: models.Organization', type: 'schema', x: 60, y: 75, connections: ['user_struct'], metadata: 'Tenancy root' },
      { id: 'env_jwt', label: 'VIPER: JWT_PRIVATE_KEY', type: 'env', x: 15, y: 15, connections: ['auth_login'], metadata: 'PEM formatted' },
      { id: 'env_db', label: 'VIPER: DATABASE_DSN', type: 'env', x: 50, y: 15, connections: ['org_struct', 'user_struct'], metadata: 'Postgres connection string' },
      { id: 'mw_auth', label: 'MW: AuthRequired()', type: 'middleware', x: 50, y: 40, connections: ['auth_login', 'org_get'], metadata: 'JWT Bearer validator' }
    ]
  }
];

export const QUICK_COMMANDS = [
  'ctx init',
  'ctx extract',
  'ctx health',
  'ctx search "auth flow"',
  'ctx serve --mcp',
  'ctx diff'
];
