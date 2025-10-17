import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, MapPin, AlertTriangle, Download, Settings, X, BarChart3 } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/' },
    { icon: MapPin, label: 'Sensors', path: '/sensors' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Download, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg mb-2 transition
                  ${isActive 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold">
              J
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Jalal Eddine</p>
              <p className="text-xs text-gray-400">jalal@sawmp.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;