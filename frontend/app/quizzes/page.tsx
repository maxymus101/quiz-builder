"use client";

import { api, Quiz } from "@/services/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";
import EmptyState from "@/components/EmptyState/EmptyState";
import QuizCard from "@/components/QuizCard/QuizCard";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await api.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Home
        </Link>
        <h1 className={styles.title}>All Quizzes</h1>
        <Link href="/create" className={styles.createButton}>
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          message="Create your first quiz to get started!"
          actionText="Create Your First Quiz"
          actionHref="/create"
        />
      ) : (
        <div className={styles.quizzesGrid}>
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDeleteQuiz} />
          ))}
        </div>
      )}
    </div>
  );
}
