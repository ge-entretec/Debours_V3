import React from 'react';
import { 
  Home, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  Users, 
  Settings,
  PlusCircle,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  isCollapsed?: boolean;
  isDarkMode?: boolean;
  activeDelegations?: number;
}

export function Sidebar({ activeTab, onTabChange, userRole, isCollapsed, isDarkMode, activeDelegations = 0 }: SidebarProps) {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', icon: Home, label: 'Tableau de bord', description: 'Vue d\'ensemble' },
      { id: 'new', icon: PlusCircle, label: 'Nouveau débours', description: 'Créer un débours' },
      { id: 'my-debours', icon: FileText, label: 'Mes débours', description: 'Historique personnel' },
    ];

    const delegationItems = [
      { id: 'delegation', icon: UserPlus, label: 'Délégation', description: 'Déléguer mes validations', badge: activeDelegations > 0 ? activeDelegations : null },
    ];
    const managerItems = [
      { id: 'validation', icon: CheckCircle, label: 'Validation', description: 'Approuver les débours' },
      { id: 'team', icon: Users, label: 'Mon équipe', description: 'Gérer l\'équipe' },
    ];

    const statisticsItems = [
      { id: 'stats', icon: BarChart3, label: 'Statistiques', description: 'Analyses et rapports' },
    ];

    const adminItems = [
      { id: 'admin', icon: Settings, label: 'Administration', description: 'Gestion système' },
    ];

    let items = [...commonItems];
    
    // Délégation accessible à tous les utilisateurs (sauf collaborateurs simples)
    if (userRole !== 'collaborateur') {
      items = [...items, ...delegationItems];
    }
    
    if (userRole === 'directeur' || userRole === 'admin') {
      items = [...items, ...adminItems];
    }
    
    if (userRole !== 'collaborateur') {
      items = [...items, ...managerItems];
    }
    
    items = [...items, ...statisticsItems];
    
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-40 ${
      isCollapsed ? 'w-64' : 'w-80'
    } dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300`}>
      <div className="p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Débours {
                userRole === 'admin' ? 'Admin' : ''
                }
              </h2>
              <p className="text-sm text-blue-100 dark:text-blue-200">Gestion des débours</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-400 bg-opacity-20 rounded-full blur-xl"></div>
      </div>
        
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-500'
              }`}>
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-600 group-hover:text-white'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className={`text-xs transition-colors duration-300 ${
                  activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`}>
                  {item.description}
                </p>
                {item.badge && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.id === 'delegation' && activeDelegations > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Shield className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                )}
              </div>
              {activeTab === item.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Section utilisateur en bas */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userRole === 'directeur' ? 'D' : 
                   userRole === 'responsable_unite' ? 'RU' :
                   userRole === 'responsable_entite' ? 'RE' : 'C'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Mode {
                  userRole === 'directeur' ? 'Directeur' : 
                  userRole === 'responsable_unite' ? 'Resp. Unité' :
                  userRole === 'responsable_entite' ? 'Resp. Entité' : 'Collaborateur'
                }</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Connecté</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              userRole === 'admin' ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}