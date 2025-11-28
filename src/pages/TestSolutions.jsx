import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { Button, Card } from '../components/common';
import { SolutionCard } from '../components/learning';
import { IoRefresh, IoArrowBack, IoCheckmarkCircle, IoCloseCircle, IoRemoveCircle } from 'react-icons/io5';

const TestSolutions = () => {
  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get test data from navigation state
  const { testData, answers } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!testData || !answers) {
      navigate(`/exam/${examId}/subject/${subjectId}`);
    }
  }, [testData, answers, examId, subjectId, navigate]);

  if (!testData || !answers) {
    return null; // Will redirect
  }

  // Calculate stats
  const correctAnswers = Object.values(answers).filter(
    (answer, index) => answer === testData.questions[index]?.correctAnswer
  ).length;

  const incorrectAnswers = Object.values(answers).filter(
    (answer, index) => answer !== null && answer !== testData.questions[index]?.correctAnswer
  ).length;

  const unansweredQuestions = testData.questions.length - correctAnswers - incorrectAnswers;

  // Handle retake
  const handleRetake = () => {
    navigate(`/exam/${examId}/subject/${subjectId}/chapter/${chapterId}/test`);
  };

  // Handle back to results
  const handleBackToResults = () => {
    navigate(-1); // Go back to results page
  };

  // Handle back to chapters
  const handleBackToChapters = () => {
    navigate(`/exam/${examId}/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title={testData.chapterName}
        subtitle="Solutions Review"
        showBackButton
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card padding="md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Solution Review
                </h2>
                <p className="text-sm text-gray-600">
                  Review all questions with detailed explanations
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-gray-700">
                    {correctAnswers} Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IoCloseCircle className="w-5 h-5 text-error-600" />
                  <span className="font-medium text-gray-700">
                    {incorrectAnswers} Incorrect
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IoRemoveCircle className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    {unansweredQuestions} Unanswered
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Solutions List */}
        <div className="space-y-6 mb-6">
          {testData.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <SolutionCard
                question={question}
                userAnswer={answers[index]}
                questionNumber={question.questionNumber}
              />
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="sticky bottom-6 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Retake Test */}
            <Button
              variant="primary"
              onClick={handleRetake}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2">
                <IoRefresh className="w-5 h-5" />
                <span>Retake Test</span>
              </div>
            </Button>

            {/* Back to Chapters */}
            <Button
              variant="outline"
              onClick={handleBackToChapters}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2">
                <IoArrowBack className="w-5 h-5" />
                <span>Back to Chapters</span>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Study Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-lg"
        >
          <p className="text-sm text-primary-700">
            💡 <strong>Study Tip:</strong> Review the explanations carefully to understand the concepts.
            Focus on the questions you got wrong or didn't answer. Practice similar questions to improve your understanding.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TestSolutions;
