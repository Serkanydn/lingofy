"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Headphones, Bookmark, Trophy, Crown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const features = [
  {
    icon: Book,
    title: "Reading",
    description: "Improve comprehension with engaging texts",
    href: "/reading",
    color: "text-blue-500",
  },
  {
    icon: Headphones,
    title: "Listening",
    description: "Enhance your listening skills with native speakers",
    href: "/listening",
    color: "text-green-500",
  },
  {
    icon: Headphones,
    title: "Grammar",
    description: "Master English grammar step by step",
    href: "/grammar",
    color: "text-purple-500",
  },
  {
    icon: Bookmark,
    title: "My Words",
    description: "Build your personal vocabulary collection",
    href: "/my-words",
    color: "text-orange-500",
  },
];

export default function Home() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Learn English Effectively
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Master English with
            <span className="text-primary"> Interactive Learning</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive platform for improving your English skills through
            reading, listening, and grammar practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reading">
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Track Your Progress</h2>
          <Link href="/statistics">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  View Your Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your learning journey and see how far you've come
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
