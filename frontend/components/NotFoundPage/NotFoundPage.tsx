import Link from "next/link";
import styles from "./NotFoundPage.module.css";

interface NotFoundPageProps {
  code: string;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export default function NotFoundPage({
  code,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true,
  backButtonText = "Back to Home",
  backButtonHref = "/",
}: NotFoundPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>{code}</div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>

        {showBackButton && (
          <div className={styles.actions}>
            <Link href={backButtonHref} className={styles.primaryButton}>
              {backButtonText}
            </Link>
            <Link href="/quizzes" className={styles.secondaryButton}>
              Browse Quizzes
            </Link>
          </div>
        )}

        <div className={styles.suggestions}>
          <h3>You might want to:</h3>
          <ul>
            <li>Check the URL for typos</li>
            <li>Go back to the previous page</li>
            <li>Browse all available quizzes</li>
            <li>Create a new quiz</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
