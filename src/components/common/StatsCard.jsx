import { Card } from './';

const StatsCard = ({ icon: Icon, label, value, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    accent: 'bg-accent-100 text-accent-700',
    error: 'bg-error-100 text-error-700',
  };

  const iconBgColor = colorClasses[color] || colorClasses.primary;

  return (
    <Card padding="md" className="hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Icon */}
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-xs font-medium ${
                trend > 0 ? 'text-secondary-600' : trend < 0 ? 'text-error-600' : 'text-gray-500'
              }`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '−'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
