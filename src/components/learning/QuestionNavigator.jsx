import { Card } from '../common';

const QuestionNavigator = ({
  totalQuestions,
  currentQuestion,
  answers,
  onNavigate
}) => {
  const getButtonClass = (questionIndex) => {
    const isCurrent = questionIndex === currentQuestion;
    const isAnswered = answers[questionIndex] !== null && answers[questionIndex] !== undefined;

    let baseClasses = 'w-10 h-10 rounded-lg font-bold text-sm transition-all';

    if (isCurrent) {
      return `${baseClasses} bg-primary-600 text-white border-2 border-primary-700`;
    }

    if (isAnswered) {
      return `${baseClasses} bg-secondary-100 text-secondary-700 border-2 border-secondary-300 hover:bg-secondary-200`;
    }

    return `${baseClasses} bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200`;
  };

  const answeredCount = Object.values(answers).filter(
    (answer) => answer !== null && answer !== undefined
  ).length;

  return (
    <Card padding="md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Question Navigator</h3>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>Answered: {answeredCount}/{totalQuestions}</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={getButtonClass(index)}
            title={`Question ${index + 1}${answers[index] !== null && answers[index] !== undefined ? ' (Answered)' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-600 border border-primary-700"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-100 border border-secondary-300"></div>
          <span className="text-gray-600">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
          <span className="text-gray-600">Unanswered</span>
        </div>
      </div>
    </Card>
  );
};

export default QuestionNavigator;
