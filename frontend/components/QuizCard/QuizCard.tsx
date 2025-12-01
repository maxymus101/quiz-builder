import Link from "next/link";
import { Quiz } from "@/services/api";
import styles from "./QuizCard.module.css";

interface QuizCardProps {
  quiz: Quiz;
  onDelete: (quizId: string, quizTitle: string) => void;
}

export default function QuizCard({ quiz, onDelete }: QuizCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{quiz.title}</h3>
        <p className={styles.meta}>
          {quiz.questionCount} question{quiz.questionCount !== 1 ? "s" : ""}
        </p>
        {quiz.createdAt && (
          <p className={styles.date}>
            Created: {new Date(quiz.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <Link href={`/quizzes/${quiz.id}`} className={styles.viewButton}>
          View Details
        </Link>
        <button
          onClick={() => onDelete(quiz.id!, quiz.title)}
          className={styles.deleteButton}
          title="Delete quiz"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
