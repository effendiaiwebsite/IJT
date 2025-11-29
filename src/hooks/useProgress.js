import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  initializeExamProgress,
  getChapterProgress,
  getAllChapterProgress,
  markTutorialComplete,
  recordTestAttempt,
  updateChapterTimeSpent,
  getUserStatistics,
  getRecentActivity,
  getAllExamProgress,
} from '../services/progressService';

/**
 * Custom hook for managing student progress
 */
export const useProgress = (examId = null, chapterId = null) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize exam progress when component mounts
  useEffect(() => {
    const initialize = async () => {
      if (!currentUser || !examId) return;

      try {
        // Initialize exam progress if not exists
        await initializeExamProgress(currentUser.uid, examId, examId);
      } catch (err) {
        console.error('Error initializing progress:', err);
      }
    };

    initialize();
  }, [currentUser, examId]);

  // Mark tutorial as completed
  const completeTutorial = useCallback(
    async (chapterName, subjectId) => {
      if (!currentUser || !examId || !chapterId) {
        throw new Error('Missing required parameters');
      }

      try {
        setLoading(true);
        setError(null);

        await markTutorialComplete(
          currentUser.uid,
          examId,
          chapterId,
          chapterName,
          subjectId
        );

        return true;
      } catch (err) {
        console.error('Error completing tutorial:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, examId, chapterId]
  );

  // Record test attempt
  const submitTest = useCallback(
    async (chapterName, subjectId, score, totalQuestions, correctAnswers) => {
      if (!currentUser || !examId || !chapterId) {
        throw new Error('Missing required parameters');
      }

      try {
        setLoading(true);
        setError(null);

        await recordTestAttempt(
          currentUser.uid,
          examId,
          chapterId,
          chapterName,
          subjectId,
          score,
          totalQuestions,
          correctAnswers
        );

        return true;
      } catch (err) {
        console.error('Error submitting test:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, examId, chapterId]
  );

  // Get current chapter progress
  const fetchChapterProgress = useCallback(async () => {
    if (!currentUser || !examId || !chapterId) return null;

    try {
      setLoading(true);
      setError(null);

      const progress = await getChapterProgress(currentUser.uid, examId, chapterId);
      return progress;
    } catch (err) {
      console.error('Error fetching chapter progress:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, examId, chapterId]);

  // Get all chapters progress for an exam
  const fetchAllChaptersProgress = useCallback(async () => {
    if (!currentUser || !examId) return {};

    try {
      setLoading(true);
      setError(null);

      const progress = await getAllChapterProgress(currentUser.uid, examId);
      return progress;
    } catch (err) {
      console.error('Error fetching all chapters progress:', err);
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
    }
  }, [currentUser, examId]);

  // Update chapter time spent
  const updateTimeSpent = useCallback(
    async (minutes) => {
      if (!currentUser || !examId || !chapterId) return;

      try {
        await updateChapterTimeSpent(currentUser.uid, examId, chapterId, minutes);
      } catch (err) {
        console.error('Error updating time spent:', err);
      }
    },
    [currentUser, examId, chapterId]
  );

  return {
    loading,
    error,
    completeTutorial,
    submitTest,
    fetchChapterProgress,
    fetchAllChaptersProgress,
    updateTimeSpent,
  };
};

/**
 * Custom hook for user statistics
 */
export const useUserStatistics = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userStats, recentActivity] = await Promise.all([
          getUserStatistics(currentUser.uid),
          getRecentActivity(currentUser.uid, 10),
        ]);

        setStats(userStats);
        setActivity(recentActivity);
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const refreshStats = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const [userStats, recentActivity] = await Promise.all([
        getUserStatistics(currentUser.uid),
        getRecentActivity(currentUser.uid, 10),
      ]);

      setStats(userStats);
      setActivity(recentActivity);
    } catch (err) {
      console.error('Error refreshing statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    stats,
    activity,
    loading,
    error,
    refreshStats,
  };
};

/**
 * Custom hook for enrolled exams
 */
export const useEnrolledExams = () => {
  const { currentUser } = useAuth();
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledExams = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all exam progress from Firestore
        const examProgress = await getAllExamProgress(currentUser.uid);

        // Fetch exam details for each enrolled exam
        const examsWithDetails = await Promise.all(
          examProgress.map(async (progress) => {
            try {
              // Load exam data from public folder
              const examId = progress.examId;

              // Try to find the exam in all levels
              const levels = ['8th-pass', '10th-pass', '12th-pass'];
              let examDetails = null;

              for (const level of levels) {
                try {
                  const response = await fetch(`/data/exams/${level}/exams-list.json`);
                  if (response.ok) {
                    const data = await response.json();
                    const found = data.exams.find((e) => e.id === examId);
                    if (found) {
                      examDetails = { ...found, level };
                      break;
                    }
                  }
                } catch (err) {
                  // Continue to next level
                  continue;
                }
              }

              return {
                ...progress,
                ...examDetails,
              };
            } catch (err) {
              console.error(`Error loading exam ${progress.examId}:`, err);
              return progress;
            }
          })
        );

        // Filter out any null results and sort by last accessed
        const validExams = examsWithDetails.filter((exam) => exam.name);
        validExams.sort((a, b) => {
          const dateA = a.lastAccessedAt?.toDate?.() || new Date(0);
          const dateB = b.lastAccessedAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });

        setEnrolledExams(validExams);
      } catch (err) {
        console.error('Error fetching enrolled exams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledExams();
  }, [currentUser]);

  const refreshExams = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const examProgress = await getAllExamProgress(currentUser.uid);

      const examsWithDetails = await Promise.all(
        examProgress.map(async (progress) => {
          try {
            const examId = progress.examId;
            const levels = ['8th-pass', '10th-pass', '12th-pass'];
            let examDetails = null;

            for (const level of levels) {
              try {
                const response = await fetch(`/data/exams/${level}/exams-list.json`);
                if (response.ok) {
                  const data = await response.json();
                  const found = data.exams.find((e) => e.id === examId);
                  if (found) {
                    examDetails = { ...found, level };
                    break;
                  }
                }
              } catch (err) {
                continue;
              }
            }

            return {
              ...progress,
              ...examDetails,
            };
          } catch (err) {
            console.error(`Error loading exam ${progress.examId}:`, err);
            return progress;
          }
        })
      );

      const validExams = examsWithDetails.filter((exam) => exam.name);
      validExams.sort((a, b) => {
        const dateA = a.lastAccessedAt?.toDate?.() || new Date(0);
        const dateB = b.lastAccessedAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setEnrolledExams(validExams);
    } catch (err) {
      console.error('Error refreshing enrolled exams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    enrolledExams,
    loading,
    error,
    refreshExams,
  };
};

export default useProgress;
