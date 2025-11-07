import { QuizAnswer } from './quiz.types';

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  quiz_id: number;
  score: number;
  max_score: number;
  percentage: number;
  answers: QuizAnswer[];
  completed_at: string;
}

export interface Quiz {
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