import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoInformationCircle,
  IoDocumentText,
  IoCalendar,
  IoGlobe,
  IoPeople,
  IoCash,
  IoTime,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import { Header, BottomNav } from '../components/navigation';
import { Button, LoadingSkeleton } from '../components/common';
import { InfoCard, InfoRow, SyllabusCard } from '../components/exam';

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load exam and syllabus data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load exam metadata from all levels
        const levels = ['8th-pass', '10th-pass', '12th-pass'];
        let foundExam = null;

        for (const level of levels) {
          try {
            const response = await fetch(`/data/exams/${level}/exams-list.json`);
            if (response.ok) {
              const data = await response.json();
              foundExam = data.exams.find((exam) => exam.id === examId);
              if (foundExam) break;
            }
          } catch (err) {
            // Continue to next level
          }
        }

        if (!foundExam) {
          throw new Error('Exam not found');
        }

        setExamData(foundExam);

        // Load syllabus data
        try {
          const syllabusResponse = await fetch(`/data/syllabi/${examId}-syllabus.json`);
          if (syllabusResponse.ok) {
            const syllabusJson = await syllabusResponse.json();
            setSyllabusData(syllabusJson);
          }
        } catch (err) {
          console.log('Syllabus not found for this exam');
        }
      } catch (err) {
        console.error('Error loading exam details:', err);
        setError('Failed to load exam details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      loadData();
    }
  }, [examId]);

  const handleStartPreparation = () => {
    if (syllabusData) {
      navigate(`/exam/${examId}/journey`);
    } else {
      alert('Syllabus not available yet. Coming soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="Exam Details"
          subtitle="Loading..."
          showBackButton
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Title skeleton */}
          <div className="mb-6">
            <div className="bg-gray-200 h-8 w-3/4 rounded mb-2 animate-pulse" />
            <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse" />
          </div>
          {/* Content skeletons */}
          <div className="space-y-4">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Exam not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <Header title={examData.name} showBackButton />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Exam Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InfoCard title="Exam Information" icon={<IoInformationCircle className="w-6 h-6" />}>
            <InfoRow
              label="Conducted By"
              value={examData.conductedBy}
              icon={<IoPeople className="w-5 h-5" />}
            />
            <InfoRow
              label="Eligibility"
              value={examData.eligibility}
              icon={<IoCheckmarkCircle className="w-5 h-5" />}
            />
            {examData.ageLimit && (
              <InfoRow
                label="Age Limit"
                value={examData.ageLimit}
                icon={<IoCalendar className="w-5 h-5" />}
              />
            )}
            {examData.salaryRange && (
              <InfoRow
                label="Salary Range"
                value={examData.salaryRange}
                icon={<IoCash className="w-5 h-5" />}
              />
            )}
            {examData.website && (
              <InfoRow
                label="Official Website"
                value={
                  <a
                    href={examData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    {examData.website}
                  </a>
                }
                icon={<IoGlobe className="w-5 h-5" />}
              />
            )}
          </InfoCard>
        </motion.div>

        {/* Description */}
        {examData.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary-50 border border-primary-100 rounded-lg p-4"
          >
            <p className="text-gray-700">{examData.description}</p>
          </motion.div>
        )}

        {/* Exam Pattern */}
        {syllabusData?.examPattern && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <InfoCard title="Exam Pattern" icon={<IoDocumentText className="w-6 h-6" />}>
              {syllabusData.examPattern.session1 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    {syllabusData.examPattern.session1.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Questions</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session1.totalQuestions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Marks</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session1.totalMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session1.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Negative Marking</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session1.negativeMarking}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {syllabusData.examPattern.session2 && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900">
                    {syllabusData.examPattern.session2.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Questions</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session2.totalQuestions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Marks</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session2.totalMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session2.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Negative Marking</p>
                      <p className="font-semibold text-gray-900">
                        {syllabusData.examPattern.session2.negativeMarking}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </InfoCard>
          </motion.div>
        )}

        {/* Selection Process */}
        {examData.selectionProcess && examData.selectionProcess.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <InfoCard title="Selection Process" icon={<IoCheckmarkCircle className="w-6 h-6" />}>
              <ol className="space-y-2">
                {examData.selectionProcess.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </InfoCard>
          </motion.div>
        )}

        {/* Syllabus Overview */}
        {syllabusData?.subjects && syllabusData.subjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Syllabus Overview</h2>
            <div className="space-y-3">
              {syllabusData.subjects.map((subject, index) => (
                <motion.div
                  key={subject.subjectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                >
                  <SyllabusCard
                    subject={subject}
                    onClick={() => navigate(`/exam/${examId}/subject/${subject.subjectId}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Start Preparation Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="sticky bottom-20 z-10"
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartPreparation}
            className="shadow-lg"
          >
            🚀 START PREPARATION
          </Button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ExamDetails;
