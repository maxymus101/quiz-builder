import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Question {
  id?: string;
  type: "boolean" | "input" | "checkbox";
  text: string;
  options?: string[];
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
  questionCount?: number;
  createdAt?: string;
}

export const api = {
  createQuiz: async (quiz: Quiz): Promise<Quiz> => {
    const { data } = await apiClient.post("/quizzes", quiz);
    return data;
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const { data } = await apiClient.get("/quizzes");
    return data;
  },

  getQuiz: async (id: string): Promise<Quiz> => {
    const { data } = await apiClient.get(`/quizzes/${id}`);
    return data;
  },
  deleteQuiz: async (id: string): Promise<void> => {
    await apiClient.delete(`/quizzes/${id}`);
  },
};
