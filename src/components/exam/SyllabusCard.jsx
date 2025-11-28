import { Card } from '../common';
import { IoChevronForward } from 'react-icons/io5';

const SyllabusCard = ({ subject, onClick }) => {
  const totalChapters = subject.chapters?.length || 0;

  return (
    <Card hover padding="md" onClick={onClick}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {subject.name}
          </h4>
          {subject.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {subject.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              📚 {totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'}
            </span>
            {subject.marks && (
              <span className="text-primary-600 font-medium">
                {subject.marks} Marks
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          <IoChevronForward className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default SyllabusCard;
