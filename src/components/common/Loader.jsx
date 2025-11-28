import { motion } from 'framer-motion';

const Loader = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text = '',
}) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const colors = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    accent: 'border-accent-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} ${colors[color]} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
        {text && (
          <p className="mt-4 text-gray-700 font-medium">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text && (
        <p className="mt-2 text-gray-700 text-sm">{text}</p>
      )}
    </div>
  );
};

export default Loader;
