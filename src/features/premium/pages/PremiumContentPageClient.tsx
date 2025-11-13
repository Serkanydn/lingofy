'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Crown,
  BookOpen,
  Headphones,
  GraduationCap,
  Book,
} from "lucide-react";
import { ContentCard } from "../components/ContentCard";

interface PremiumContent {
  title: string;
  description: string;
  category: string;
  icon: any;
  progress: number;
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
    difficulty: "Advanced",
    rating: 4.9,
  },
  {
    title: "IELTS Advanced Preparation",
    description: "Complete IELTS preparation with practice tests",
    category: "Exam Prep",
    icon: GraduationCap,
    progress: 65,
    difficulty: "Advanced",
    rating: 4.8,
  },
  {
    title: "Academic Writing Excellence",
    description: "Master academic writing for university level",
    category: "Writing",
    icon: BookOpen,
    progress: 20,
    difficulty: "Advanced",
    rating: 4.7,
  },
  {
    title: "Advanced Vocabulary Builder",
    description: "Expand your vocabulary with advanced techniques",
    category: "Vocabulary",
    icon: Book,
    progress: 80,
    difficulty: "Intermediate",
    rating: 4.9,
  },
];

/**
 * PremiumContentPageClient Component
 * 
 * Premium content showcase page.
 * 
 * Features:
 * - Header with upgrade button
 * - Content cards grid (2 columns)
 * - Progress indicators
 * - Locked content display
 * 
 * @component
 */
export function PremiumContentPageClient() {
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
          <ContentCard
            key={content.title}
            title={content.title}
            description={content.description}
            category={content.category}
            icon={content.icon}
            progress={content.progress}
            difficulty={content.difficulty}
            rating={content.rating}
          />
        ))}
      </div>
    </div>
  );
}
