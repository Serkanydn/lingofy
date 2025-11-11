import { Level } from "@/shared/types/common.types";
import { LevelCard } from "@/features/listening/components/LevelCard";
import { LEVEL_INFO } from "@/features/listening/constants/levels";

export default function ListeningPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Listening Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a level to start practicing your listening skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(LEVEL_INFO) as Level[]).map((level) => (
            <LevelCard key={level} level={level} />
          ))}
        </div>
      </div>
    </div>
  );
}