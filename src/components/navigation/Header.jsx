import BackButton from './BackButton';

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  rightAction,
  className = '',
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-3 flex-1">
            {showBackButton && <BackButton onClick={onBackClick} />}

            {/* Title and subtitle */}
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right side - Custom action */}
          {rightAction && (
            <div className="ml-2">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
