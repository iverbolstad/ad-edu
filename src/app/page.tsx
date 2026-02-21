import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Printer, Library } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Storybook Generator</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Logg inn</Button>
            </Link>
            <Link href="/signup">
              <Button>Kom i gang</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Tilpassede historier for
            <span className="text-primary"> norskopplæring</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Generer historier tilpasset CEFR-nivå med ordliste og
            forståelsesspørsmål. Spar tid og gi elevene dine engasjerende
            lesestoff.
          </p>
          <Link href="/signup">
            <Button size="lg" className="mt-4">
              Start gratis
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mx-auto mt-24 grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">AI-generert</h3>
            <p className="text-sm text-muted-foreground">
              Historier tilpasset CEFR-nivå med kontrollert vokabular og
              setningslengde.
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Library className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Ditt bibliotek</h3>
            <p className="text-sm text-muted-foreground">
              Lagre, rediger og organiser alle historiene dine på ett sted.
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Printer className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Utskriftsvennlig</h3>
            <p className="text-sm text-muted-foreground">
              Skriv ut med A4-format, ordliste og svarark — klar til
              klasserommet.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Storybook Generator for voksenopplæring
      </footer>
    </div>
  );
}
