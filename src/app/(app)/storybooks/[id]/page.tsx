import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { StorybookView } from "./storybook-view";

export default async function StorybookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: storybook } = await supabase
    .from("storybooks")
    .select("*")
    .eq("id", id)
    .single();

  if (!storybook) notFound();

  return <StorybookView storybook={storybook} />;
}
