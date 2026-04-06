import { Clock, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  title: string;
  overall_score: number | null;
  created_at: string;
}

const ReviewHistory = ({ reviews, onSelect }: { reviews: Review[]; onSelect: (id: string) => void }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="font-mono text-sm">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reviews.map((review) => {
        const scoreColor = (review.overall_score ?? 0) >= 70 ? "text-primary" : (review.overall_score ?? 0) >= 40 ? "text-warning" : "text-destructive";
        return (
          <button
            key={review.id}
            onClick={() => onSelect(review.id)}
            className="w-full flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border hover:border-primary/40 transition-colors text-left group"
          >
            <div className={`font-mono text-lg font-bold w-10 text-center ${scoreColor}`}>
              {review.overall_score ?? "–"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-medium truncate">{review.title}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        );
      })}
    </div>
  );
};

export default ReviewHistory;
