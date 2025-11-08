"use client";

import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { FillBlankQuestion } from "./FillBlankQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { QuizQuestion, UserAnswer } from '../types/quiz.types';

interface QuestionRendererProps {
  question: QuizQuestion;
  userAnswer?: UserAnswer;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
  showFeedback: boolean;
}

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: QuestionRendererProps) {
  console.log('question',question);
  switch (question.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          userAnswer={userAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          showFeedback={showFeedback}
        />
      );

    case "fill_blank":
      return (
        <FillBlankQuestion
          question={question}
          userAnswer={userAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          showFeedback={showFeedback}
        />
      );

    case "true_false":
      return (
        <TrueFalseQuestion
          question={question}
          userAnswer={userAnswer}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
          showFeedback={showFeedback}
        />
      );

    default:
      return <div>Unknown question type</div>;
  }
}
