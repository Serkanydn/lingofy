import {
  Question,
  UserAnswer,
} from "../../../shared/types/model/question.types";
import { quizValidator } from "./quizValidator";

export const scoreCalculator = {
  // Calculate total score
  calculateScore(
    questions: Question[],
    userAnswers: Record<string, UserAnswer>
  ): { totalScore: number; maxScore: number; percentage: number } {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      maxScore += question.points!;
      const userAnswer = userAnswers[question.id];

      if (quizValidator.isAnswerCorrect(question, userAnswer)) {
        totalScore += question.points!;
      }
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100, // 2 decimal places
    };
  },

  // Get performance level
  getPerformanceLevel(percentage: number): {
    level: string;
    color: string;
    message: string;
  } {
    if (percentage >= 90) {
      return {
        level: "Excellent",
        color: "text-green-600",
        message: "Outstanding! 🎉",
      };
    } else if (percentage >= 80) {
      return {
        level: "Very Good",
        color: "text-blue-600",
        message: "Great job! 👍",
      };
    } else if (percentage >= 70) {
      return {
        level: "Good",
        color: "text-yellow-600",
        message: "Well done! 😊",
      };
    } else if (percentage >= 60) {
      return {
        level: "Pass",
        color: "text-orange-600",
        message: "You passed! Keep practicing! 💪",
      };
    } else {
      return {
        level: "Needs Improvement",
        color: "text-red-600",
        message: "Keep trying! Practice makes perfect! 📚",
      };
    }
  },
};
