import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { LoadingSkeleton, ProgressBar } from '../components/common';
import { SubjectCard } from '../components/learning';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';

const LearningJourney = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchAllChaptersProgress } = useProgress(examId);

  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterProgress, setChapterProgress] = useState({});

  // Load syllabus data and user progress
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

        const data = await response.json();
        setSyllabusData(data);

        // Load user progress if authenticated
        if (currentUser && fetchAllChaptersProgress) {
          const progress = await fetchAllChaptersProgress();
          setChapterProgress(progress);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load syllabus. This exam may not have content yet.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      loadData();
    }
  }, [examId, currentUser, fetchAllChaptersProgress]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!syllabusData?.subjects) return 0;

    let totalChapters = 0;
    let completedChapters = 0;

    syllabusData.subjects.forEach((subject) => {
      subject.chapters?.forEach((chapter) => {
        totalChapters++;
        const progress = chapterProgress[chapter.chapterId];
        if (progress?.tutorialCompleted) {
          completedChapters++;
        }
      });
    });

    return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  };

  // Calculate subject progress
  const calculateSubjectProgress = (subject) => {
    if (!subject.chapters) return { completedChapters: 0, totalChapters: 0 };

    let completedChapters = 0;
    const totalChapters = subject.chapters.length;

    subject.chapters.forEach((chapter) => {
      const progress = chapterProgress[chapter.chapterId];
      if (progress?.tutorialCompleted) {
        completedChapters++;
      }
    });

    return { completedChapters, totalChapters };
  };

  // Check if subject is unlocked
  const isSubjectUnlocked = (subjectIndex) => {
    if (subjectIndex === 0) return true; // First subject always unlocked

    const previousSubject = syllabusData.subjects[subjectIndex - 1];
    const previousProgress = calculateSubjectProgress(previousSubject);

    // Unlock if 50% of previous subject is complete
    return previousProgress.totalChapters > 0 &&
           (previousProgress.completedChapters / previousProgress.totalChapters) >= 0.5;
  };

  // Handle subject click
  const handleSubjectClick = (subject) => {
    navigate(`/exam/${examId}/subject/${subject.subjectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="Learning Journey"
          subtitle="Loading..."
          showBackButton
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Overall progress skeleton */}
          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-gray-200 h-6 w-48 rounded mb-2 animate-pulse" />
            <div className="bg-gray-200 h-3 w-full rounded animate-pulse" />
          </div>
          {/* Subject cards skeletons */}
          <div className="space-y-3">
            <LoadingSkeleton variant="card" count={4} />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !syllabusData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Syllabus not found'}</p>
          <button
            onClick={() => navigate(`/exam/${examId}`)}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Exam Details
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const totalSubjects = syllabusData.subjects?.length || 0;
  const totalChapters = syllabusData.subjects?.reduce((sum, s) => sum + (s.chapters?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title={syllabusData.examName}
        subtitle="Your Learning Journey"
        showBackButton
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Overall Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
              <ProgressBar
                percentage={overallProgress}
                showLabel={true}
                height="lg"
                color="secondary"
                className="mb-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-white/80 text-sm mb-1">Subjects</p>
                <p className="text-2xl font-bold">{totalSubjects}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Chapters</p>
                <p className="text-2xl font-bold">{totalChapters}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Completed</p>
                <p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subjects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Subjects</h2>

          <div className="space-y-4">
            {syllabusData.subjects?.map((subject, index) => {
              const locked = !isSubjectUnlocked(index);
              const progress = calculateSubjectProgress(subject);

              return (
                <motion.div
                  key={subject.subjectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <SubjectCard
                    subject={subject}
                    progress={progress}
                    locked={locked}
                    onClick={() => handleSubjectClick(subject)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 p-4 bg-secondary-50 border border-secondary-100 rounded-lg"
        >
          <p className="text-sm text-secondary-700">
            💡 <strong>Tip:</strong> {overallProgress === 0
              ? 'Start with the first subject to begin your preparation journey!'
              : overallProgress === 100
              ? 'Congratulations! You\'ve completed all subjects. Keep reviewing to stay sharp!'
              : 'Keep going! Complete chapters to unlock new subjects and track your progress.'}
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default LearningJourney;
