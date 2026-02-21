"use client";

import type { GeneratedStorybook } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoryDisplayProps {
  storybook: GeneratedStorybook | null;
  streamingText: string;
  isStreaming: boolean;
}

export function StoryDisplay({
  storybook,
  streamingText,
  isStreaming,
}: StoryDisplayProps) {
  if (isStreaming && !storybook) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <p className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
              {streamingText || "Genererer historie..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storybook) return null;

  return (
    <div className="space-y-6">
      {/* Story */}
      <Card>
        <CardHeader>
          <CardTitle>{storybook.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-stone max-w-none">
            {storybook.story.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordliste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-semibold">Ord</th>
                  <th className="pb-2 text-left font-semibold">Oversettelse</th>
                  <th className="pb-2 text-left font-semibold">Eksempel</th>
                </tr>
              </thead>
              <tbody>
                {storybook.vocabulary.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 font-medium">{item.word}</td>
                    <td className="py-2 text-muted-foreground">
                      {item.translation}
                    </td>
                    <td className="py-2 italic text-muted-foreground">
                      {item.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Comprehension Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forståelsesspørsmål</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-3 pl-5">
            {storybook.questions.map((q, i) => (
              <li key={i}>
                <p className="font-medium">{q.question}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
