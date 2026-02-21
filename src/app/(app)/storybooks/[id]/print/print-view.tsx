"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import type { Storybook } from "@/types";

export function PrintView({ storybook }: { storybook: Storybook }) {
  const [includeAnswers, setIncludeAnswers] = useState(true);

  return (
    <>
      {/* Controls — hidden in print */}
      <div className="no-print mb-8 flex items-center justify-between">
        <Link
          href={`/storybooks/${storybook.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake
        </Link>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="rounded"
            />
            Inkluder svarark
          </label>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Skriv ut
          </Button>
        </div>
      </div>

      {/* Printable content */}
      <article className="mx-auto max-w-[210mm] print:max-w-none">
        {/* Page 1: Story */}
        <section className="print-break-after">
          <header className="mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold">{storybook.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground print:text-gray-600">
              Nivå: {storybook.cefr_level} · Tema: {storybook.theme}
            </p>
          </header>
          <div className="leading-relaxed">
            {storybook.story_text.split("\n\n").map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Page 2: Vocabulary + Questions */}
        <section className={includeAnswers ? "print-break-after" : ""}>
          {/* Vocabulary */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Ordliste</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2">
                  <th className="py-2 text-left font-semibold">Ord</th>
                  <th className="py-2 text-left font-semibold">Oversettelse</th>
                  <th className="py-2 text-left font-semibold">Eksempel</th>
                </tr>
              </thead>
              <tbody>
                {storybook.vocabulary_list.map((item, i) => (
                  <tr key={i} className="border-b print-avoid-break">
                    <td className="py-2 font-medium">{item.word}</td>
                    <td className="py-2">{item.translation}</td>
                    <td className="py-2 italic">{item.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Questions */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Forståelsesspørsmål</h2>
            <ol className="list-decimal space-y-4 pl-5">
              {storybook.comprehension_questions.map((q, i) => (
                <li key={i} className="print-avoid-break">
                  <p className="font-medium">{q.question}</p>
                  <div className="mt-2 border-b border-dashed pb-4 print:border-gray-300">
                    {/* Space for student answers when printed */}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Page 3: Answer key (optional) */}
        {includeAnswers && (
          <section>
            <h2 className="mb-4 text-xl font-bold">Svarark</h2>
            <ol className="list-decimal space-y-3 pl-5">
              {storybook.comprehension_questions.map((q, i) => (
                <li key={i} className="print-avoid-break">
                  <p className="font-medium">{q.question}</p>
                  <p className="mt-1 text-sm">{q.answer}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </>
  );
}
