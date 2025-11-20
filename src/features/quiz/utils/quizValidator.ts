import { Question, UserAnswer } from "@/shared/types/model/question.types";

export const quizValidator = {
  // Check if answer is correct
  isAnswerCorrect(question: Question, userAnswer: UserAnswer): boolean {
    if (!userAnswer) return false;

    switch (question.type) {
      case "multiple_choice":
      case "true_false":
        // Check if selected option is correct
        if (!userAnswer.selectedOptionId) return false;
        const selectedOption = question.options.find(
          (opt) => opt.id === userAnswer.selectedOptionId
        );
        return selectedOption?.is_correct || false;

      case "fill_blank":
        // Check if text answer matches correct_answer (case-insensitive)
        if (!userAnswer.textAnswer) return false;

        // Parse user answer - could be JSON array or single string
        let userAnswerText = userAnswer.textAnswer.trim();
        try {
          const parsed = JSON.parse(userAnswerText);
          // If it's an array, join with spaces
          if (Array.isArray(parsed)) {
            userAnswerText = parsed.join(" ");
          }
        } catch {
          // Not JSON, use as is
        }

        const normalizedAnswer = userAnswerText.toLowerCase();

        // Check against correct_answer field if it exists
        if (question.correct_answer) {
          const correctAnswerStr = String(
            question.correct_answer
          ).toLowerCase();
          return correctAnswerStr === normalizedAnswer;
        }

        // Fallback: check against options if correct_answer is not set
        return question.options.some(
          (opt) => opt.is_correct && opt.text.toLowerCase() === normalizedAnswer
        );

      default:
        return false;
    }
  },

  // Get correct answer text
  getCorrectAnswerText(question: Question): string {
    // For fill_blank, return correct_answer field if it exists
    if (question.type === "fill_blank" && question.correct_answer) {
      return String(question.correct_answer);
    }

    // Otherwise, get from options
    const correctOption = question.options.find((opt) => opt.is_correct);
    return correctOption?.text || "";
  },

  // Validate all answers
  validateAnswers(
    questions: Question[],
    userAnswers: Record<string, UserAnswer>
  ): Record<string, boolean> {
    const results: Record<string, boolean> = {};

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      results[question.id] = this.isAnswerCorrect(question, userAnswer);
    });

    return results;
  },
};
