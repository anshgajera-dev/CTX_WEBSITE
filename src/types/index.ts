export interface ProjectDemo {
  id: 'nextjs' | 'fastapi' | 'gogin';
  name: string;
  badge: string;
  tech: string;
  steps: DemoStep[];
  beforeAi: {
    prompt: string;
    aiAnswer: string;
    flaws: string[];
  };
  afterAi: {
    prompt: string;
    aiAnswer: string;
    highlights: string[];
  };
  graphNodes: GraphNode[];
}

export interface DemoStep {
  command: string;
  output: string[];
  durationMs?: number;
  highlightCategory?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'route' | 'schema' | 'env' | 'middleware';
  x: number;
  y: number;
  connections: string[];
  metadata?: string;
}

export interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

export interface StackItem {
  name: string;
  category: 'Language' | 'Framework' | 'ORM / DB' | 'Config';
  supportLevel: 'Full AST' | 'Supported' | 'Experimental';
  features: string[];
  routeDetection: boolean;
  schemaExtraction: boolean;
  version: string;
}
