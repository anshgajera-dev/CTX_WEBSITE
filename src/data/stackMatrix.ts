import { StackItem } from '../types';

export const STACK_MATRIX: StackItem[] = [
  // Languages
  {
    name: 'TypeScript / JavaScript',
    category: 'Language',
    supportLevel: 'Full AST',
    features: ['SWC AST parser', 'Type inference', 'JSDoc & TSDoc parser', 'Imports & exports graph'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'TS 4.8+'
  },
  {
    name: 'Python',
    category: 'Language',
    supportLevel: 'Full AST',
    features: ['Python 3.10+ AST', 'Type annotations', 'Docstring extraction', 'Virtualenv awareness'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Python 3.9+'
  },
  {
    name: 'Go',
    category: 'Language',
    supportLevel: 'Full AST',
    features: ['go/parser native AST', 'Struct tag analysis', 'Interface mapping', 'Go modules'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Go 1.20+'
  },
  {
    name: 'Rust',
    category: 'Language',
    supportLevel: 'Supported',
    features: ['syn & tree-sitter AST', 'Trait impl mapping', 'Macro inspection', 'Cargo workspace'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Rust 1.75+'
  },
  {
    name: 'Java / Kotlin',
    category: 'Language',
    supportLevel: 'Supported',
    features: ['Javac symbol parser', 'Spring annotations', 'Jakarta persistence', 'Gradle / Maven'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Java 17+'
  },
  {
    name: 'Ruby',
    category: 'Language',
    supportLevel: 'Supported',
    features: ['Prism parser', 'Rails conventions', 'ActiveRecord associations', 'Gemfile lock'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Ruby 3.1+'
  },
  // Frameworks
  {
    name: 'Next.js (App & Pages)',
    category: 'Framework',
    supportLevel: 'Full AST',
    features: ['Server Actions', 'Route Handlers', 'Middleware chain', 'Metadata & layouts'],
    routeDetection: true,
    schemaExtraction: false,
    version: 'v13 - v15'
  },
  {
    name: 'FastAPI',
    category: 'Framework',
    supportLevel: 'Full AST',
    features: ['APIRouter prefixes', 'Depends() tree', 'OpenAPI schema reflection', 'Response models'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'v0.90+'
  },
  {
    name: 'Gin & Echo (Go)',
    category: 'Framework',
    supportLevel: 'Full AST',
    features: ['Route groups', 'Handler signatures', 'Middleware binding', 'Query/body binding structs'],
    routeDetection: true,
    schemaExtraction: false,
    version: 'Gin v1.9+'
  },
  {
    name: 'Express & NestJS',
    category: 'Framework',
    supportLevel: 'Full AST',
    features: ['Express routers', 'Nest decorators', 'Guards & interceptors', 'Swagger annotations'],
    routeDetection: true,
    schemaExtraction: false,
    version: 'v4.x / Nest v10'
  },
  {
    name: 'Django & Django REST',
    category: 'Framework',
    supportLevel: 'Supported',
    features: ['urls.py routing', 'ViewSet mapping', 'ModelSerializer fields', 'Permission classes'],
    routeDetection: true,
    schemaExtraction: true,
    version: 'Django 4.2+'
  },
  {
    name: 'Axum & Actix-web (Rust)',
    category: 'Framework',
    supportLevel: 'Supported',
    features: ['Extractor extraction', 'Service routing', 'State inspection', 'Tokio runtime traces'],
    routeDetection: true,
    schemaExtraction: false,
    version: 'Axum 0.7+'
  },
  // ORMs / Schemas
  {
    name: 'Prisma ORM',
    category: 'ORM / DB',
    supportLevel: 'Full AST',
    features: ['schema.prisma AST', 'Relations & cascade rules', 'Enums & attributes', 'Migration history'],
    routeDetection: false,
    schemaExtraction: true,
    version: 'Prisma 4 & 5'
  },
  {
    name: 'Drizzle ORM',
    category: 'ORM / DB',
    supportLevel: 'Full AST',
    features: ['TypeScript schema AST', 'Postgres/MySQL/SQLite types', 'Foreign key references', 'Relations helper'],
    routeDetection: false,
    schemaExtraction: true,
    version: 'Drizzle 0.28+'
  },
  {
    name: 'SQLAlchemy 2.0',
    category: 'ORM / DB',
    supportLevel: 'Full AST',
    features: ['Mapped[] types', 'DeclarativeBase', 'Relationship backrefs', 'Alembic revision linkage'],
    routeDetection: false,
    schemaExtraction: true,
    version: 'SQLAlchemy 2.0+'
  },
  {
    name: 'GORM (Go)',
    category: 'ORM / DB',
    supportLevel: 'Full AST',
    features: ['Struct tags (gorm:"foreignKey")', 'Many2many joins', 'Embedded structs', 'Hooks & scopes'],
    routeDetection: false,
    schemaExtraction: true,
    version: 'GORM v1.25+'
  },
  {
    name: 'Raw SQL / Migrations',
    category: 'ORM / DB',
    supportLevel: 'Supported',
    features: ['CREATE TABLE DDL parser', 'Foreign key resolution', 'pg_dump / sqlite schema', 'Golang-migrate'],
    routeDetection: false,
    schemaExtraction: true,
    version: 'SQL:2016'
  },
  // Config & Envs
  {
    name: 'Environment (.env / TOML)',
    category: 'Config',
    supportLevel: 'Full AST',
    features: ['Variable key mapping', 'Zero value leakage guarantee', 'Fallback checking', 'Type coercion validation'],
    routeDetection: false,
    schemaExtraction: false,
    version: 'Standard'
  }
];
