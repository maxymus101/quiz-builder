"use client";

import { api, Quiz } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";
import EmptyState from "@/components/EmptyState/EmptyState";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const quizId = params.id as string;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await api.getQuiz(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz");
        router.push("/quizzes");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, router]);

  const handleDeleteQuiz = async () => {
    if (!quiz) return;

    try {
      await api.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      router.push("/quizzes");
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

  if (!quiz) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Quiz not found"
          message="The quiz you're looking for doesn't exist."
          actionText="Back to Quizzes"
          actionHref="/quizzes"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/quizzes" className={styles.backLink}>
            ← Back to Quizzes
          </Link>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{quiz.title}</h1>
            <p className={styles.meta}>
              {quiz.questions.length} question
              {quiz.questions.length !== 1 ? "s" : ""}
              {quiz.createdAt && (
                <> • Created: {new Date(quiz.createdAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/create" className={styles.createButton}>
            Create New Quiz
          </Link>
          <button onClick={handleDeleteQuiz} className={styles.deleteButton}>
            Delete Quiz
          </button>
        </div>
      </div>

      <div className={styles.questionsSection}>
        <h2>Questions</h2>

        {quiz.questions.length === 0 ? (
          <EmptyState
            title="No questions yet"
            message="This quiz doesn't have any questions yet."
            actionText="Edit Quiz"
            onActionClick={() => router.push(`/quizzes`)}
          />
        ) : (
          <div className={styles.questionsList}>
            {quiz.questions.map((question, index) => (
              <div key={question.id || index} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <h3 className={styles.questionNumber}>
                    Question {index + 1}
                  </h3>
                  <span className={styles.questionType}>
                    {question.type === "boolean" && "True/False"}
                    {question.type === "input" && "Text Input"}
                    {question.type === "checkbox" && "Multiple Choice"}
                  </span>
                </div>

                <p className={styles.questionText}>{question.text}</p>

                {/* Question Preview based on type */}
                <div className={styles.preview}>
                  <strong>Answer format:</strong>
                  <div className={styles.previewContent}>
                    {question.type === "boolean" && (
                      <div className={styles.booleanOptions}>
                        <label className={styles.previewOption}>
                          <input
                            type="radio"
                            name={`preview-${index}`}
                            disabled
                          />
                          True
                        </label>
                        <label className={styles.previewOption}>
                          <input
                            type="radio"
                            name={`preview-${index}`}
                            disabled
                          />
                          False
                        </label>
                      </div>
                    )}

                    {question.type === "input" && (
                      <input
                        type="text"
                        placeholder="Text input will appear here..."
                        disabled
                        className={styles.textInput}
                      />
                    )}

                    {question.type === "checkbox" && question.options && (
                      <div className={styles.checkboxOptions}>
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={styles.previewOption}
                          >
                            <input type="checkbox" disabled />
                            {option || `Option ${optionIndex + 1}`}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
