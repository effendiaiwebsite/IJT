import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const BackButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-target ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label="Go back"
    >
      <IoArrowBack className="w-6 h-6 text-gray-700" />
    </motion.button>
  );
};

export default BackButton;
