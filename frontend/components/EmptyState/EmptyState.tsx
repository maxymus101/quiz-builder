import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        {actionText &&
          (actionHref ? (
            <Link href={actionHref} className={styles.actionButton}>
              {actionText}
            </Link>
          ) : (
            <button onClick={onActionClick} className={styles.actionButton}>
              {actionText}
            </button>
          ))}
      </div>
    </div>
  );
}
