import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { LoadingSkeleton, ProgressBar, Button } from '../components/common';
import { TutorialSlide, PracticeQuestion } from '../components/learning';
import { IoChevronBack, IoChevronForward, IoCheckmarkCircle } from 'react-icons/io5';
import { useProgress } from '../hooks/useProgress';

const TutorialViewer = () => {
  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const { completeTutorial } = useProgress(examId, chapterId);

  const [tutorialData, setTutorialData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  // Track answers to practice questions
  const [questionResults, setQuestionResults] = useState({});

  // Load tutorial data
  useEffect(() => {
    const loadTutorial = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert subjectId to folder name format
        // e.g., "numerical-ability" stays the same
        const subjectFolder = subjectId;

        const response = await fetch(
          `/data/tutorials/${examId}/${subjectFolder}/${chapterId}/tutorials.json`
        );

        if (!response.ok) {
          throw new Error('Tutorial not found');
        }

        const data = await response.json();
        setTutorialData(data);
      } catch (err) {
        console.error('Error loading tutorial:', err);
        setError('Failed to load tutorial. This chapter may not have content yet.');
      } finally {
        setLoading(false);
      }
    };

    if (examId && subjectId && chapterId) {
      loadTutorial();
    }
  }, [examId, subjectId, chapterId]);

  // Handle question answered
  const handleQuestionAnswered = (isCorrect) => {
    const currentSlide = tutorialData.slides[currentSlideIndex];
    setQuestionResults((prev) => ({
      ...prev,
      [currentSlide.id]: isCorrect,
    }));
  };

  // Navigate to previous slide
  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Navigate to next slide
  const handleNext = () => {
    if (currentSlideIndex < tutorialData.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Complete tutorial
  const handleComplete = async () => {
    try {
      setCompleting(true);

      // Mark tutorial as completed in Firebase
      await completeTutorial(tutorialData.chapterName, subjectId);

      // Check if test exists for this chapter
      const testExists = await fetch(`/data/questions/${examId}/${subjectId}/${chapterId}/test-questions.json`)
        .then(res => res.ok)
        .catch(() => false);

      if (testExists) {
        // Navigate to chapter test if it exists
        navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapterId}/test`);
      } else {
        // Navigate back to chapters if no test exists
        navigate(`/exam/${examId}/subject/${subjectId}`, {
          state: { message: 'Tutorial completed! Continue with the next chapter.' }
        });
      }
    } catch (err) {
      console.error('Error completing tutorial:', err);
      // Navigate back to chapters on error
      navigate(`/exam/${examId}/subject/${subjectId}`);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="Tutorial"
          subtitle="Loading..."
          showBackButton
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Progress bar skeleton */}
          <div className="mb-6">
            <div className="bg-gray-200 h-2 w-full rounded animate-pulse" />
          </div>
          {/* Content skeleton */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <div className="bg-gray-200 h-6 w-3/4 rounded mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 w-full rounded animate-pulse" />
              <div className="bg-gray-200 h-4 w-5/6 rounded animate-pulse" />
              <div className="bg-gray-200 h-4 w-4/6 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !tutorialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Tutorial not found'}</p>
          <button
            onClick={() => navigate(`/exam/${examId}/subject/${subjectId}`)}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = tutorialData.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / tutorialData.slides.length) * 100;
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === tutorialData.slides.length - 1;

  // Calculate stats
  const totalQuestions = tutorialData.slides.filter((s) => s.type === 'question').length;
  const answeredQuestions = Object.keys(questionResults).length;
  const correctAnswers = Object.values(questionResults).filter((r) => r).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title={tutorialData.chapterName}
        subtitle={`Slide ${currentSlideIndex + 1} of ${tutorialData.slides.length}`}
        showBackButton
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar percentage={progress} showLabel={false} height="md" />

            {totalQuestions > 0 && (
              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span>Practice: {answeredQuestions}/{totalQuestions} answered</span>
                {answeredQuestions > 0 && (
                  <span className="text-secondary-600 font-medium">
                    {correctAnswers}/{answeredQuestions} correct
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {(currentSlide.type === 'content' || currentSlide.type === 'concept' || currentSlide.type === 'formula') ? (
              <TutorialSlide slide={currentSlide} />
            ) : (
              <PracticeQuestion
                slide={currentSlide}
                onAnswered={handleQuestionAnswered}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstSlide}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2">
              <IoChevronBack className="w-5 h-5" />
              <span>Previous</span>
            </div>
          </Button>

          {/* Next / Complete Button */}
          {isLastSlide ? (
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={completing}
              className="flex-1"
            >
              <div className="flex items-center justify-center gap-2">
                <IoCheckmarkCircle className="w-5 h-5" />
                <span>{completing ? 'Completing...' : 'Complete Tutorial'}</span>
              </div>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex-1"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Next</span>
                <IoChevronForward className="w-5 h-5" />
              </div>
            </Button>
          )}
        </div>

        {/* Help Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-lg"
        >
          <p className="text-sm text-primary-700">
            💡 <strong>Tip:</strong> Take your time to understand each concept. Practice questions help reinforce learning. You can navigate back to review previous slides anytime.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TutorialViewer;
