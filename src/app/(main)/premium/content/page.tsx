"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  Crown,
  BookOpen,
  Headphones,
  GraduationCap,
  Lock,
  Star,
  Book,
} from "lucide-react";

interface PremiumContent {
  title: string;
  description: string;
  category: string;
  icon: any;
  progress: number;
  duration: string;
  completedLessons: number;
  totalLessons: number;
  features: string[];
  difficulty: string;
  rating: number;
}

const premiumContent: PremiumContent[] = [
  {
    title: "Business Communication Mastery",
    description: "Advanced professional English communication course",
    category: "Speaking & Writing",
    icon: Headphones,
    progress: 35,
    duration: "8 hours",
    completedLessons: 7,
    totalLessons: 20,
    features: [
      "Email writing templates",
      "Meeting vocabulary",
      "Presentation skills",
    ],
    difficulty: "Advanced",
    rating: 4.9,
  },
  {
    title: "IELTS Advanced Preparation",
    description: "Complete IELTS preparation with practice tests",
    category: "Exam Prep",
    icon: GraduationCap,
    progress: 65,
    duration: "12 hours",
    completedLessons: 13,
    totalLessons: 20,
    features: [
      "Full practice tests",
      "Score improvement tips",
      "Writing evaluation",
    ],
    difficulty: "Advanced",
    rating: 4.8,
  },
  {
    title: "Academic Writing Excellence",
    description: "Master academic writing for university level",
    category: "Writing",
    icon: BookOpen,
    progress: 20,
    duration: "10 hours",
    completedLessons: 4,
    totalLessons: 20,
    features: [
      "Essay structure guides",
      "Citation methods",
      "Research writing",
    ],
    difficulty: "Advanced",
    rating: 4.7,
  },
  {
    title: "Advanced Vocabulary Builder",
    description: "Expand your vocabulary with advanced techniques",
    category: "Vocabulary",
    icon: Book,
    progress: 80,
    duration: "6 hours",
    completedLessons: 16,
    totalLessons: 20,
    features: [
      "Idioms mastery",
      "Academic vocabulary",
      "Collocation practice",
    ],
    difficulty: "Intermediate",
    rating: 4.9,
  },
];

export default function PremiumContentPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Premium Content</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Exclusive learning materials available only for premium members
        </p>
        <Button
          size="lg"
          onClick={() => router.push("/premium/upgrade")}
          className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
        >
          <Crown className="mr-2 h-5 w-5" />
          Upgrade to Premium
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {premiumContent.map((content) => (
          <Card key={content.title} className="relative">
            <div className="absolute top-4 right-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <content.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {content.category}
                </span>
              </div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{content.progress}%</span>
                </div>
                <Progress value={content.progress} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {content.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{content.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}