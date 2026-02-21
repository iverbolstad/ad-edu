"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Theme, CefrLevel } from "@/types";
import { Search } from "lucide-react";

const cefrLevels: CefrLevel[] = ["A1", "A2", "B1", "B2"];

export function StorybookFilters({ themes }: { themes: Theme[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/dashboard");
  }

  const hasFilters =
    searchParams.has("cefr") ||
    searchParams.has("theme") ||
    searchParams.has("search");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Søk etter tittel..."
          className="pl-9 w-56"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            const timeout = setTimeout(() => {
              updateParams("search", e.target.value);
            }, 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      {/* CEFR filter */}
      <Select
        value={searchParams.get("cefr") ?? ""}
        onChange={(e) => updateParams("cefr", e.target.value)}
      >
        <option value="">Alle nivåer</option>
        {cefrLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>

      {/* Theme filter */}
      <Select
        value={searchParams.get("theme") ?? ""}
        onChange={(e) => updateParams("theme", e.target.value)}
      >
        <option value="">Alle temaer</option>
        {themes.map((theme) => (
          <option key={theme.id} value={theme.label_nb}>
            {theme.label_nb}
          </option>
        ))}
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Nullstill
        </Button>
      )}
    </div>
  );
}
