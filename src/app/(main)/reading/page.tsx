import { Level } from "@/shared/types/common.types";
import { LevelCard } from "@/features/reading/components/LevelCard";
import { LEVEL_INFO } from "@/features/reading/constants/levels";

export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Reading Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a level to start practicing your reading skills.
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
