import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Quiz Builder</h1>
        <p className={styles.text}>
          Create your interesting quizzes and share to friends
        </p>
        <div className={styles.links_container}>
          <Link href="/create" className={styles.create_button}>
            Let&apos;s get started
          </Link>
          <Link href="/quizzes" className={styles.list_button}>
            List of Quizes
          </Link>
        </div>
      </div>
    </div>
  );
}
