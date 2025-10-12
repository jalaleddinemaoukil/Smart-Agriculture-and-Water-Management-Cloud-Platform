export default function StatsCard({ title, value, icon, color, subtitle }) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-600',
      badge: 'bg-blue-500 text-white',
    },
    red: {
      bg: 'bg-red-500',
      border: 'border-l-4 border-red-600',
      text: 'text-white',
      badge: 'bg-white text-red-600',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-l-4 border-orange-500',
      text: 'text-orange-600',
      badge: 'bg-orange-500 text-white',
    },
    cyan: {
      bg: 'bg-cyan-50',
      border: 'border-l-4 border-cyan-500',
      text: 'text-cyan-600',
      badge: 'bg-cyan-500 text-white',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      text: 'text-green-600',
      badge: 'bg-green-500 text-white',
    },
  };

  const styles = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${styles.bg} ${styles.border} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-3xl ${styles.text}`}>
          {icon} {/* Icon inherits color via parent */}
        </div>
        <div className={`${styles.badge} px-3 py-1 rounded-full text-xs font-bold`}>
          LIVE
        </div>
      </div>
      <h3 className={`text-sm font-medium mb-1 ${styles.text}`}>{title}</h3>
      <p className={`text-3xl font-bold mb-1 ${styles.text}`}>{value}</p>
      {subtitle && <p className={`text-xs ${styles.text}`}>{subtitle}</p>}
    </div>
  );
}
