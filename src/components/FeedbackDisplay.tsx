import { TrendingUp, Database, Globe, Boxes, Lightbulb } from "lucide-react";

interface CategoryScore {
  score: number;
  feedback: string;
  suggestions: string[];
}

interface FeedbackData {
  scalability: CategoryScore;
  database: CategoryScore;
  api: CategoryScore;
  components: CategoryScore;
  overallScore: number;
}

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "hsl(var(--success))" : score >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-mono font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-muted-foreground font-mono">/100</span>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon: Icon, label, data }: { icon: typeof TrendingUp; label: string; data: CategoryScore }) => {
  const barColor = data.score >= 70 ? "bg-primary" : data.score >= 40 ? "bg-warning" : "bg-destructive";

  return (
    <div className="bg-secondary rounded-lg p-4 border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">{label}</span>
        </div>
        <span className="font-mono text-sm font-bold">{data.score}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${data.score}%` }} />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{data.feedback}</p>
      {data.suggestions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {data.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lightbulb className="w-3 h-3 mt-0.5 text-warning shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FeedbackDisplay = ({ feedback }: { feedback: FeedbackData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-mono text-lg font-semibold text-foreground">Overall Score</h2>
        <ScoreRing score={feedback.overallScore} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryCard icon={TrendingUp} label="Scalability" data={feedback.scalability} />
        <CategoryCard icon={Database} label="Database Design" data={feedback.database} />
        <CategoryCard icon={Globe} label="API Design" data={feedback.api} />
        <CategoryCard icon={Boxes} label="System Components" data={feedback.components} />
      </div>
    </div>
  );
};

export default FeedbackDisplay;
