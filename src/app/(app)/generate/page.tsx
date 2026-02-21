import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GenerateClient } from "./generate-client";

export default async function GeneratePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order");

  return <GenerateClient themes={themes ?? []} />;
}
