import { Level } from "@/shared/types/common.types";

export const LEVEL_INFO: Record<
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
