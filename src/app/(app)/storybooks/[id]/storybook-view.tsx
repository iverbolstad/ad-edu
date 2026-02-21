"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Printer,
  Pencil,
  Save,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { Storybook, CefrLevel } from "@/types";

const cefrBadgeVariant: Record<CefrLevel, "a1" | "a2" | "b1" | "b2"> = {
  A1: "a1",
  A2: "a2",
  B1: "b1",
  B2: "b2",
};

export function StorybookView({ storybook: initial }: { storybook: Storybook }) {
  const [storybook, setStorybook] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(storybook.story_text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    setSaving(true);
    const wordCount = editText.split(/\s+/).filter(Boolean).length;

    const { error } = await supabase
      .from("storybooks")
      .update({
        story_text: editText,
        word_count: wordCount,
        is_edited: true,
      })
      .eq("id", storybook.id);

    if (!error) {
      setStorybook({ ...storybook, story_text: editText, word_count: wordCount, is_edited: true });
      setEditing(false);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Er du sikker på at du vil slette denne historien?")) return;
    setDeleting(true);

    const { error } = await supabase
      .from("storybooks")
      .delete()
      .eq("id", storybook.id);

    if (!error) {
      router.push("/dashboard");
    }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbake til bibliotek
          </Link>
          <h1 className="text-2xl font-bold">{storybook.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={cefrBadgeVariant[storybook.cefr_level]}>
              {storybook.cefr_level}
            </Badge>
            <span>{storybook.theme}</span>
            <span>·</span>
            <span>{storybook.word_count} ord</span>
            <span>·</span>
            <span>
              {new Date(storybook.created_at).toLocaleDateString("nb-NO")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="ghost" onClick={() => { setEditing(false); setEditText(storybook.story_text); }}>
                <X className="mr-2 h-4 w-4" />
                Avbryt
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lagre
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rediger
              </Button>
              <Link href={`/storybooks/${storybook.id}/print`}>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Skriv ut
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Slett
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Story */}
      <Card>
        <CardHeader>
          <CardTitle>Historie</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={15}
              className="font-serif text-base leading-relaxed"
            />
          ) : (
            <div className="prose prose-stone max-w-none">
              {storybook.story_text.split("\n\n").map((p, i) => (
                <p key={i} className="mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vocabulary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordliste</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-semibold">Ord</th>
                <th className="pb-2 text-left font-semibold">Oversettelse</th>
                <th className="pb-2 text-left font-semibold">Eksempel</th>
              </tr>
            </thead>
            <tbody>
              {storybook.vocabulary_list.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 font-medium">{item.word}</td>
                  <td className="py-2 text-muted-foreground">{item.translation}</td>
                  <td className="py-2 italic text-muted-foreground">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forståelsesspørsmål</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-3 pl-5">
            {storybook.comprehension_questions.map((q, i) => (
              <li key={i}>
                <p className="font-medium">{q.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{q.answer}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
