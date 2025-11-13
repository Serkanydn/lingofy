'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock, Star, LucideIcon } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  progress: number;
  difficulty: string;
  rating: number;
}

/**
 * ContentCard Component
 * 
 * Displays premium content card with:
 * - Lock icon (for locked content)
 * - Category icon and label
 * - Title and description
 * - Progress bar
 * - Difficulty and rating
 * 
 * @component
 */
export function ContentCard({
  title,
  description,
  category,
  icon: Icon,
  progress,
  difficulty,
  rating,
}: ContentCardProps) {
  return (
    <Card className="relative">
      <div className="absolute top-4 right-4">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            {category}
          </span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {difficulty}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
