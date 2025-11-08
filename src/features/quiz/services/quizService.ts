import { BaseService } from "@/shared/services/supabase/baseService";
import { Quiz, QuizAttempt, QuizQuestion } from '../types/service.types';
import { QuizAnswer } from '../types/quiz.types';

export class QuizService extends BaseService<Quiz> {
  private questionsService: BaseService<QuizQuestion>;
  private attemptsService: BaseService<QuizAttempt>;

  constructor() {
    super("quiz_questions");
    this.questionsService = new BaseService<QuizQuestion>("quiz_questions");
    this.attemptsService = new BaseService<QuizAttempt>("user_quiz_attempts");
  }

  async getQuizWithQuestions(quizId: number) {
    const quiz = await this.getById(quizId);
    const { data: questions, error } = await this.supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (error) throw error;
    return { ...quiz, questions };
  }

  async submitQuizAttempt(
    quizContentId: string, 
    userId: string, 
    answers: QuizAnswer[], 
    totalScore: number, 
    maxScore: number, 
    percentage: number
  ) {
    const attempt = await this.attemptsService.create({
      user_id: userId,
      quiz_id: parseInt(quizContentId),
      score: totalScore,
      max_score: maxScore,
      percentage: percentage,
      answers: answers,
      completed_at: new Date().toISOString(),
    });

    return attempt;
  }

  async getUserAttempts(userId: string) {
    const { data, error } = await this.supabase
      .from("user_quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  private calculateScore(questions: QuizQuestion[], answers: QuizAnswer[]): number {
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter(answer => {
      const question = questions.find(q => q.id.toString() === answer.question_id);
      return question && question.correct_answer === answer.selected_option.toString();
    }).length;
    return (correctAnswers / totalQuestions) * 100;
  }

  async getQuizByContent(contentType: 'reading' | 'listening' | 'grammar', contentId: string) {
    // First get the quiz_content for this content
    const { data: quizContent, error: quizError } = await this.supabase
      .from("quiz_content")
      .select("id")
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .maybeSingle();

    if (quizError) throw quizError;
    if (!quizContent) return [];

    // Then get the questions with their options for this quiz
    const { data, error } = await this.supabase
      .from("quiz_questions")
      .select(`
        *,
        options:quiz_options(*)
      `)
      .eq("quiz_content_id", quizContent.id)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data;
  }

    async getQuizByContentId(contentType: 'reading' | 'listening' | 'grammar', id: string) {
    // First get the quiz_content for this content
    const { data: quizContent, error: quizError } = await this.supabase
      .from("quiz_content")
      .select("id")
      .eq("content_type", contentType)
      .eq("id", id)
      .maybeSingle();

    if (quizError) throw quizError;
    if (!quizContent) return [];

    // Then get the questions with their options for this quiz
    const { data, error } = await this.supabase
      .from("quiz_questions")
      .select(`
        *,
        options:quiz_options(*)
      `)
      .eq("quiz_content_id", quizContent.id)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data;
  }


  async getUserQuizHistory(userId: string) {
    const { data, error } = await this.supabase
      .from("user_quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async hasAttempted(userId: string, quizContentId: string) {
    const { data, error } = await this.supabase
      .from("user_quiz_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("quiz_id", quizContentId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
}