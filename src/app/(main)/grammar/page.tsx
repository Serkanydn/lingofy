"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useActiveGrammarCategories } from "@/features/admin/hooks/useGrammarCategories";

export default function GrammarPage() {
  const { data: categories, isLoading } = useActiveGrammarCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Grammar Practice</h1>
        <p className="text-muted-foreground">
          All grammar topics are free for everyone! Choose a category to start
          learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.map((category) => (
          <Link key={category.id} href={`/grammar/${category.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{category.icon}</span>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl mt-2">{category.name}</CardTitle>
                <CardDescription className="text-base">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary font-medium">
                  Click to explore topics →
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✨</div>
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Grammar is Free for Everyone!
            </h3>
            <p className="text-muted-foreground">
              We believe grammar is essential for learning English. That's why
              all grammar topics, explanations, and quizzes are completely free.
              No premium subscription needed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
