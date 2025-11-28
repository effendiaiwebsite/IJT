import { motion } from 'framer-motion';

const LoadingSkeleton = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const baseClasses = "bg-gray-200 rounded animate-pulse";

  const variants = {
    // Card skeleton for ExamCard, SubjectCard, ChapterCard
    card: (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-start gap-4">
          <div className={`${baseClasses} w-12 h-12 rounded-lg flex-shrink-0`} />
          <div className="flex-1">
            <div className={`${baseClasses} h-5 w-3/4 mb-2`} />
            <div className={`${baseClasses} h-4 w-1/2 mb-3`} />
            <div className={`${baseClasses} h-3 w-full`} />
          </div>
        </div>
      </div>
    ),

    // List item skeleton
    list: (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`${baseClasses} w-10 h-10 rounded-full flex-shrink-0`} />
          <div className="flex-1">
            <div className={`${baseClasses} h-4 w-2/3 mb-2`} />
            <div className={`${baseClasses} h-3 w-1/2`} />
          </div>
        </div>
      </div>
    ),

    // Text block skeleton
    text: (
      <div className={className}>
        <div className={`${baseClasses} h-4 w-full mb-2`} />
        <div className={`${baseClasses} h-4 w-5/6 mb-2`} />
        <div className={`${baseClasses} h-4 w-4/6`} />
      </div>
    ),

    // Stats card skeleton
    stats: (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-start gap-3">
          <div className={`${baseClasses} w-12 h-12 rounded-lg flex-shrink-0`} />
          <div className="flex-1">
            <div className={`${baseClasses} h-3 w-16 mb-2`} />
            <div className={`${baseClasses} h-6 w-12`} />
          </div>
        </div>
      </div>
    ),

    // Header skeleton
    header: (
      <div className={`bg-white p-4 ${className}`}>
        <div className={`${baseClasses} h-6 w-32 mb-2`} />
        <div className={`${baseClasses} h-4 w-48`} />
      </div>
    ),
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {variants[variant] || variants.card}
        </motion.div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
