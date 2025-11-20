import { BaseService } from "@/shared/services/supabase/baseService";
import { Question, QuizAnswer } from "../../types/model/question.types";
import { UserQuestionAttempt } from "@/shared/types/model/user.types";

class QuizService extends BaseService<Question> {
  private attemptsService: BaseService<UserQuestionAttempt>;

  constructor() {
    super("questions");
    this.attemptsService = new BaseService<UserQuestionAttempt>(
      "user_question_attempts"
    );
  }

  async getQuizWithQuestions(quizId: number) {
    const quiz = await this.getById(quizId);
    const { data: questions, error } = await this.supabase
      .from("questions")
      .select("*")
      .eq("content_id", quizId);

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
      content_id: quizContentId,
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
      .from("user_question_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getQuizByContent(id: string) {
    // Then get the questions with their options for this quiz
    const { data, error } = await this.supabase
      .from("questions")
      .select(
        `
        *,
        options:question_options(*)
      `
      )
      .eq("content_id", id)
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getQuizByQuizId(id: string) {
    // Then get the questions with their options for this quiz
    const { data, error } = await this.supabase
      .from("questions")
      .select(
        `
        *,
        options:question_options(*)
      `
      )
      .eq("content_id", id)
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getQuizByContentId(id: string) {
    console.log("id", id);
    // Then get the questions with their options for this quiz
    const { data, error } = await this.supabase
      .from("questions")
      .select(
        `
        *,
        options:question_options(*)
      `
      )
      .eq("content_id", id)
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getUserQuizHistory(userId: string) {
    const { data, error } = await this.supabase
      .from("user_question_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async hasAttempted(userId: string, quizContentId: string) {
    const { data, error } = await this.supabase
      .from("user_question_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", quizContentId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  async getUserAttemptsByContentIds(userId: string, contentIds: string[]) {
    const { data, error } = await this.supabase
      .from("user_question_attempts")
      .select("content_id, percentage, score, max_score, completed_at")
      .eq("user_id", userId)
      .in("content_id", contentIds)
      .order("completed_at", { ascending: false });

    if (error) throw error;

    // Return only the latest attempt for each content_id
    const latestAttempts = new Map();
    data?.forEach((attempt) => {
      if (!latestAttempts.has(attempt.content_id)) {
        latestAttempts.set(attempt.content_id, attempt);
      }
    });

    return Array.from(latestAttempts.values());
  }
}

export const quizService = new QuizService();
