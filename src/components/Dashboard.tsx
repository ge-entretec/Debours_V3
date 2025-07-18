import React, { useState, useEffect } from 'react';
import { User, Debours } from '../types';
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  CheckCircle, 
  XCircle,
  Euro,
  FileText,
  MapPin,
  AlertTriangle,
  Users,
  Calendar,
  Filter,
  Search,
  Bell,
  MoreVertical,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { statusLabels, sousTypeLabels } from '../data/mockData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  currentUser: User;
  debours: Debours[];
}

export function Dashboard({ currentUser, debours }: DashboardProps) {
  const [timeFilter, setTimeFilter] = useState('week');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getRelevantDebours = () => {
    switch (currentUser.role) {
      case 'collaborateur':
        return debours.filter(d => d.collaborateur.id === currentUser.id);
      case 'responsable_entite':
        return debours.filter(d => 
          d.collaborateur.entite === currentUser.entite &&
          d.collaborateur.role === 'collaborateur'
        );
      case 'responsable_unite':
        return debours.filter(d => 
          d.collaborateur.unite === currentUser.unite &&
          ['collaborateur', 'responsable_entite'].includes(d.collaborateur.role)
        );
      case 'directeur':
        return debours;
      default:
        return [];
    }
  };

  const getFilteredDebours = () => {
    const relevant = getRelevantDebours();
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    
    switch (timeFilter) {
      case 'week':
        return relevant.filter(d => new Date(d.date) >= startOfWeek);
      case 'month':
        return relevant.filter(d => new Date(d.date) >= startOfMonth);
      case 'quarter':
        return relevant.filter(d => new Date(d.date) >= startOfQuarter);
      default:
        return relevant;
    }
  };

  const filteredDebours = getFilteredDebours();
  const relevantDebours = getRelevantDebours();
  const totalMontant = filteredDebours.reduce((sum, d) => sum + d.montant, 0);
  const enAttente = filteredDebours.filter(d => d.statut === 'en_attente').length;
  const valides = filteredDebours.filter(d => d.statut === 'valide').length;
  const rejetes = filteredDebours.filter(d => d.statut === 'rejete').length;
  const moyenneMontant = filteredDebours.length > 0 ? totalMontant / filteredDebours.length : 0;
  const collaborateursActifs = new Set(filteredDebours.map(d => d.collaborateur.id)).size;

  const stats = [
    {
      title: 'Total des débours',
      value: filteredDebours.length,
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Montant total',
      value: `${totalMontant.toFixed(2)} CHF`,
      change: '+8%',
      changeType: 'positive',
      icon: Euro,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Montant moyen',
      value: `${moyenneMontant.toFixed(2)} CHF`,
      change: '-3%',
      changeType: 'negative',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Collaborateurs actifs',
      value: collaborateursActifs,
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  // Données pour les graphiques
  const typeData = filteredDebours.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + d.montant;
    return acc;
  }, {} as Record<string, number>);

  const statutData = filteredDebours.reduce((acc, d) => {
    acc[d.statut] = (acc[d.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top collaborateurs
  const topCollaborateurs = currentUser.role !== 'collaborateur' ? 
    Object.entries(filteredDebours.reduce((acc, d) => {
      const key = `${d.collaborateur.prenom} ${d.collaborateur.nom}`;
      acc[key] = (acc[key] || 0) + d.montant;
      return acc;
    }, {} as Record<string, number>))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5) : [];

  // Configuration des graphiques
  const doughnutData = {
    labels: Object.keys(typeData).map(type => 
      type === 'deplacement' ? 'Déplacement' : 
      type === 'restauration' ? 'Restauration' : type
    ),
    datasets: [
      {
        data: Object.values(typeData),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  const barData = {
    labels: Object.keys(statutData).map(statut => statusLabels[statut as keyof typeof statusLabels]),
    datasets: [
      {
        label: 'Nombre de débours',
        data: Object.values(statutData),
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Montant (CHF)',
        data: [650, 780, 920, 850, 1100, 950],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed} CHF`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const getDeborsIcon = (debours: Debours) => {
    if (debours.type === 'deplacement') {
      return <MapPin className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const getDeborsDetails = (debours: Debours) => {
    const details = [];
    if (debours.sousType) {
      details.push(sousTypeLabels[debours.sousType as keyof typeof sousTypeLabels]);
    }
    if (debours.kilometrage) {
      details.push(`${debours.kilometrage} km`);
    }
    if (debours.missionClient) {
      details.push('Mission client');
    }
    return details.join(' • ');
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'quarter': return 'Ce trimestre';
      default: return 'Période';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec breadcrumb et actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>Débours</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">Tableau de bord</span>
          </nav>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bienvenue, {currentUser.prenom} {currentUser.nom}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Voici un aperçu de vos débours - {getTimeFilterLabel()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 transition-colors duration-300">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 transition-colors duration-300">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as 'card' | 'table')}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <option value="card">Vue cartes</option>
              <option value="table">Vue tableau</option>
            </select>
          </div>

          <button className="relative p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Alerte pour les cadres */}
      {currentUser.indemniteForftaitaire && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 mb-1">Cadre avec indemnité forfaitaire</p>
              <p className="text-sm text-amber-700">
                Montant minimum 50 CHF (sauf mission client) • Pas de déduction forfaitaire pour les repas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Graphiques et visualisations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Répartition par type */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Répartition par type</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Répartition par statut</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Évolution mensuelle</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Section principale avec débours récents et top collaborateurs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Débours récents */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Débours récents</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dernières soumissions</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredDebours.length} débours
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {filteredDebours.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">Aucun débours trouvé</p>
                <p className="text-gray-400 text-sm">Commencez par créer votre premier débours</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDebours.slice(0, 5).map((debours) => (
                  <div key={debours.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-md cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getDeborsIcon(debours)}
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                            {debours.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {debours.collaborateur.prenom} {debours.collaborateur.nom} • {debours.date}
                          </p>
                          {getDeborsDetails(debours) && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {getDeborsDetails(debours)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                        {debours.montant.toFixed(2)} CHF
                      </p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          debours.statut === 'valide' ? 'bg-green-100 text-green-800' :
                          debours.statut === 'en_attente' ? 'bg-orange-100 text-orange-800' :
                          debours.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {statusLabels[debours.statut]}
                        </span>
                        {debours.statut === 'en_attente' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Workflow
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDebours.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                      Voir tous les débours ({filteredDebours.length - 5} autres)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top collaborateurs */}
        {currentUser.role !== 'collaborateur' && topCollaborateurs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top collaborateurs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Classement par montant</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {topCollaborateurs.map(([nom, montant], index) => {
                  const maxMontant = Math.max(...topCollaborateurs.map(([, m]) => m));
                  const percentage = (montant / maxMontant) * 100;
                  
                  return (
                    <div key={nom} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{nom}</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{montant.toFixed(2)} CHF</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                              'bg-gradient-to-r from-blue-400 to-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}