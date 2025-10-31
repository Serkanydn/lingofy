import { QuizQuestion, UserAnswer } from "@/types/content.types"

export const quizValidator = {
  // Check if answer is correct
  isAnswerCorrect(question: QuizQuestion, userAnswer: UserAnswer): boolean {
    if (!userAnswer) return false

    switch (question.question_type) {
      case 'mc':
      case 'tf':
        // Check if selected option is correct
        if (!userAnswer.selectedOptionId) return false
        const selectedOption = question.options.find(
          (opt) => opt.id === userAnswer.selectedOptionId
        )
        return selectedOption?.is_correct || false

      case 'fb':
        // Check if text answer matches any correct option (case-insensitive)
        if (!userAnswer.textAnswer) return false
        const normalizedAnswer = userAnswer.textAnswer.trim().toLowerCase()
        return question.options.some(
          (opt) => opt.is_correct && opt.text.toLowerCase() === normalizedAnswer
        )

      default:
        return false
    }
  },

  // Get correct answer text
  getCorrectAnswerText(question: QuizQuestion): string {
    const correctOption = question.options.find((opt) => opt.is_correct)
    return correctOption?.text || ''
  },

  // Validate all answers
  validateAnswers(
    questions: QuizQuestion[],
    userAnswers: Record<string, UserAnswer>
  ): Record<string, boolean> {
    const results: Record<string, boolean> = {}

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id]
      results[question.id] = this.isAnswerCorrect(question, userAnswer)
    })

    return results
  },
}