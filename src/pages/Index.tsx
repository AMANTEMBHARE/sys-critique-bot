import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { evaluateDesign } from "@/lib/evaluationEngine";
import SubmitForm from "@/components/SubmitForm";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import ReviewHistory from "@/components/ReviewHistory";
import { Terminal, History, ArrowLeft } from "lucide-react";

interface Review {
  id: string;
  title: string;
  problem_statement: string | null;
  description: string;
  feedback: any;
  overall_score: number | null;
  created_at: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data);
  };

  const handleSubmit = async (input: { title: string; problemStatement: string; description: string }) => {
    setIsLoading(true);
    setCurrentFeedback(null);
    setSelectedReview(null);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const result = evaluateDesign(input.title, input.problemStatement, input.description);

      const { error } = await supabase.from("reviews").insert([{
        title: input.title,
        problem_statement: input.problemStatement,
        description: input.description,
        feedback: result as any,
        overall_score: result.overallScore,
      }]);

      if (error) throw error;

      setCurrentFeedback(result);
      fetchReviews();
      toast({ title: "Analysis complete", description: `Score: ${result.overallScore}/100` });
    } catch {
      toast({ title: "Error", description: "Failed to save review. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReview = (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (review) {
      setSelectedReview(review);
      setCurrentFeedback(review.feedback);
      setShowHistory(false);
    }
  };

  const activeFeedback = currentFeedback;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h1 className="font-mono text-lg font-semibold tracking-tight">
              System Design Reviewer
            </h1>
          </div>
          <button
            onClick={() => { setShowHistory(!showHistory); setSelectedReview(null); }}
            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <History className="w-4 h-4" />
            History ({reviews.length})
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {showHistory ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <h2 className="font-mono text-lg font-semibold">Past Reviews</h2>
            <ReviewHistory reviews={reviews} onSelect={handleSelectReview} />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Submit Design
                </span>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <SubmitForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>

            {/* Right: Feedback */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${activeFeedback ? "bg-primary" : "bg-muted-foreground"}`} />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {selectedReview ? selectedReview.title : "Feedback"}
                </span>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                {activeFeedback ? (
                  <FeedbackDisplay feedback={activeFeedback} />
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <Terminal className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-mono text-sm">Submit a design to see feedback</p>
                    <p className="font-mono text-xs mt-1 opacity-60">
                      Include terms like &quot;load balancer&quot;, &quot;sharding&quot;, &quot;microservices&quot;...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
