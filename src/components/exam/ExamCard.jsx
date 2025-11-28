import { motion } from 'framer-motion';
import { IoChevronForward, IoStar } from 'react-icons/io5';
import { Card } from '../common';

const ExamCard = ({ exam, onClick, showProgress = false }) => {
  return (
    <Card hover padding="md" onClick={onClick}>
      <div className="flex items-center justify-between gap-4">
        {/* Left: Exam Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {exam.name}
            </h3>
            {exam.popular && (
              <IoStar className="w-4 h-4 text-accent-500 flex-shrink-0" />
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-medium">
              {exam.eligibility}
            </span>
            {exam.conductedBy && (
              <span className="text-gray-500">• {exam.conductedBy}</span>
            )}
          </div>

          {/* Progress Bar (if user has started) */}
          {showProgress && exam.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span className="font-medium">{exam.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-secondary-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${exam.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Arrow */}
        <div className="text-gray-400">
          <IoChevronForward className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default ExamCard;
