import { Level } from "@/shared/types/model/common.types";

export const LEVEL_INFO: Record<
  Level,
  {
    name: string;
    description: string;
    color: string;
    icon: string;
    iconBg: string;
    titleColor: string;
  }
> = {
  A1: {
    name: "Beginner",
    description: "Basic listening exercises with simple vocabulary and slow, clear speech.",
    color: "bg-green-100 text-green-800",
    icon: "🎧",
    iconBg: "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  A2: {
    name: "Elementary",
    description: "Elementary listening practice with everyday topics and clear pronunciation.",
    color: "bg-blue-100 text-blue-800",
    icon: "🔊",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  B1: {
    name: "Intermediate",
    description: "Intermediate listening exercises with natural speech and varied topics.",
    color: "bg-yellow-100 text-yellow-800",
    icon: "🎵",
    iconBg: "bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  B2: {
    name: "Upper-Intermediate",
    description: "Upper intermediate content with complex topics and natural conversation.",
    color: "bg-orange-100 text-orange-800",
    icon: "🎙️",
    iconBg: "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  C1: {
    name: "Advanced",
    description: "Advanced listening practice with challenging content and authentic materials.",
    color: "bg-red-100 text-red-800",
    icon: "🎼",
    iconBg: "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  C2: {
    name: "Proficient",
    description: "Master-level listening comprehension with complex and nuanced audio content.",
    color: "bg-purple-100 text-purple-800",
    icon: "🏆",
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
};
