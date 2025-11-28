import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 touch-target flex items-center justify-center';

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 disabled:bg-gray-300 disabled:cursor-not-allowed',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed',
    text: 'bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:text-gray-300 disabled:cursor-not-allowed',
    danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 disabled:bg-gray-300 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
