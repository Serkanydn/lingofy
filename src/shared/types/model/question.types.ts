import { ContentType } from "../enums/contentType.enum";
import { QuestionType } from "../enums/question.enum";
import { BaseEntity } from "./base.type";

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question extends BaseEntity {
  content_id: string;
  text: string;
  options: QuestionOption[];
  points: number;
  order: number;
  type: QuestionType;
}

export interface QuestionOption extends BaseEntity {
  question_id: string;
  text: string;
  is_correct: boolean;
}

export interface CreateQuestionOption {
  text: string;
  is_correct: boolean;
}

export interface CreateQuestion {
  content_id: string;
  text: string;
  options: CreateQuestionOption[];
  points: number;
  order: number;
  type: QuestionType;
  correct_answer?: string;
}

export type UserAnswer = {
  question_id: string;
  type: "option" | "text";
  selectedOptionId?: string | null;
  textAnswer?: string | null;
};

export type QuizState = {
  currentQuestionIndex: number;
  userAnswers: Record<string, UserAnswer>;
  isSubmitted: boolean;
  showResults: boolean;
};

export type QuizResult = {
  id: string;
  user_id: string;
  content_id: string;
  content_type: ContentType;
  score: number;
  total_questions: number;
  answers: QuizAnswer[];
  created_at: string;
};

export type QuizAnswer = {
  question_id: string;
  selected_option: number;
  is_correct?: boolean;
  time_taken: number;
};

export type QuizSubmission = {
  contentType: ContentType;
  contentId: string;
  score: number;
  maxScore: number;
  totalQuestions: number;
  answers: QuizAnswer[];
};

// -------------
