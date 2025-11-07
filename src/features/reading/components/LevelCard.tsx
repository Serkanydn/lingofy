"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { Level } from "@/shared/types/common.types";
import { Badge, BookOpen, Lock } from "lucide-react";
import Link from "next/link";
import { LEVEL_INFO } from "../constants/levels";
import { useReadingByLevelCount } from "../hooks/useReading";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface LevelCardProps {
  level: Level;
}

export function LevelCard({ level }: LevelCardProps) {
  const { isPremium } = useAuth();

  const { isLoading, data: totalTextCount } = useReadingByLevelCount(level);
  const totalTexts = totalTextCount ?? 0;
  const freeTexts = Math.min(10, totalTexts);

  return (
    <Link href={`/reading/${level}`} className="block">
      <Card
        className={cn(
          "hover:shadow-lg transition-shadow cursor-pointer h-full relative overflow-hidden",
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
            <div className="text-sm text-muted-foreground">Loading...</div>
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
