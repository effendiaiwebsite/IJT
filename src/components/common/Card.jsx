import { motion } from 'framer-motion';

const Card = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'card';

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClass = hover ? 'card-hover cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  if (hover || onClick) {
    return (
      <motion.div
        onClick={onClick}
        className={`${baseStyles} ${paddings[padding]} ${hoverClass} ${clickableClass} ${className}`}
        whileHover={hover ? { y: -2 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
