import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { LoadingSkeleton, ProgressBar } from '../components/common';
import { ChapterCard } from '../components/learning';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { IoCheckmarkCircle } from 'react-icons/io5';

const ChapterList = () => {
  const { examId, subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { fetchAllChaptersProgress } = useProgress(examId);

  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterProgress, setChapterProgress] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message if passed from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(true);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Load syllabus and progress data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load syllabus
        const response = await fetch(`/data/syllabi/${examId}-syllabus.json`);

        if (!response.ok) {
          throw new Error('Syllabus not found');
        }

        const syllabusData = await response.json();
        const foundSubject = syllabusData.subjects?.find((s) => s.subjectId === subjectId);

        if (!foundSubject) {
          throw new Error('Subject not found');
        }

        setSubject(foundSubject);
        setChapters(foundSubject.chapters || []);

        // Load progress from Firebase if authenticated
        if (currentUser && fetchAllChaptersProgress) {
          const progress = await fetchAllChaptersProgress();
          setChapterProgress(progress);
        }
      } catch (err) {
        console.error('Error loading chapters:', err);
        setError('Failed to load chapters. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (examId && subjectId) {
      loadData();
    }
  }, [examId, subjectId, currentUser, fetchAllChaptersProgress]);

  // Calculate subject progress
  const calculateProgress = () => {
    if (chapters.length === 0) return 0;
    const completedCount = chapters.filter(
      (ch) => {
        const progress = chapterProgress[ch.chapterId];
        return progress?.tutorialCompleted && progress?.testsAttempted > 0;
      }
    ).length;
    return (completedCount / chapters.length) * 100;
  };

  // Get chapter status
  const getChapterStatus = (chapterIndex) => {
    const chapter = chapters[chapterIndex];
    const progress = chapterProgress[chapter.chapterId];

    // Chapter is fully completed if tutorial is done AND test is taken with passing score
    if (progress?.tutorialCompleted && progress?.testsAttempted > 0 && progress?.bestScore >= 60) {
      return 'completed';
    }

    if (chapterIndex === 0) return 'current'; // First chapter always unlocked

    // Unlock next chapter when previous tutorial is completed
    // This works for both: exams with tests and exams without tests
    const previousChapter = chapters[chapterIndex - 1];
    const previousProgress = chapterProgress[previousChapter.chapterId];

    if (previousProgress?.tutorialCompleted) {
      return 'current'; // Unlocked - can start
    }

    return 'locked';
  };

  // Handle chapter actions
  const handleStartChapter = (chapter) => {
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapter.chapterId}/tutorial`);
  };

  const handleReviewChapter = (chapter) => {
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapter.chapterId}/tutorial`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="Chapters"
          subtitle="Loading..."
          showBackButton
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Progress skeleton */}
          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-gray-200 h-5 w-32 rounded mb-2 animate-pulse" />
            <div className="bg-gray-200 h-2 w-full rounded animate-pulse" />
          </div>
          {/* Chapter cards skeletons */}
          <div className="space-y-3">
            <LoadingSkeleton variant="card" count={5} />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Subject not found'}</p>
          <button
            onClick={() => navigate(`/exam/${examId}/journey`)}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Learning Journey
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const completedCount = chapters.filter((ch) => {
    const prog = chapterProgress[ch.chapterId];
    return prog?.tutorialCompleted && prog?.testsAttempted > 0;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title={subject.name}
        subtitle={`${chapters.length} chapters`}
        showBackButton
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg flex items-center gap-3"
            >
              <IoCheckmarkCircle className="w-6 h-6 text-secondary-600 flex-shrink-0" />
              <p className="text-secondary-700 font-medium">
                {location.state?.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Your Progress</h2>
              <span className="text-2xl font-bold text-primary-600">
                {progress.toFixed(0)}%
              </span>
            </div>

            <ProgressBar
              percentage={progress}
              showLabel={false}
              height="md"
              color={progress === 100 ? 'secondary' : 'primary'}
            />

            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <span>
                {completedCount}/{chapters.length} chapters completed
              </span>
              {progress === 100 && (
                <span className="text-secondary-600 font-medium">
                  ✨ Subject Complete!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Subject Description */}
        {subject.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg"
          >
            <p className="text-gray-700">{subject.description}</p>
          </motion.div>
        )}

        {/* Chapters List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Chapters</h2>

          <div className="space-y-4">
            {chapters.map((chapter, index) => {
              const status = getChapterStatus(index);
              const progress = chapterProgress[chapter.chapterId];

              return (
                <motion.div
                  key={chapter.chapterId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <ChapterCard
                    chapter={chapter}
                    status={status}
                    score={progress?.bestScore || progress?.lastAttemptScore}
                    onStart={() => handleStartChapter(chapter)}
                    onReview={() => handleReviewChapter(chapter)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 p-4 bg-secondary-50 border border-secondary-100 rounded-lg"
        >
          <p className="text-sm text-secondary-700">
            💡 <strong>Tip:</strong> Complete each chapter's tutorial to unlock the next one.
            Take the chapter tests to fully complete the chapter and track your progress.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ChapterList;
