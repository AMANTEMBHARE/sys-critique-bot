interface EvaluationResult {
  scalability: { score: number; feedback: string; suggestions: string[] };
  database: { score: number; feedback: string; suggestions: string[] };
  api: { score: number; feedback: string; suggestions: string[] };
  components: { score: number; feedback: string; suggestions: string[] };
  overallScore: number;
}

const SCALABILITY_KEYWORDS = [
  { term: "load balancer", weight: 15 },
  { term: "horizontal scaling", weight: 15 },
  { term: "vertical scaling", weight: 8 },
  { term: "auto-scaling", weight: 12 },
  { term: "cdn", weight: 10 },
  { term: "cache", weight: 12 },
  { term: "redis", weight: 10 },
  { term: "memcached", weight: 8 },
  { term: "queue", weight: 10 },
  { term: "message broker", weight: 10 },
  { term: "kafka", weight: 12 },
  { term: "rabbitmq", weight: 10 },
  { term: "replication", weight: 10 },
  { term: "partitioning", weight: 10 },
  { term: "rate limiting", weight: 8 },
  { term: "throttling", weight: 8 },
  { term: "distributed", weight: 10 },
  { term: "stateless", weight: 10 },
  { term: "elastic", weight: 8 },
];

const DATABASE_KEYWORDS = [
  { term: "sql", weight: 10 },
  { term: "nosql", weight: 10 },
  { term: "mongodb", weight: 8 },
  { term: "postgresql", weight: 10 },
  { term: "mysql", weight: 8 },
  { term: "sharding", weight: 15 },
  { term: "indexing", weight: 12 },
  { term: "normalization", weight: 10 },
  { term: "denormalization", weight: 10 },
  { term: "acid", weight: 12 },
  { term: "cap theorem", weight: 15 },
  { term: "eventual consistency", weight: 12 },
  { term: "strong consistency", weight: 12 },
  { term: "read replica", weight: 10 },
  { term: "write-ahead log", weight: 10 },
  { term: "b-tree", weight: 8 },
  { term: "schema", weight: 8 },
  { term: "migration", weight: 6 },
];

const API_KEYWORDS = [
  { term: "rest api", weight: 10 },
  { term: "graphql", weight: 12 },
  { term: "grpc", weight: 12 },
  { term: "endpoint", weight: 8 },
  { term: "microservice", weight: 15 },
  { term: "api gateway", weight: 15 },
  { term: "authentication", weight: 10 },
  { term: "authorization", weight: 10 },
  { term: "oauth", weight: 10 },
  { term: "jwt", weight: 10 },
  { term: "webhook", weight: 8 },
  { term: "websocket", weight: 10 },
  { term: "pagination", weight: 8 },
  { term: "versioning", weight: 8 },
  { term: "idempotent", weight: 10 },
  { term: "swagger", weight: 6 },
  { term: "openapi", weight: 6 },
];

const COMPONENT_KEYWORDS = [
  { term: "load balancer", weight: 10 },
  { term: "reverse proxy", weight: 10 },
  { term: "nginx", weight: 8 },
  { term: "cdn", weight: 10 },
  { term: "dns", weight: 8 },
  { term: "firewall", weight: 8 },
  { term: "container", weight: 10 },
  { term: "docker", weight: 8 },
  { term: "kubernetes", weight: 12 },
  { term: "service mesh", weight: 12 },
  { term: "monitoring", weight: 10 },
  { term: "logging", weight: 8 },
  { term: "alerting", weight: 8 },
  { term: "ci/cd", weight: 8 },
  { term: "object storage", weight: 8 },
  { term: "blob storage", weight: 8 },
  { term: "s3", weight: 8 },
  { term: "notification", weight: 6 },
];

function scoreCategory(text: string, keywords: { term: string; weight: number }[]): { score: number; matched: string[] } {
  const lower = text.toLowerCase();
  let totalWeight = 0;
  const matched: string[] = [];

  for (const { term, weight } of keywords) {
    if (lower.includes(term)) {
      totalWeight += weight;
      matched.push(term);
    }
  }

  const maxPossible = keywords.reduce((sum, k) => sum + k.weight, 0);
  const score = Math.min(100, Math.round((totalWeight / maxPossible) * 100 * 2.5));
  return { score, matched };
}

function generateFeedback(category: string, score: number, matched: string[]): string {
  if (score >= 80) return `Excellent ${category} design. You've covered key concepts including ${matched.slice(0, 4).join(", ")}.`;
  if (score >= 50) return `Good ${category} coverage. You mentioned ${matched.join(", ")}. Consider expanding on more advanced patterns.`;
  if (score >= 20) return `Basic ${category} awareness shown with ${matched.join(", ")}. More depth needed.`;
  return `${category} needs significant improvement. Consider addressing core concepts in this area.`;
}

function generateSuggestions(category: string, score: number, matched: string[], allKeywords: { term: string }[]): string[] {
  if (score >= 80) return ["Great coverage — consider edge cases and failure scenarios"];
  const missing = allKeywords.filter(k => !matched.includes(k.term)).slice(0, 3).map(k => k.term);
  return missing.map(m => `Consider discussing "${m}" for better ${category.toLowerCase()} coverage`);
}

export function evaluateDesign(title: string, problemStatement: string, description: string): EvaluationResult {
  const fullText = `${title} ${problemStatement} ${description}`;

  const scalResult = scoreCategory(fullText, SCALABILITY_KEYWORDS);
  const dbResult = scoreCategory(fullText, DATABASE_KEYWORDS);
  const apiResult = scoreCategory(fullText, API_KEYWORDS);
  const compResult = scoreCategory(fullText, COMPONENT_KEYWORDS);

  const overallScore = Math.round((scalResult.score + dbResult.score + apiResult.score + compResult.score) / 4);

  return {
    scalability: {
      score: scalResult.score,
      feedback: generateFeedback("Scalability", scalResult.score, scalResult.matched),
      suggestions: generateSuggestions("Scalability", scalResult.score, scalResult.matched, SCALABILITY_KEYWORDS),
    },
    database: {
      score: dbResult.score,
      feedback: generateFeedback("Database Design", dbResult.score, dbResult.matched),
      suggestions: generateSuggestions("Database", dbResult.score, dbResult.matched, DATABASE_KEYWORDS),
    },
    api: {
      score: apiResult.score,
      feedback: generateFeedback("API Design", apiResult.score, apiResult.matched),
      suggestions: generateSuggestions("API", apiResult.score, apiResult.matched, API_KEYWORDS),
    },
    components: {
      score: compResult.score,
      feedback: generateFeedback("System Components", compResult.score, compResult.matched),
      suggestions: generateSuggestions("Components", compResult.score, compResult.matched, COMPONENT_KEYWORDS),
    },
    overallScore,
  };
}
