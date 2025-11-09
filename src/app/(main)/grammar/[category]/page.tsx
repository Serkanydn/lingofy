"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useGrammarCategoryBySlug } from "@/features/admin/hooks/useGrammarCategories";
import { useGrammarByCategory, useGrammarAttempts } from "@/features/grammar/hooks/useGrammar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function GrammarCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // ✅ Unwrap the async params with React.use()
  const { category: categorySlug } = React.use(params);

  const { data: categoryInfo, isLoading: categoryLoading } = useGrammarCategoryBySlug(categorySlug);
  const { data: topics, isLoading: topicsLoading } = useGrammarByCategory(categoryInfo?.id || "");
  const { user } = useAuth();

  // Fetch user attempts for all topics in this category
  const contentIds = topics?.map((t) => t.id) || [];
  const { data: attempts } = useGrammarAttempts(contentIds, user?.id);

  // Create a map of content_id to score for quick lookup
  const scoreMap = new Map(
    attempts?.map((attempt) => [attempt.content_id, attempt.percentage]) || []
  );

  if (categoryLoading || topicsLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!categoryInfo) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/grammar">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{categoryInfo.icon}</span>
          <h1 className="text-4xl font-bold">{categoryInfo.name}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {categoryInfo.description}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {topics?.length || 0} topics available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics?.map((topic, index) => (
          <Link key={topic.id} href={`/grammar/${categorySlug}/${topic.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Topic {index + 1}
                    </span>
                  </div>
                  {scoreMap.get(topic.id) !== undefined && (
                    <Badge variant="secondary" className="font-semibold">
                      {Math.round(scoreMap.get(topic.id)!)}%
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2 line-clamp-2">
                  {topic.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {topic.explanation.substring(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Learn Now</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
