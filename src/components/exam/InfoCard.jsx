import { Card } from '../common';

const InfoCard = ({ title, icon, children, className = '' }) => {
  return (
    <Card padding="lg" className={className}>
      <div className="flex items-start gap-3 mb-4">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 flex-1">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </Card>
  );
};

export const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600 mb-0.5">{label}</p>
        <p className="text-base text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
