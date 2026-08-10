import { type ElementData } from "./element";

export type QuizMode = "symbol_to_name" | "name_to_symbol" | "find_on_table";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  element: ElementData;
  options?: string[];
}

export interface QuizStats {
  score: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  bestStreak: number;
}

export type QuizState = "setup" | "playing" | "ended";

export interface WrongAnswerRecord {
  element: ElementData;
  userAnswer: string;
  correctAnswer: string;
}
