import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/common';
import { BottomNav } from '../components/navigation';

const LevelSelection = () => {
  const navigate = useNavigate();

  const levels = [
    {
      id: '8th-pass',
      emoji: '📚',
      title: '8th Pass',
      examCount: 12,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: '10th-pass',
      emoji: '📖',
      title: '10th Pass',
      examCount: 18,
      color: 'from-green-400 to-green-600',
    },
    {
      id: '12th-pass',
      emoji: '🎓',
      title: '12th Pass',
      examCount: 20,
      color: 'from-purple-400 to-purple-600',
    },
  ];

  const handleLevelSelect = (levelId) => {
    navigate(`/exams/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to IJT
          </h1>
          <p className="text-lg text-white/90">
            Select Your Education Level
          </p>
        </motion.div>
      </div>

      {/* Level Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="space-y-4">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                hover
                padding="lg"
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Emoji Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {level.emoji}
                    </div>

                    {/* Level Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {level.title}
                      </h2>
                      <p className="text-gray-600">
                        {level.examCount} Exams Available
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-gray-600"
        >
          <p className="text-sm">
            Choose your education level to see available government job exams
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default LevelSelection;
