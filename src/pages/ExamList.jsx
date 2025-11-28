import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { SearchBar, LoadingSkeleton } from '../components/common';
import { ExamCard } from '../components/exam';

const ExamList = () => {
  const { level } = useParams();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Load exam data
  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch exam data from public folder
        const response = await fetch(`/data/exams/${level}/exams-list.json`);

        if (!response.ok) {
          throw new Error('Failed to load exam data');
        }

        const data = await response.json();
        setExams(data.exams || []);
      } catch (err) {
        console.error('Error loading exams:', err);
        setError('Failed to load exams. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (level) {
      loadExams();
    }
  }, [level]);

  // Filter exams based on search query
  const filteredExams = exams.filter((exam) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.conductedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate popular and other exams
  const popularExams = filteredExams.filter((exam) => exam.popular);
  const otherExams = filteredExams.filter((exam) => !exam.popular);

  // Handle exam card click
  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  // Format level name for display
  const getLevelName = () => {
    switch (level) {
      case '8th-pass':
        return '8th Pass';
      case '10th-pass':
        return '10th Pass';
      case '12th-pass':
        return '12th Pass';
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title={`${getLevelName()} Exams`}
          subtitle="Loading..."
          showBackButton
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="bg-gray-200 h-12 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/select-level')}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Level Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title={`${getLevelName()} Exams`}
        subtitle={`${exams.length} exams available`}
        showBackButton
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search exams..."
            className="mb-6"
          />
        </motion.div>

        {/* Popular Exams Section */}
        {popularExams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>⭐</span>
              Popular Exams
            </h2>
            <div className="space-y-3">
              {popularExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <ExamCard
                    exam={exam}
                    onClick={() => handleExamClick(exam.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Exams Section */}
        {otherExams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {popularExams.length > 0 ? 'Other Exams' : 'All Exams'}
            </h2>
            <div className="space-y-3">
              {otherExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <ExamCard
                    exam={exam}
                    onClick={() => handleExamClick(exam.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredExams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg mb-2">No exams found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search query
            </p>
          </motion.div>
        )}

        {/* Info Card */}
        {!searchQuery && exams.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100"
          >
            <p className="text-sm text-primary-700">
              💡 <strong>Tip:</strong> Tap on any exam to view detailed syllabus,
              exam pattern, and start your preparation journey.
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ExamList;
