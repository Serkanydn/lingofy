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
    description: "Understand and use familiar everyday expressions.",
    color: "bg-green-100 text-green-800",
    icon: "🔥",
    iconBg: "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  A2: {
    name: "Elementary",
    description: "Understand sentences and frequently used expressions related to areas of most immediate relevance.",
    color: "bg-blue-100 text-blue-800",
    icon: "🚀",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  B1: {
    name: "Intermediate",
    description: "Understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc.",
    color: "bg-yellow-100 text-yellow-800",
    icon: "🎯",
    iconBg: "bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  B2: {
    name: "Upper-Intermediate",
    description: "Understand the main ideas of complex text on both concrete and abstract topics.",
    color: "bg-orange-100 text-orange-800",
    icon: "🎓",
    iconBg: "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  C1: {
    name: "Advanced",
    description: "Understand a wide range of demanding, longer texts, and recognise implicit meaning.",
    color: "bg-red-100 text-red-800",
    icon: "🚀",
    iconBg: "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
  C2: {
    name: "Proficient",
    description: "Understand with ease virtually everything heard or read. Express everything fluently and precisely from different sources.",
    color: "bg-purple-100 text-purple-800",
    icon: "⭐",
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10",
    titleColor: "text-orange-500 dark:text-orange-400",
  },
};
