import React from 'react';
import { 
  Home, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  PlusCircle,
  Settings
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
}

export function BottomNavigation({ activeTab, onTabChange, userRole }: BottomNavigationProps) {
  const getNavItems = () => {
    const items = [
      { id: 'dashboard', icon: Home, label: 'Accueil' },
      { id: 'new', icon: PlusCircle, label: 'Nouveau' },
      { id: 'my-debours', icon: FileText, label: 'Mes débours' },
    ];

    if (userRole !== 'collaborateur') {
      items.push({ id: 'validation', icon: CheckCircle, label: 'Validation' });
    }

    items.push({ id: 'stats', icon: BarChart3, label: 'Stats' });
    
    if (userRole === 'directeur' || userRole === 'admin') {
      items.push({ id: 'admin', icon: Settings, label: 'Admin' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-2xl backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 transition-colors duration-300">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`group flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 ${
              activeTab === item.id
                ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-t from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border border-blue-200 dark:border-blue-700 shadow-lg transform scale-110'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-md' 
                : 'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
            }`}>
              <item.icon className={`w-5 h-5 transition-all duration-300 ${
                activeTab === item.id ? 'text-white' : 'text-current'
              }`} />
            </div>
            <span className="text-xs font-semibold">{item.label}</span>
            {activeTab === item.id && (
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}