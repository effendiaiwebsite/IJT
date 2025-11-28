import { motion } from 'framer-motion';

const ProgressBar = ({
  percentage = 0,
  showLabel = true,
  height = 'md',
  color = 'primary',
  className = '',
  animated = true,
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
    error: 'bg-error-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Progress
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {safePercentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className={`${heights[height]} ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
