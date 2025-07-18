import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { DarkModeToggle } from './DarkModeToggle';
import { useResponsive } from '../hooks/useResponsive';
import { useDarkMode } from '../hooks/useDarkMode';
import { Bell, Search, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  activeDelegations?: number;
}

export function Layout({ children, activeTab, onTabChange, userRole, activeDelegations }: LayoutProps) {
  const { isMobile, isTablet } = useResponsive();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 transition-colors duration-300">
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 shadow-xl">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Débours</h1>
                <p className="text-blue-100 dark:text-blue-200 text-sm">Gestion des débours professionnels</p>
              </div>
              <div className="flex items-center gap-3">
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                <button className="relative p-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm">
                  <User className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 transition-colors duration-300">
          {children}
        </main>
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          userRole={userRole}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        userRole={userRole}
        isCollapsed={isTablet}
        isDarkMode={isDarkMode}
        activeDelegations={activeDelegations}
      />
      <main className="flex-1 p-8 ml-64 lg:ml-80 transition-colors duration-300">
        <header className="mb-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Débours
                </h1>
                <p className="text-blue-100 dark:text-blue-200 text-lg">Plateforme de gestion des débours professionnels</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl pl-10 pr-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                  />
                </div>
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                <button className="relative p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm">
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 bg-opacity-20 rounded-full blur-2xl"></div>
        </header>
        {children}
      </main>
    </div>
  );
}