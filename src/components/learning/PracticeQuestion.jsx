import { useState } from 'react';
import { Card, Button } from '../common';
import { IoHelpCircleOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const PracticeQuestion = ({ slide, onAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { question } = slide;

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Notify parent component
    if (onAnswered) {
      onAnswered(correct);
    }
  };

  const handleOptionClick = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const getOptionClassName = (index) => {
    const baseClasses = 'w-full text-left p-4 rounded-lg border-2 transition-all';

    if (!isSubmitted) {
      // Before submission
      if (selectedOption === index) {
        return `${baseClasses} border-primary-500 bg-primary-50`;
      }
      return `${baseClasses} border-gray-200 hover:border-primary-300 hover:bg-gray-50`;
    }

    // After submission
    if (index === question.correctAnswer) {
      return `${baseClasses} border-secondary-500 bg-secondary-50`;
    }
    if (selectedOption === index && !isCorrect) {
      return `${baseClasses} border-error-500 bg-error-50`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50 opacity-60`;
  };

  return (
    <Card padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <IoHelpCircleOutline className="w-6 h-6 text-accent-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{slide.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Slide {slide.slideNumber}</p>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900">{question.questionText}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={getOptionClassName(index)}
              disabled={isSubmitted}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                  {isSubmitted && index === question.correctAnswer && (
                    <IoCheckmarkCircle className="w-5 h-5 text-secondary-600" />
                  )}
                  {isSubmitted && selectedOption === index && !isCorrect && (
                    <IoCloseCircle className="w-5 h-5 text-error-600" />
                  )}
                  {!isSubmitted && selectedOption === index && (
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                  )}
                </div>
                <span className="flex-1 text-gray-900 font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {/* Explanation */}
        {isSubmitted && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-secondary-50 border border-secondary-200' : 'bg-error-50 border border-error-200'}`}>
            <div className="flex items-start gap-2 mb-2">
              {isCorrect ? (
                <IoCheckmarkCircle className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" />
              ) : (
                <IoCloseCircle className="w-6 h-6 text-error-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-bold ${isCorrect ? 'text-secondary-900' : 'text-error-900'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PracticeQuestion;
