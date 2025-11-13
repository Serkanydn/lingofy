import { ReadingLevelPageClient } from "@/features/reading/pages/ReadingLevelPageClient";

export default function ReadingLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  return <ReadingLevelPageClient params={params} />;
}
