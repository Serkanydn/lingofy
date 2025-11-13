import React from "react";
import { GrammarCategoryPageClient } from "@/features/grammar/pages/GrammarCategoryPageClient";

export default function GrammarCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = React.use(params);
  return <GrammarCategoryPageClient categorySlug={categorySlug} />;
}
