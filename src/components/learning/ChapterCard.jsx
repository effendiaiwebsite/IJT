import { Card, Button } from '../common';
import { IoLockClosed, IoCheckmarkCircle, IoBook, IoStar, IoStarOutline } from 'react-icons/io5';

const ChapterCard = ({ chapter, status = 'locked', score = null, onStart, onReview }) => {
  // Status: 'completed', 'current', 'locked'

  const getStarRating = () => {
    if (!score) return 0;
    if (score >= 85) return 3;
    if (score >= 70) return 2;
    if (score >= 60) return 1;
    return 0;
  };

  const stars = getStarRating();

  const statusConfig = {
    completed: {
      icon: IoCheckmarkCircle,
      iconColor: 'text-secondary-500',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
    },
    current: {
      icon: IoBook,
      iconColor: 'text-primary-500',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    locked: {
      icon: IoLockClosed,
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card
      padding="lg"
      className={`border-2 ${config.borderColor} ${status === 'locked' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Left: Status Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Middle: Chapter Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {chapter.name}
              </h3>
              <p className="text-sm text-gray-600">
                Chapter {chapter.order}
              </p>
            </div>

            {/* Stars for completed chapters */}
            {status === 'completed' && score !== null && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((star) => (
                  star <= stars ? (
                    <IoStar key={star} className="w-5 h-5 text-accent-500" />
                  ) : (
                    <IoStarOutline key={star} className="w-5 h-5 text-gray-300" />
                  )
                ))}
              </div>
            )}
          </div>

          {/* Chapter Topics */}
          {chapter.topics && chapter.topics.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Topics covered:</p>
              <div className="flex flex-wrap gap-1">
                {chapter.topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
                {chapter.topics.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{chapter.topics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Score for completed */}
          {status === 'completed' && score !== null && (
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-700 px-3 py-1 rounded-lg text-sm font-medium">
                <IoCheckmarkCircle className="w-4 h-4" />
                Score: {score}%
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-3">
            {status === 'current' && (
              <Button
                variant="primary"
                size="sm"
                onClick={onStart}
                className="w-full sm:w-auto"
              >
                📖 START CHAPTER
              </Button>
            )}

            {status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReview}
                className="w-full sm:w-auto"
              >
                🔄 REVIEW
              </Button>
            )}

            {status === 'locked' && (
              <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
                🔒 Complete the previous chapter to unlock
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChapterCard;
