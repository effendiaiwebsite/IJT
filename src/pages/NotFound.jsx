import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/common';
import { IoHome, IoArrowBack, IoSadOutline } from 'react-icons/io5';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <IoSadOutline className="w-16 h-16 text-primary-600" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <IoArrowBack className="w-5 h-5" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="flex items-center justify-center gap-2"
          >
            <IoHome className="w-5 h-5" />
            Go Home
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100"
        >
          <p className="text-sm text-primary-700">
            💡 <strong>Lost?</strong> You can start your learning journey from the home page.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
