"use client";
import { useEffect, useState } from 'react';
import styles from './ExamFeedback.module.css';

export default function ExamFeedback() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examId = localStorage.getItem('exam_id');
        if (!examId) throw new Error('Exam ID not found in local storage');

        // Use path parameter if your FastAPI endpoint is /feedback/exam/{exam_id}
        const response = await fetch(`http://localhost:8000/feedback/${examId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Fetched data:', result); // Debug the response
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err); // Log detailed error
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Exam Feedback</h1>
      {data[0]?.feedback.map((item) => (
        <div key={item.question_id} className={styles.feedbackCard}>
          <div className={styles.questionHeader}>
            <div>
              <h3 className={styles.questionTitle}>Question {item.question_id}</h3>
              <p className={styles.questionText}>{item.question}</p>
            </div>
            <span className={`${styles.scoreBadge} ${item.score > 0 ? styles.scoreGood : styles.scoreBad}`}>
              Score: {item.score}
            </span>
          </div>
          <div className={styles.answerSection}>
            <p className={styles.sectionLabel}>Your Answer:</p>
            <p className={styles.answerText}>{item.answer}</p>
          </div>
          <div className={styles.feedbackSection}>
            <p className={styles.sectionLabel}>Feedback:</p>
            <p className={styles.feedbackText}>{item.feedback}</p>
          </div>
        </div>
      ))}
    </div>
  );
}