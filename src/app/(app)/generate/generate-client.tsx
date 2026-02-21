"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GeneratorForm } from "@/components/generator-form";
import { StoryDisplay } from "@/components/story-display";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import type { GeneratedStorybook, CefrLevel, Variant, Theme } from "@/types";

interface GenerateClientProps {
  themes: Theme[];
}

export function GenerateClient({ themes }: GenerateClientProps) {
  const [storybook, setStorybook] = useState<GeneratedStorybook | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<{
    cefrLevel: CefrLevel;
    theme: string;
    variant: Variant;
    spor: string;
    vocabularyFocus: string[];
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    if (!storybook || !meta) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const wordCount = storybook.story.split(/\s+/).filter(Boolean).length;

    const { data, error } = await supabase
      .from("storybooks")
      .insert({
        user_id: user.id,
        title: storybook.title,
        cefr_level: meta.cefrLevel,
        theme: meta.theme,
        variant: meta.variant,
        spor: meta.spor || null,
        vocabulary_focus: meta.vocabularyFocus,
        story_text: storybook.story,
        vocabulary_list: storybook.vocabulary,
        comprehension_questions: storybook.questions,
        word_count: wordCount,
      })
      .select("id")
      .single();

    setSaving(false);

    if (data && !error) {
      router.push(`/storybooks/${data.id}`);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Generer historie</h1>
        <p className="text-muted-foreground">
          Velg nivå og tema for å generere en tilpasset historie
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Form */}
        <div>
          <GeneratorForm
            themes={themes}
            onStreamStart={() => {
              setIsStreaming(true);
              setStorybook(null);
              setStreamingText("");
              setMeta(null);
            }}
            onStreaming={(text) => setStreamingText(text)}
            onGenerated={(result, generationMeta) => {
              setStorybook(result);
              setMeta(generationMeta);
              setIsStreaming(false);
            }}
          />
        </div>

        {/* Preview */}
        <div className="space-y-4">
          {storybook && (
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Lagrer..." : "Lagre historie"}
              </Button>
            </div>
          )}
          <StoryDisplay
            storybook={storybook}
            streamingText={streamingText}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
