"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReadingByLevel } from "@/shared/hooks/useReading";
import { useAuthStore } from "@/shared/lib/store/authStore";
import { cn } from "@/shared/lib/utils";
import { Level } from "@/shared/types/common.types";
import { Badge, BookOpen, Lock } from "lucide-react";
import Link from "next/link";

const LEVEL_INFO: Record<
  Level,
  {
    name: string;
    description: string;
    color: string;
  }
> = {
  A1: {
    name: "Beginner",
    description: "Basic everyday topics, short sentences",
    color: "bg-green-100 text-green-800",
  },
  A2: {
    name: "Elementary",
    description: "Daily life stories and simple conversations",
    color: "bg-blue-100 text-blue-800",
  },
  B1: {
    name: "Intermediate",
    description: "Work, travel, and social topics",
    color: "bg-yellow-100 text-yellow-800",
  },
  B2: {
    name: "Upper-Intermediate",
    description: "Technical texts and articles",
    color: "bg-orange-100 text-orange-800",
  },
  C1: {
    name: "Advanced",
    description: "Academic and professional content",
    color: "bg-red-100 text-red-800",
  },
};

function LevelCard({ level }: { level: Level }) {
  const isPremium = useAuthStore((state) => state.isPremium());
  const { data: readings, isLoading } = useReadingByLevel(level);
  console.log('readings',readings);
  const totalTexts = readings?.length ?? 0;
  const freeTexts = Math.min(10, totalTexts);

  return (
    <Link href={`/reading/${level}`} className="block">
      <Card
        className={cn(
          "hover:shadow-lg transition-shadow cursor-pointer h-full",
          !isPremium && totalTexts > freeTexts && "relative overflow-hidden"
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={LEVEL_INFO[level].color}>{level}</Badge>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2">{LEVEL_INFO[level].name}</CardTitle>
          <CardDescription>{LEVEL_INFO[level].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isPremium
                  ? `${totalTexts} texts available`
                  : `${freeTexts} free texts${
                      totalTexts > freeTexts ? ` out of ${totalTexts}` : ""
                    }`}
              </span>
              {!isPremium && totalTexts > freeTexts && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

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
