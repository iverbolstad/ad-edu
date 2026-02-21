import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen } from "lucide-react";
import type { CefrLevel, Storybook } from "@/types";
import { StorybookFilters } from "@/components/storybook-filters";

const cefrBadgeVariant: Record<CefrLevel, "a1" | "a2" | "b1" | "b2"> = {
  A1: "a1",
  A2: "a2",
  B1: "b1",
  B2: "b2",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cefr?: string; theme?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  let query = supabase
    .from("storybooks")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.cefr) {
    query = query.eq("cefr_level", params.cefr);
  }
  if (params.theme) {
    query = query.eq("theme", params.theme);
  }
  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data: storybooks } = await query;
  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bibliotek</h1>
          <p className="text-muted-foreground">
            Dine lagrede historier
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ny historie
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <StorybookFilters themes={themes ?? []} />

      {/* Grid */}
      {!storybooks || storybooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold">Ingen historier ennå</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Lag din første historie for å komme i gang.
          </p>
          <Link href="/generate">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Lag historie
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storybooks.map((book: Storybook) => (
            <Link key={book.id} href={`/storybooks/${book.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {book.title}
                    </CardTitle>
                    <Badge variant={cefrBadgeVariant[book.cefr_level]}>
                      {book.cefr_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{book.theme}</span>
                    <span>·</span>
                    <span>{book.word_count} ord</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(book.created_at).toLocaleDateString("nb-NO")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
