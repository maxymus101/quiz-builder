"use client";

import { api, Quiz } from "@/services/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import styles from "./page.module.css";

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

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      return;
    }

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
        <div className={styles.loading}>Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Quizzes</h1>
        <Link href="/create" className={styles.createButton}>
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No quizzes yet</h2>
          <p>Create your first quiz to get started!</p>
          <Link href="/create" className={styles.createButton}>
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className={styles.quizzesGrid}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className={styles.quizCard}>
              <div className={styles.quizContent}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <p className={styles.quizMeta}>
                  {quiz.questionCount} question
                  {quiz.questionCount !== 1 ? "s" : ""}
                </p>
                {quiz.createdAt && (
                  <p className={styles.quizDate}>
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className={styles.quizActions}>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className={styles.viewButton}
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id!, quiz.title)}
                  className={styles.deleteButton}
                  title="Delete quiz"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
