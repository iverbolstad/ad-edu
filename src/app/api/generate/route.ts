import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompt";
import type { CefrLevel, Variant } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cefrLevel,
      theme,
      variant = "bokmal",
      vocabularyFocus = [],
      customInstructions,
      spor,
    } = body as {
      cefrLevel: CefrLevel;
      theme: string;
      variant?: Variant;
      vocabularyFocus?: string[];
      customInstructions?: string;
      spor?: string;
    };

    if (!cefrLevel || !theme) {
      return Response.json(
        { error: "cefrLevel og theme er påkrevd" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(variant);
    const userPrompt = buildUserPrompt({
      cefrLevel,
      theme,
      vocabularyFocus,
      customInstructions,
      spor,
    });

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            console.log("Stream event:", event.type, JSON.stringify(event).slice(0, 200));
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Generering feilet" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json(
      { error: "Intern serverfeil" },
      { status: 500 }
    );
  }
}
