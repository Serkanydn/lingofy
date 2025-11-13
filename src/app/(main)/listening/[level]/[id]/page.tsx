import { ListeningDetailPageClient } from "@/features/listening/pages/ListeningDetailPageClient";

export default function ListeningDetailPage({
  params,
}: {
  params: Promise<{ level: string; id: string }>;
}) {
  return <ListeningDetailPageClient params={params} />;
}
