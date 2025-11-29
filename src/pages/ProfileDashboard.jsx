import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header, BottomNav } from '../components/navigation';
import { Card, Button, LoadingSkeleton } from '../components/common';
import { IoPersonCircle, IoCalendar, IoLogOut, IoNotifications, IoShield, IoMoon, IoLanguage, IoHelpCircle } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  // Get member since date
  const getMemberSince = () => {
    if (!userProfile?.createdAt) return 'Recently';
    return formatDate(userProfile.createdAt);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        title="Profile"
        subtitle="Manage your account"
        showBackButton={false}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card padding="lg">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <IoPersonCircle className="w-20 h-20 text-primary-400" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {userProfile?.displayName || currentUser?.displayName || 'Student'}
                </h2>
                <p className="text-gray-600 mb-3">{currentUser?.email}</p>

                {/* Member Since Badge */}
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-medium">
                  <IoCalendar className="w-4 h-4" />
                  Member since {getMemberSince()}
                </div>
              </div>

              {/* Logout Button */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <div className="flex items-center gap-2">
                  <IoLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Settings</h3>
          <Card padding="none">
            <div className="divide-y divide-gray-200">
              {/* Notifications */}
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <IoNotifications className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
              </button>

              {/* Privacy & Security */}
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <IoShield className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Privacy & Security</h4>
                  <p className="text-sm text-gray-600">Update your password and privacy settings</p>
                </div>
              </button>

              {/* Appearance */}
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <IoMoon className="w-5 h-5 text-accent-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Appearance</h4>
                  <p className="text-sm text-gray-600">Dark mode and display preferences</p>
                </div>
              </button>

              {/* Language */}
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <IoLanguage className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Language</h4>
                  <p className="text-sm text-gray-600">Choose your preferred language</p>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Support</h3>
          <Card padding="none">
            <div className="divide-y divide-gray-200">
              {/* Help Center */}
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <IoHelpCircle className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Help Center</h4>
                  <p className="text-sm text-gray-600">Get help and FAQs</p>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ProfileDashboard;
