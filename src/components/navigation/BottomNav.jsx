import { useLocation, useNavigate } from 'react-router-dom';
import { IoHome, IoBook, IoStatsChart, IoPerson } from 'react-icons/io5';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: IoHome,
      path: '/select-level',
    },
    {
      id: 'exams',
      label: 'Exams',
      icon: IoBook,
      path: '/exams/10th-pass', // Default to 10th pass
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: IoStatsChart,
      path: '/progress',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: IoPerson,
      path: '/profile',
    },
  ];

  const isActive = (path) => {
    if (path === '/select-level') {
      return location.pathname === '/' || location.pathname === '/select-level';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full touch-target relative"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    active ? 'text-primary-500' : 'text-gray-500'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    active ? 'text-primary-500' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
