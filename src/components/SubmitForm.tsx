import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SubmitFormProps {
  onSubmit: (data: { title: string; problemStatement: string; description: string }) => void;
  isLoading: boolean;
}

const SubmitForm = ({ onSubmit, isLoading }: SubmitFormProps) => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title: title.trim(), problemStatement: problemStatement.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-mono font-medium text-muted-foreground mb-1.5">
          Design Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. URL Shortener, Chat System..."
          className="bg-secondary border-border font-mono text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-mono font-medium text-muted-foreground mb-1.5">
          Problem Statement
        </label>
        <Textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Describe the problem you're solving..."
          className="bg-secondary border-border font-mono text-sm min-h-[80px] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-mono font-medium text-muted-foreground mb-1.5">
          Design Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your system architecture, components, data flow, scaling strategy..."
          className="bg-secondary border-border font-mono text-sm min-h-[200px]"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !title.trim() || !description.trim()} className="w-full font-mono">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send />
            Analyze Design
          </>
        )}
      </Button>
    </form>
  );
};

export default SubmitForm;
