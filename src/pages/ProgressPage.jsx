import { motion } from 'framer-motion';
import { Header, BottomNav } from '../components/navigation';
import { Card, StatsCard, ProgressBar, LoadingSkeleton } from '../components/common';
import { IoTrophy, IoFlame, IoBook, IoCheckmarkCircle, IoStar, IoCalendar, IoTime } from 'react-icons/io5';
import { useUserStatistics } from '../hooks/useProgress';

const ProgressPage = () => {
  const { stats, activity, loading } = useUserStatistics();

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          title="Progress"
          subtitle="Track your learning journey"
          showBackButton={false}
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <LoadingSkeleton variant="card" count={3} />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title="Progress"
        subtitle="Track your learning journey"
        showBackButton={false}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatsCard
              icon={IoCheckmarkCircle}
              label="Tests Taken"
              value={stats?.totalTestsAttempted || 0}
              color="secondary"
            />
            <StatsCard
              icon={IoBook}
              label="Chapters Done"
              value={stats?.totalChaptersCompleted || 0}
              color="primary"
            />
            <StatsCard
              icon={IoBook}
              label="Exams Enrolled"
              value={stats?.totalExams || 0}
              color="accent"
            />
            <StatsCard
              icon={IoTrophy}
              label="Avg Score"
              value={`${stats?.averageScore || 0}%`}
              color="secondary"
            />
            <StatsCard
              icon={IoTime}
              label="Study Time"
              value={`${Math.floor((stats?.totalStudyTime || 0) / 60)}h`}
              color="primary"
            />
            <StatsCard
              icon={IoStar}
              label="3-Star Tests"
              value={stats?.threeStarTests || 0}
              color="accent"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h3>
          <Card padding="none">
            {activity && activity.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {activity.map((item, index) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === 'test' ? 'bg-secondary-100' : 'bg-primary-100'
                        }`}>
                          {item.type === 'test' ? (
                            <IoCheckmarkCircle className="w-5 h-5 text-secondary-600" />
                          ) : (
                            <IoBook className="w-5 h-5 text-primary-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.chapterName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {item.type === 'test' ? 'Chapter Test' : 'Tutorial'}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">{formatDate(item.date)}</span>
                          </div>
                        </div>

                        {/* Score/Stars */}
                        <div className="text-right">
                          {item.type === 'test' && (
                            <>
                              <div className="text-lg font-bold text-gray-900">
                                {item.score}%
                              </div>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[1, 2, 3].map((star) => (
                                  <IoStar
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= item.stars ? 'text-accent-500' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          {item.type === 'tutorial' && (
                            <span className="inline-flex items-center gap-1 text-sm text-secondary-700 bg-secondary-50 px-2 py-1 rounded">
                              <IoCheckmarkCircle className="w-4 h-4" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <IoBook className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No activity yet. Start learning to see your progress here!</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Achievements</h3>
          <Card padding="md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Achievement badges */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-secondary-100 rounded-full flex items-center justify-center">
                  <IoFlame className="w-8 h-8 text-secondary-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">5-Day Streak</p>
                <p className="text-xs text-gray-600">Unlocked</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-accent-100 rounded-full flex items-center justify-center">
                  <IoStar className="w-8 h-8 text-accent-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Perfect Score</p>
                <p className="text-xs text-gray-600">3 times</p>
              </div>

              <div className="text-center opacity-50">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoTrophy className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Chapter Master</p>
                <p className="text-xs text-gray-600">Locked</p>
              </div>

              <div className="text-center opacity-50">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoCalendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">30-Day Warrior</p>
                <p className="text-xs text-gray-600">Locked</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Motivational Message */}
        {stats && stats.totalChaptersCompleted > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-lg"
          >
            <p className="text-sm text-primary-700">
              <strong>Keep it up!</strong> You've completed {stats.totalChaptersCompleted} chapters
              {stats.averageScore > 0 && ` with an average score of ${stats.averageScore}%`}.
              Keep learning to improve your skills!
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ProgressPage;
