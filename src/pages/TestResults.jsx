import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/navigation';
import { Button, Card } from '../components/common';
import { IoCheckmarkCircle, IoCloseCircle, IoStar, IoStarOutline, IoRefresh, IoBook, IoArrowForward, IoList } from 'react-icons/io5';
import { useProgress } from '../hooks/useProgress';

const TestResults = () => {
  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { submitTest } = useProgress(examId, chapterId);
  const [progressSaved, setProgressSaved] = useState(false);

  // Get results from navigation state
  const {
    testData,
    answers,
    correctAnswers,
    totalQuestions,
    earnedMarks,
    totalMarks,
    percentage,
  } = location.state || {};

  // Redirect if no results data
  useEffect(() => {
    if (!testData || !answers) {
      navigate(`/exam/${examId}/subject/${subjectId}`);
    }
  }, [testData, answers, examId, subjectId, navigate]);

  // Save test results to Firebase
  useEffect(() => {
    const saveProgress = async () => {
      if (!testData || !answers || progressSaved) return;

      try {
        await submitTest(
          testData.chapterName,
          subjectId,
          percentage,
          totalQuestions,
          correctAnswers
        );
        setProgressSaved(true);
      } catch (err) {
        console.error('Error saving test progress:', err);
        // Continue even if progress saving fails
      }
    };

    saveProgress();
  }, [testData, answers, submitTest, subjectId, percentage, totalQuestions, correctAnswers, progressSaved]);

  if (!testData || !answers) {
    return null; // Will redirect
  }

  // Calculate stats
  const incorrectAnswers = Object.values(answers).filter(
    (answer, index) => answer !== null && answer !== testData.questions[index]?.correctAnswer
  ).length;
  const unansweredQuestions = totalQuestions - correctAnswers - incorrectAnswers;

  // Determine pass/fail (60% is passing)
  const passed = percentage >= 60;

  // Get star rating
  const getStarRating = () => {
    if (percentage >= 85) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 60) return 1;
    return 0;
  };

  const stars = getStarRating();

  // Get motivational message
  const getMessage = () => {
    if (percentage >= 85) {
      return {
        title: 'Outstanding Performance! 🎉',
        message: 'Excellent work! You have mastered this chapter. Keep up the great work!',
        color: 'secondary',
      };
    } else if (percentage >= 70) {
      return {
        title: 'Great Job! 👏',
        message: 'Very good performance! With a bit more practice, you can achieve excellence.',
        color: 'secondary',
      };
    } else if (percentage >= 60) {
      return {
        title: 'Well Done! ✅',
        message: 'You passed! Review the solutions to strengthen your understanding.',
        color: 'primary',
      };
    } else {
      return {
        title: 'Keep Trying! 💪',
        message: 'Don\'t worry! Review the tutorial, practice more, and try again. You\'ll do better next time!',
        color: 'error',
      };
    }
  };

  const message = getMessage();

  // Handle retake
  const handleRetake = () => {
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapterId}/test`);
  };

  // Handle review solutions
  const handleReviewSolutions = () => {
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapterId}/solutions`, {
      state: { testData, answers },
    });
  };

  // Handle continue
  const handleContinue = () => {
    // Navigate back to chapter list
    navigate(`/exam/${examId}/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <Header
        title={testData.chapterName}
        subtitle="Test Results"
        showBackButton={false}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <Card padding="lg" className="text-center mb-6">
            {/* Pass/Fail Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-4"
            >
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                passed ? 'bg-secondary-100' : 'bg-error-100'
              }`}>
                {passed ? (
                  <IoCheckmarkCircle className="w-12 h-12 text-secondary-600" />
                ) : (
                  <IoCloseCircle className="w-12 h-12 text-error-600" />
                )}
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                message.color === 'secondary' ? 'text-secondary-700' :
                message.color === 'primary' ? 'text-primary-700' :
                'text-error-700'
              }`}>
                {message.title}
              </h2>
              <p className="text-gray-600 mb-6">{message.message}</p>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {percentage}%
              </div>
              <p className="text-gray-600">
                {earnedMarks} / {totalMarks} marks
              </p>
            </motion.div>

            {/* Star Rating */}
            {stars > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                {[1, 2, 3].map((star) => (
                  star <= stars ? (
                    <IoStar key={star} className="w-10 h-10 text-accent-500" />
                  ) : (
                    <IoStarOutline key={star} className="w-10 h-10 text-gray-300" />
                  )
                ))}
              </motion.div>
            )}

            {/* Pass/Fail Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                passed
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'bg-error-100 text-error-700'
              }`}>
                {passed ? '✅ PASSED' : '❌ NOT PASSED'}
                <span className="text-sm font-normal">
                  (Passing: 60%)
                </span>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {/* Correct */}
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-secondary-100 rounded-full flex items-center justify-center">
              <IoCheckmarkCircle className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </Card>

          {/* Incorrect */}
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-error-100 rounded-full flex items-center justify-center">
              <IoCloseCircle className="w-6 h-6 text-error-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{incorrectAnswers}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </Card>

          {/* Unanswered */}
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
              <IoList className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{unansweredQuestions}</div>
            <div className="text-sm text-gray-600">Unanswered</div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          {/* Review Solutions */}
          <Button
            variant="primary"
            onClick={handleReviewSolutions}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-2">
              <IoBook className="w-5 h-5" />
              <span>Review Solutions</span>
            </div>
          </Button>

          {/* Retake Test */}
          <Button
            variant="outline"
            onClick={handleRetake}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-2">
              <IoRefresh className="w-5 h-5" />
              <span>Retake Test</span>
            </div>
          </Button>

          {/* Continue */}
          {passed && (
            <Button
              variant="accent"
              onClick={handleContinue}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Back to Chapters</span>
                <IoArrowForward className="w-5 h-5" />
              </div>
            </Button>
          )}

          {/* Back to Chapters (if failed) */}
          {!passed && (
            <Button
              variant="text"
              onClick={handleContinue}
              className="w-full"
            >
              Back to Chapters
            </Button>
          )}
        </motion.div>

        {/* Next Steps Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-lg"
        >
          <p className="text-sm text-primary-700">
            💡 <strong>Next Steps:</strong>{' '}
            {passed
              ? 'Review the solutions to understand any mistakes, then continue to the next chapter!'
              : 'Review the tutorial and solutions carefully, practice more, and retake the test to improve your score.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TestResults;
