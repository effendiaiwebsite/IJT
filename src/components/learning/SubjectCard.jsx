import { Card, ProgressBar } from '../common';
import { IoLockClosed, IoChevronForward } from 'react-icons/io5';

const SubjectCard = ({ subject, progress = {}, locked = false, onClick }) => {
  const completedChapters = progress.completedChapters || 0;
  const totalChapters = subject.chapters?.length || 0;
  const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <Card
      hover={!locked}
      padding="lg"
      onClick={locked ? undefined : onClick}
      className={locked ? 'opacity-60' : ''}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Subject Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            {subject.name}
            {locked && <IoLockClosed className="w-4 h-4 text-gray-400" />}
          </h3>

          {subject.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {subject.description}
            </p>
          )}

          {/* Progress Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                📚 {totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'}
              </span>
              <span className="font-medium text-gray-900">
                {completedChapters}/{totalChapters} Complete
              </span>
            </div>

            {/* Progress Bar */}
            {!locked && (
              <ProgressBar
                percentage={progressPercentage}
                showLabel={false}
                height="sm"
                color={progressPercentage === 100 ? 'secondary' : 'primary'}
                animated={true}
              />
            )}

            {locked && (
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">
                  🔒 Complete 50% of the previous subject to unlock
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Arrow or Lock */}
        <div className={locked ? 'text-gray-300' : 'text-gray-400'}>
          {locked ? (
            <IoLockClosed className="w-6 h-6" />
          ) : (
            <IoChevronForward className="w-5 h-5" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;
