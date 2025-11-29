import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { LoadingSkeleton, Button } from '../components/common';
import { ExamCard } from '../components/exam';
import { IoBook, IoAdd } from 'react-icons/io5';
import { useEnrolledExams } from '../hooks/useProgress';

const MyExams = () => {
  const navigate = useNavigate();
  const { enrolledExams, loading, error } = useEnrolledExams();

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle exam click
  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  // Handle browse more exams
  const handleBrowseExams = () => {
    navigate('/select-level');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="My Exams"
          subtitle="Loading..."
          showBackButton={false}
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-3">
            <LoadingSkeleton variant="card" count={4} />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="My Exams"
          subtitle="Error loading exams"
          showBackButton={false}
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>{error}</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title="My Exams"
        subtitle={enrolledExams.length > 0 ? `${enrolledExams.length} exam${enrolledExams.length > 1 ? 's' : ''} in progress` : 'No exams yet'}
        showBackButton={false}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {enrolledExams.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <IoBook className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Exams Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your exam preparation journey by browsing available exams and beginning your study.
            </p>
            <Button onClick={handleBrowseExams} variant="primary">
              <div className="flex items-center gap-2">
                <IoAdd className="w-5 h-5" />
                <span>Browse Exams</span>
              </div>
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Enrolled Exams List */}
            <div className="space-y-3 mb-6">
              {enrolledExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ExamCard
                    exam={exam}
                    onClick={() => handleExamClick(exam.id)}
                    showProgress
                  />
                  <div className="mt-2 px-4 text-xs text-gray-500">
                    Last accessed: {formatDate(exam.lastAccessedAt)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Browse More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center py-6"
            >
              <Button onClick={handleBrowseExams} variant="outline" fullWidth>
                <div className="flex items-center justify-center gap-2">
                  <IoAdd className="w-5 h-5" />
                  <span>Browse More Exams</span>
                </div>
              </Button>
            </motion.div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MyExams;
