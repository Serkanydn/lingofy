import React from "react";
import { GrammarTopicPageClient } from "@/features/grammar/pages/GrammarTopicPageClient";

export default function GrammarTopicPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = React.use(params);
  return <GrammarTopicPageClient categorySlug={category} topicId={id} />;
}
