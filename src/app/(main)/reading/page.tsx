import { Level } from "@/shared/types/common.types";
import { LevelCard } from "@/features/reading/components/LevelCard";
import { LEVEL_INFO } from "@/features/reading/constants/levels";

export default function ReadingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reading Practice</h1>
        <p className="text-muted-foreground">
          Choose your level and start reading engaging content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(LEVEL_INFO) as Level[]).map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}
