import { Card } from '../common';
import { IoCheckmarkCircle } from 'react-icons/io5';

const TestQuestion = ({ question, selectedAnswer, onSelectAnswer }) => {
  const handleOptionClick = (index) => {
    onSelectAnswer(index);
  };

  const getOptionClassName = (index) => {
    const baseClasses = 'w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer';

    if (selectedAnswer === index) {
      return `${baseClasses} border-primary-500 bg-primary-50`;
    }
    return `${baseClasses} border-gray-200 hover:border-primary-300 hover:bg-gray-50`;
  };

  const getDifficultyBadge = () => {
    const colors = {
      easy: 'bg-secondary-100 text-secondary-700',
      medium: 'bg-accent-100 text-accent-700',
      hard: 'bg-error-100 text-error-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[question.difficulty] || colors.medium}`}>
        {question.difficulty || 'Medium'}
      </span>
    );
  };

  return (
    <Card padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-primary-600">
                Question {question.questionNumber}
              </span>
              {getDifficultyBadge()}
              <span className="text-xs text-gray-500 ml-auto">
                {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
              </span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.questionText}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={getOptionClassName(index)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  {selectedAnswer === index && (
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                  )}
                </div>
                <span className="flex-1 text-gray-900 font-medium text-left">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selection Indicator */}
        {selectedAnswer !== null && selectedAnswer !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-secondary-700">
              <IoCheckmarkCircle className="w-4 h-4" />
              <span>Answer selected: Option {String.fromCharCode(65 + selectedAnswer)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TestQuestion;
