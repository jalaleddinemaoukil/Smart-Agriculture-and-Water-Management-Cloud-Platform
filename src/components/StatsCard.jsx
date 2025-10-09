export default function StatsCard({ title, value, icon, color, subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    orange: 'bg-orange-50',
    cyan: 'bg-cyan-50',
    green: 'bg-green-50',
  };

  return (
    <div className={`${bgColorClasses[color]} rounded-lg shadow-md p-6 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        <div className={`${colorClasses[color]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          LIVE
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}