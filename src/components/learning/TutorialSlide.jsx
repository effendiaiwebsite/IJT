import { Card } from '../common';
import { IoBookOutline } from 'react-icons/io5';

const TutorialSlide = ({ slide }) => {
  return (
    <Card padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <IoBookOutline className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{slide.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Slide {slide.slideNumber}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {slide.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TutorialSlide;
