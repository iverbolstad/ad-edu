"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";
import type { CefrLevel, Variant, Theme, GeneratedStorybook } from "@/types";
import { generatedStorybookSchema } from "@/lib/ai/schema";

const cefrLevels: { value: CefrLevel; label: string; color: string }[] = [
  { value: "A1", label: "A1", color: "bg-cefr-a1" },
  { value: "A2", label: "A2", color: "bg-cefr-a2" },
  { value: "B1", label: "B1", color: "bg-cefr-b1" },
  { value: "B2", label: "B2", color: "bg-cefr-b2" },
];

interface GeneratorFormProps {
  themes: Theme[];
  onGenerated: (storybook: GeneratedStorybook, meta: {
    cefrLevel: CefrLevel;
    theme: string;
    variant: Variant;
    spor: string;
    vocabularyFocus: string[];
  }) => void;
  onStreaming: (text: string) => void;
  onStreamStart: () => void;
}

export function GeneratorForm({
  themes,
  onGenerated,
  onStreaming,
  onStreamStart,
}: GeneratorFormProps) {
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>("A1");
  const [theme, setTheme] = useState(themes[0]?.label_nb ?? "");
  const [variant, setVariant] = useState<Variant>("bokmal");
  const [spor, setSpor] = useState("");
  const [vocabularyFocus, setVocabularyFocus] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    onStreamStart();

    const vocabArray = vocabularyFocus
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cefrLevel,
          theme,
          variant,
          spor: spor || undefined,
          vocabularyFocus: vocabArray.length > 0 ? vocabArray : undefined,
          customInstructions: customInstructions || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Generering feilet");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Ingen respons");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                setError(parsed.error);
                break;
              }
              if (parsed.text) {
                fullText += parsed.text;
                onStreaming(fullText);
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }

      // Parse the complete response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Kunne ikke tolke AI-responsen");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const validated = generatedStorybookSchema.parse(parsed);

      onGenerated(validated as GeneratedStorybook, {
        cefrLevel,
        theme,
        variant,
        spor,
        vocabularyFocus: vocabArray,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* CEFR Level */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">CEFR-nivå</Label>
        <div className="flex gap-2">
          {cefrLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setCefrLevel(level.value)}
              className={cn(
                "flex h-12 w-16 items-center justify-center rounded-lg text-sm font-bold transition-all",
                cefrLevel === level.value
                  ? `${level.color} text-white shadow-md scale-105`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label htmlFor="theme">Tema</Label>
        <Select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themes.map((t) => (
            <option key={t.id} value={t.label_nb}>
              {t.label_nb}
            </option>
          ))}
        </Select>
      </div>

      {/* Variant toggle */}
      <div className="space-y-2">
        <Label>Målform</Label>
        <div className="flex gap-2">
          {(["bokmal", "nynorsk"] as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                variant === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {v === "bokmal" ? "Bokmål" : "Nynorsk"}
            </button>
          ))}
        </div>
      </div>

      {/* Spor (optional) */}
      <div className="space-y-2">
        <Label htmlFor="spor">Spor (valgfritt)</Label>
        <Select
          id="spor"
          value={spor}
          onChange={(e) => setSpor(e.target.value)}
        >
          <option value="">Ikke valgt</option>
          <option value="1">Spor 1</option>
          <option value="2">Spor 2</option>
          <option value="3">Spor 3</option>
        </Select>
      </div>

      {/* Vocabulary focus */}
      <div className="space-y-2">
        <Label htmlFor="vocab">Ordforråd-fokus (valgfritt)</Label>
        <Textarea
          id="vocab"
          placeholder="Skriv ord separert med komma, f.eks: butikk, handle, pris, betale"
          value={vocabularyFocus}
          onChange={(e) => setVocabularyFocus(e.target.value)}
          rows={2}
        />
      </div>

      {/* Custom instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions">Ekstra instruksjoner (valgfritt)</Label>
        <Textarea
          id="instructions"
          placeholder="F.eks: Bruk dialogform, inkluder en komisk situasjon..."
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Genererer...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generer historie
          </>
        )}
      </Button>
    </form>
  );
}
