export type QuestionType = "mc" | "fb" | "tf";
export type DifficultyLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper-intermediate"
  | "advanced";

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  quiz_content_id: string;
  question_type: QuestionType;
  question_text: string;
  points: number;
  order_index: number;
  options: QuizOption[];
}

export interface QuizContent {
  id: string;
  content_type: "reading" | "listening" | "grammar";
  content_id: string;
  title: string;
  difficulty_level: DifficultyLevel;
  word_count?: number;
  questions: QuizQuestion[];
}

export interface UserAnswer {
  question_id: string;
  type: "option" | "text";
  selectedOptionId?: string | null;
  textAnswer?: string | null;
}

export interface QuizAttempt {
  id?: string;
  user_id: string;
  quiz_content_id: string;
  answers: UserAnswer[];
  total_score: number;
  max_score: number;
  percentage: number;
  completed_at?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<string, UserAnswer>;
  isSubmitted: boolean;
  showResults: boolean;
}
