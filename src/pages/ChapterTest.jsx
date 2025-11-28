import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/navigation';
import { Loader, Button, Modal, Timer } from '../components/common';
import { TestQuestion, QuestionNavigator } from '../components/learning';
import { IoChevronBack, IoChevronForward, IoCheckmarkDone, IoWarning } from 'react-icons/io5';

const ChapterTest = () => {
  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Load test questions
  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/data/questions/${examId}/${subjectId}/${chapterId}/test-questions.json`
        );

        if (!response.ok) {
          throw new Error('Test questions not found');
        }

        const data = await response.json();

        // Check if questions array is empty
        if (!data.questions || data.questions.length === 0) {
          throw new Error('No test questions available for this chapter yet');
        }

        // Normalize question format (handle both 'text' and 'questionText')
        const normalizedData = {
          ...data,
          questions: data.questions.map((q, index) => ({
            ...q,
            questionNumber: q.questionNumber || index + 1,
            questionText: q.questionText || q.text,
            marks: q.marks || 2,
            difficulty: q.difficulty || 'medium',
          })),
        };

        setTestData(normalizedData);

        // Initialize answers object
        const initialAnswers = {};
        normalizedData.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error loading test:', err);
        setError('Failed to load test. This chapter may not have test questions yet.');
      } finally {
        setLoading(false);
      }
    };

    if (examId && subjectId && chapterId) {
      loadTest();
    }
  }, [examId, subjectId, chapterId]);

  // Handle answer selection
  const handleSelectAnswer = (answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  // Navigate to question
  const handleNavigateToQuestion = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
  };

  // Previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Next question
  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    // Auto-submit when time runs out
    handleSubmitTest();
  };

  // Show submit confirmation modal
  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  // Submit test
  const handleSubmitTest = () => {
    // Calculate score
    let correctAnswers = 0;
    let totalMarks = 0;
    let earnedMarks = 0;

    testData.questions.forEach((question, index) => {
      totalMarks += question.marks || 2;
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
        earnedMarks += question.marks || 2;
      }
    });

    const percentage = (earnedMarks / totalMarks) * 100;

    // Navigate to results page with state
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapterId}/results`, {
      state: {
        testData,
        answers,
        correctAnswers,
        totalQuestions: testData.questions.length,
        earnedMarks,
        totalMarks,
        percentage: Math.round(percentage),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading test..." />
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Test Not Available Yet</h2>
          <p className="text-gray-600 mb-6">
            Test questions for this chapter are being prepared. You can continue with the next tutorial!
          </p>
          <button
            onClick={() => navigate(`/exam/${examId}/subject/${subjectId}`)}
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            ← Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const unansweredCount = testData.questions.length - answeredCount;

  // Parse duration (e.g., "20 minutes" -> 20)
  const durationMinutes = parseInt(testData.duration) || 20;

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <Header
        title={testData.chapterName}
        subtitle="Chapter Test"
        showBackButton
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Question */}
          <div className="lg:col-span-2">
            {/* Test Info Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Questions: </span>
                    <span className="font-bold text-gray-900">{testData.totalQuestions}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div>
                    <span className="text-gray-600">Total Marks: </span>
                    <span className="font-bold text-gray-900">{testData.totalMarks}</span>
                  </div>
                </div>
                <Timer durationMinutes={durationMinutes} onTimeUp={handleTimeUp} />
              </div>
            </motion.div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TestQuestion
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestionIndex]}
                  onSelectAnswer={handleSelectAnswer}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="flex-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <IoChevronBack className="w-5 h-5" />
                  <span>Previous</span>
                </div>
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isLastQuestion}
                className="flex-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Next</span>
                  <IoChevronForward className="w-5 h-5" />
                </div>
              </Button>
            </div>
          </div>

          {/* Right Column - Navigator & Submit */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Question Navigator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <QuestionNavigator
                  totalQuestions={testData.questions.length}
                  currentQuestion={currentQuestionIndex}
                  answers={answers}
                  onNavigate={handleNavigateToQuestion}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant="accent"
                  onClick={handleSubmitClick}
                  className="w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <IoCheckmarkDone className="w-5 h-5" />
                    <span>Submit Test</span>
                  </div>
                </Button>

                {unansweredCount > 0 && (
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} unanswered
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-8 h-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Test?</h3>
          <p className="text-gray-600 mb-6">
            You have answered <span className="font-bold text-gray-900">{answeredCount}</span> out of{' '}
            <span className="font-bold text-gray-900">{testData.questions.length}</span> questions.
            {unansweredCount > 0 && (
              <span className="block mt-2 text-error-600 font-medium">
                {unansweredCount} question{unansweredCount !== 1 ? 's are' : ' is'} still unanswered.
              </span>
            )}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              className="flex-1"
            >
              Review Answers
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitTest}
              className="flex-1"
            >
              Submit Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChapterTest;
