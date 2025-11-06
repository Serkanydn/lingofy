import { BaseService } from "@/shared/services/supabase/baseService";
import { QuizAnswer } from "@/features/quiz/types/quiz.types";

interface Quiz {
  id: number;
  title: string;
  description: string;
  content_id: string;
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
  time_limit?: number;
  created_at: string;
  updated_at: string;
}

interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizAttempt {
  id: number;
  user_id: string;
  quiz_id: number;
  score: number;
  max_score: number;
  percentage: number;
  answers: QuizAnswer[];
  completed_at: string;
}

export class QuizService extends BaseService<Quiz> {
  private questionsService: BaseService<QuizQuestion>;
  private attemptsService: BaseService<QuizAttempt>;

  constructor() {
    super("quizzes");
    this.questionsService = new BaseService<QuizQuestion>("quiz_questions");
    this.attemptsService = new BaseService<QuizAttempt>("quiz_attempts");
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
      .from("quiz_attempts")
      .select("*, quizzes(*)")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  private calculateScore(questions: QuizQuestion[], answers: Record<number, string>): number {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_answer).length;
    return (correctAnswers / totalQuestions) * 100;
  }

  async getQuizByContent(contentType: 'reading' | 'listening' | 'grammar', contentId: string) {
    const { data, error } = await this.supabase
      .from("quizzes")
      .select("*, quiz_questions(*)")
      .eq("type", contentType)
      .eq("content_id", contentId)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserQuizHistory(userId: string) {
    const { data, error } = await this.supabase
      .from("quiz_attempts")
      .select(`
        *,
        quizzes (
          id,
          title,
          type,
          difficulty
        )
      `)
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async hasAttempted(userId: string, quizContentId: string) {
    const { data, error } = await this.supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("quiz_id", quizContentId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
}