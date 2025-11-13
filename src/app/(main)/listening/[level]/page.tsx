import { ListeningLevelPageClient } from "@/features/listening/pages/ListeningLevelPageClient";

export default function ListeningLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  return <ListeningLevelPageClient params={params} />;
}
