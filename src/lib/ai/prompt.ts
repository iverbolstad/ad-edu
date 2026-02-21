import type { CefrLevel, Variant } from "@/types";

interface CefrConstraints {
  headwords: string;
  maxSentenceLength: string;
  tenses: string;
  storyLength: string;
}

const CEFR_CONSTRAINTS: Record<CefrLevel, CefrConstraints> = {
  A1: {
    headwords: "~500 mest brukte ord",
    maxSentenceLength: "5–8 ord per setning",
    tenses: "Kun presens (nåtid)",
    storyLength: "150–250 ord",
  },
  A2: {
    headwords: "~1000 mest brukte ord",
    maxSentenceLength: "8–12 ord per setning",
    tenses: "Presens og preteritum",
    storyLength: "250–400 ord",
  },
  B1: {
    headwords: "~2000 ord",
    maxSentenceLength: "Opptil ~15 ord per setning",
    tenses: "Presens, preteritum og perfektum",
    storyLength: "400–600 ord",
  },
  B2: {
    headwords: "Bredt ordforråd",
    maxSentenceLength: "Komplekse setninger tillatt",
    tenses: "Alle tidsformer",
    storyLength: "600–900 ord",
  },
};

export function buildSystemPrompt(variant: Variant): string {
  const lang = variant === "bokmal" ? "bokmål" : "nynorsk";

  return `Du er en ekspert på norskopplæring for voksne innvandrere. Du lager pedagogiske historier tilpasset CEFR-nivå.

VIKTIGE REGLER:
- Skriv ALLTID på norsk ${lang}
- Hold deg STRENGT til de angitte CEFR-begrensningene
- Historiene skal være engasjerende, kulturelt relevante og realistiske
- Bruk hverdagslige situasjoner som voksne innvandrere i Norge kan kjenne seg igjen i
- Unngå barnlige temaer — målgruppen er voksne
- Ordlisten skal inneholde ord som kan være nye for studenter på det gitte nivået
- Forståelsesspørsmålene skal teste faktisk forståelse av teksten, ikke bare hukommelse

OUTPUTFORMAT:
Du MÅ svare med gyldig JSON i følgende format (ingen annen tekst):
{
  "title": "Tittel på historien",
  "story": "Selve historieteksten med avsnitt adskilt med \\n\\n",
  "vocabulary": [
    {"word": "ordet", "translation": "oversettelse til engelsk", "example": "eksempelsetning fra historien"}
  ],
  "questions": [
    {"question": "Spørsmål om historien?", "answer": "Fullstendig svar."}
  ]
}

Ordlisten skal ha 8–12 ord.
Spørsmålene skal være 4–6 stykker.`;
}

export function buildUserPrompt(params: {
  cefrLevel: CefrLevel;
  theme: string;
  vocabularyFocus?: string[];
  customInstructions?: string;
  spor?: string;
}): string {
  const constraints = CEFR_CONSTRAINTS[params.cefrLevel];

  let prompt = `Lag en historie med følgende krav:

CEFR-NIVÅ: ${params.cefrLevel}
- Ordforråd: ${constraints.headwords}
- Setningslengde: ${constraints.maxSentenceLength}
- Tidsformer: ${constraints.tenses}
- Historielengde: ${constraints.storyLength}

TEMA: ${params.theme}`;

  if (params.spor) {
    prompt += `\nSPOR: ${params.spor} (tilpass kompleksitet til dette sporet i norskopplæringen)`;
  }

  if (params.vocabularyFocus && params.vocabularyFocus.length > 0) {
    prompt += `\n\nINKLUDER DISSE ORDENE i historien: ${params.vocabularyFocus.join(", ")}`;
  }

  if (params.customInstructions) {
    prompt += `\n\nEKSTRA INSTRUKSJONER: ${params.customInstructions}`;
  }

  return prompt;
}
