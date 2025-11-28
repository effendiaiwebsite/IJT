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

export default useProgress;
