import { Card } from '../common';
import { IoCheckmarkCircle, IoCloseCircle, IoRemoveCircle } from 'react-icons/io5';

const SolutionCard = ({ question, userAnswer, questionNumber }) => {
  const isCorrect = userAnswer === question.correctAnswer;
  const isUnanswered = userAnswer === null || userAnswer === undefined;

  const getStatusIcon = () => {
    if (isUnanswered) {
      return <IoRemoveCircle className="w-6 h-6 text-gray-500" />;
    }
    return isCorrect ? (
      <IoCheckmarkCircle className="w-6 h-6 text-secondary-600" />
    ) : (
      <IoCloseCircle className="w-6 h-6 text-error-600" />
    );
  };

  const getStatusText = () => {
    if (isUnanswered) return 'Not Answered';
    return isCorrect ? 'Correct' : 'Incorrect';
  };

  const getStatusColor = () => {
    if (isUnanswered) return 'bg-gray-100 text-gray-700 border-gray-300';
    return isCorrect
      ? 'bg-secondary-100 text-secondary-700 border-secondary-300'
      : 'bg-error-100 text-error-700 border-error-300';
  };

  const getOptionClassName = (optionIndex) => {
    const baseClasses = 'p-3 rounded-lg border-2 mb-2';

    // Correct answer - always highlight in green
    if (optionIndex === question.correctAnswer) {
      return `${baseClasses} bg-secondary-50 border-secondary-400`;
    }

    // User's wrong answer - highlight in red
    if (optionIndex === userAnswer && !isCorrect) {
      return `${baseClasses} bg-error-50 border-error-400`;
    }

    // Other options
    return `${baseClasses} bg-gray-50 border-gray-200`;
  };

  return (
    <Card padding="lg">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-primary-600">
              Question {questionNumber}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium text-sm">{getStatusText()}</span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <p className="text-base font-medium text-gray-900 leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="mb-4">
        {question.options.map((option, index) => (
          <div key={index} className={getOptionClassName(index)}>
            <div className="flex items-start gap-3">
              {/* Option Letter */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <p className="text-gray-900">{option}</p>
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                {index === question.correctAnswer && (
                  <div className="flex items-center gap-1 text-secondary-700">
                    <IoCheckmarkCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Correct</span>
                  </div>
                )}
                {index === userAnswer && !isCorrect && (
                  <div className="flex items-center gap-1 text-error-700">
                    <IoCloseCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Your Answer</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className={`p-4 rounded-lg border ${
        isCorrect
          ? 'bg-secondary-50 border-secondary-200'
          : isUnanswered
          ? 'bg-gray-50 border-gray-200'
          : 'bg-primary-50 border-primary-200'
      }`}>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-sm font-bold text-gray-700">💡</span>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold mb-1 ${
              isCorrect ? 'text-secondary-900' : 'text-gray-900'
            }`}>
              Explanation:
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SolutionCard;
