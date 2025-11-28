import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Progress Service - Handles all Firestore operations for tracking student progress
 */

// ========================================
// EXAM PROGRESS TRACKING
// ========================================

/**
 * Initialize or update exam progress for a user
 */
export const initializeExamProgress = async (userId, examId, examName) => {
  try {
    const examProgressRef = doc(db, 'users', userId, 'progress', examId);
    const snapshot = await getDoc(examProgressRef);

    if (!snapshot.exists()) {
      // Create new exam progress
      await setDoc(examProgressRef, {
        examId,
        examName,
        startedAt: serverTimestamp(),
        lastAccessedAt: serverTimestamp(),
        totalTimeSpent: 0,
      });
    } else {
      // Update last accessed time
      await updateDoc(examProgressRef, {
        lastAccessedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error initializing exam progress:', error);
    throw error;
  }
};

/**
 * Get exam progress for a user
 */
export const getExamProgress = async (userId, examId) => {
  try {
    const examProgressRef = doc(db, 'users', userId, 'progress', examId);
    const snapshot = await getDoc(examProgressRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }

    return null;
  } catch (error) {
    console.error('Error getting exam progress:', error);
    throw error;
  }
};

/**
 * Get all exam progress for a user
 */
export const getAllExamProgress = async (userId) => {
  try {
    const progressRef = collection(db, 'users', userId, 'progress');
    const snapshot = await getDocs(progressRef);

    const progress = [];
    snapshot.forEach((doc) => {
      progress.push({ id: doc.id, ...doc.data() });
    });

    return progress;
  } catch (error) {
    console.error('Error getting all exam progress:', error);
    throw error;
  }
};

/**
 * Update total time spent on an exam
 */
export const updateExamTimeSpent = async (userId, examId, minutesToAdd) => {
  try {
    const examProgressRef = doc(db, 'users', userId, 'progress', examId);
    await updateDoc(examProgressRef, {
      totalTimeSpent: increment(minutesToAdd),
      lastAccessedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error updating exam time spent:', error);
    throw error;
  }
};

// ========================================
// CHAPTER PROGRESS TRACKING
// ========================================

/**
 * Get chapter progress for a specific chapter
 */
export const getChapterProgress = async (userId, examId, chapterId) => {
  try {
    const chapterRef = doc(db, 'users', userId, 'progress', examId, 'chapters', chapterId);
    const snapshot = await getDoc(chapterRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }

    return null;
  } catch (error) {
    console.error('Error getting chapter progress:', error);
    throw error;
  }
};

/**
 * Get all chapter progress for an exam
 */
export const getAllChapterProgress = async (userId, examId) => {
  try {
    const chaptersRef = collection(db, 'users', userId, 'progress', examId, 'chapters');
    const snapshot = await getDocs(chaptersRef);

    const chapters = {};
    snapshot.forEach((doc) => {
      chapters[doc.id] = doc.data();
    });

    return chapters;
  } catch (error) {
    console.error('Error getting all chapter progress:', error);
    throw error;
  }
};

/**
 * Mark tutorial as completed
 */
export const markTutorialComplete = async (
  userId,
  examId,
  chapterId,
  chapterName,
  subjectId
) => {
  try {
    const chapterRef = doc(db, 'users', userId, 'progress', examId, 'chapters', chapterId);
    const snapshot = await getDoc(chapterRef);

    if (!snapshot.exists()) {
      // Create new chapter progress
      await setDoc(chapterRef, {
        chapterId,
        chapterName,
        subjectId,
        tutorialCompleted: true,
        tutorialCompletedAt: serverTimestamp(),
        testsAttempted: 0,
        bestScore: 0,
        lastAttemptScore: 0,
        lastAttemptAt: null,
        timeSpent: 0,
        notes: '',
      });
    } else {
      // Update existing chapter progress
      await updateDoc(chapterRef, {
        tutorialCompleted: true,
        tutorialCompletedAt: serverTimestamp(),
      });
    }

    // Update exam's last accessed time
    await updateDoc(doc(db, 'users', userId, 'progress', examId), {
      lastAccessedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error marking tutorial complete:', error);
    throw error;
  }
};

/**
 * Record a test attempt
 */
export const recordTestAttempt = async (
  userId,
  examId,
  chapterId,
  chapterName,
  subjectId,
  score,
  totalQuestions,
  correctAnswers
) => {
  try {
    const chapterRef = doc(db, 'users', userId, 'progress', examId, 'chapters', chapterId);
    const snapshot = await getDoc(chapterRef);

    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);

    if (!snapshot.exists()) {
      // Create new chapter progress with test attempt
      await setDoc(chapterRef, {
        chapterId,
        chapterName,
        subjectId,
        tutorialCompleted: false,
        tutorialCompletedAt: null,
        testsAttempted: 1,
        bestScore: percentageScore,
        lastAttemptScore: percentageScore,
        lastAttemptAt: serverTimestamp(),
        timeSpent: 0,
        notes: '',
      });
    } else {
      const currentData = snapshot.data();
      const newBestScore = Math.max(currentData.bestScore || 0, percentageScore);

      // Update existing chapter progress
      await updateDoc(chapterRef, {
        testsAttempted: increment(1),
        bestScore: newBestScore,
        lastAttemptScore: percentageScore,
        lastAttemptAt: serverTimestamp(),
      });
    }

    // Update exam's last accessed time
    await updateDoc(doc(db, 'users', userId, 'progress', examId), {
      lastAccessedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error recording test attempt:', error);
    throw error;
  }
};

/**
 * Update chapter time spent
 */
export const updateChapterTimeSpent = async (userId, examId, chapterId, minutesToAdd) => {
  try {
    const chapterRef = doc(db, 'users', userId, 'progress', examId, 'chapters', chapterId);
    const snapshot = await getDoc(chapterRef);

    if (snapshot.exists()) {
      await updateDoc(chapterRef, {
        timeSpent: increment(minutesToAdd),
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating chapter time spent:', error);
    throw error;
  }
};

/**
 * Update chapter notes
 */
export const updateChapterNotes = async (userId, examId, chapterId, notes) => {
  try {
    const chapterRef = doc(db, 'users', userId, 'progress', examId, 'chapters', chapterId);
    await updateDoc(chapterRef, {
      notes,
    });

    return true;
  } catch (error) {
    console.error('Error updating chapter notes:', error);
    throw error;
  }
};

// ========================================
// STATISTICS & ANALYTICS
// ========================================

/**
 * Get overall user statistics
 */
export const getUserStatistics = async (userId) => {
  try {
    // Get all exam progress
    const examProgress = await getAllExamProgress(userId);

    let totalExams = examProgress.length;
    let totalChaptersCompleted = 0;
    let totalTestsAttempted = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    let totalStudyTime = 0;
    let threeStarTests = 0;

    // Aggregate statistics from all exams
    for (const exam of examProgress) {
      totalStudyTime += exam.totalTimeSpent || 0;

      // Get chapter progress for each exam
      const chapters = await getAllChapterProgress(userId, exam.examId);

      Object.values(chapters).forEach((chapter) => {
        if (chapter.tutorialCompleted) {
          totalChaptersCompleted++;
        }

        if (chapter.testsAttempted > 0) {
          totalTestsAttempted += chapter.testsAttempted;
          totalScoreSum += chapter.lastAttemptScore || 0;
          totalScoreCount++;

          if (chapter.bestScore >= 85) {
            threeStarTests++;
          }
        }
      });
    }

    const averageScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;

    return {
      totalExams,
      totalChaptersCompleted,
      totalTestsAttempted,
      averageScore,
      totalStudyTime,
      threeStarTests,
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw error;
  }
};

/**
 * Get recent activity for a user
 */
export const getRecentActivity = async (userId, limitCount = 10) => {
  try {
    const activity = [];

    // Get all exam progress
    const examProgress = await getAllExamProgress(userId);

    // Get recent chapters from all exams
    for (const exam of examProgress) {
      const chapters = await getAllChapterProgress(userId, exam.examId);

      Object.entries(chapters).forEach(([chapterId, chapter]) => {
        if (chapter.tutorialCompletedAt) {
          activity.push({
            id: `tutorial-${exam.examId}-${chapterId}`,
            type: 'tutorial',
            examId: exam.examId,
            examName: exam.examName,
            chapterId,
            chapterName: chapter.chapterName,
            completed: true,
            date: chapter.tutorialCompletedAt,
          });
        }

        if (chapter.lastAttemptAt) {
          activity.push({
            id: `test-${exam.examId}-${chapterId}-${chapter.testsAttempted}`,
            type: 'test',
            examId: exam.examId,
            examName: exam.examName,
            chapterId,
            chapterName: chapter.chapterName,
            score: chapter.lastAttemptScore,
            stars: chapter.lastAttemptScore >= 85 ? 3 : chapter.lastAttemptScore >= 70 ? 2 : 1,
            date: chapter.lastAttemptAt,
          });
        }
      });
    }

    // Sort by date (most recent first) and limit
    activity.sort((a, b) => {
      const dateA = a.date?.toDate?.() || new Date(0);
      const dateB = b.date?.toDate?.() || new Date(0);
      return dateB - dateA;
    });

    return activity.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting recent activity:', error);
    throw error;
  }
};

/**
 * Calculate exam completion percentage
 */
export const calculateExamCompletion = async (userId, examId, totalChapters) => {
  try {
    const chapters = await getAllChapterProgress(userId, examId);

    const completedChapters = Object.values(chapters).filter(
      (chapter) => chapter.tutorialCompleted && chapter.testsAttempted > 0
    ).length;

    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  } catch (error) {
    console.error('Error calculating exam completion:', error);
    throw error;
  }
};

/**
 * Get subject-wise progress for an exam
 */
export const getSubjectProgress = async (userId, examId, subjectId, totalChaptersInSubject) => {
  try {
    const allChapters = await getAllChapterProgress(userId, examId);

    // Filter chapters for this subject
    const subjectChapters = Object.values(allChapters).filter(
      (chapter) => chapter.subjectId === subjectId
    );

    const completedChapters = subjectChapters.filter(
      (chapter) => chapter.tutorialCompleted
    ).length;

    return {
      totalChapters: totalChaptersInSubject,
      completedChapters,
      percentage: totalChaptersInSubject > 0
        ? Math.round((completedChapters / totalChaptersInSubject) * 100)
        : 0,
    };
  } catch (error) {
    console.error('Error getting subject progress:', error);
    throw error;
  }
};

export default {
  initializeExamProgress,
  getExamProgress,
  getAllExamProgress,
  updateExamTimeSpent,
  getChapterProgress,
  getAllChapterProgress,
  markTutorialComplete,
  recordTestAttempt,
  updateChapterTimeSpent,
  updateChapterNotes,
  getUserStatistics,
  getRecentActivity,
  calculateExamCompletion,
  getSubjectProgress,
};
