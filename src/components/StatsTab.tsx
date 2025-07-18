import React from 'react';
import { User, Debours } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Euro, 
  FileText,
  Users,
  Calendar,
  Award,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { typeLabels, statusLabels } from '../data/mockData';

interface StatsTabProps {
  currentUser: User;
  debours: Debours[];
}

export function StatsTab({ currentUser, debours }: StatsTabProps) {
  const getRelevantDebours = () => {
    switch (currentUser.role) {
      case 'collaborateur':
        return debours.filter(d => d.collaborateur.id === currentUser.id);
      case 'responsable_entite':
        return debours.filter(d => 
          d.collaborateur.entite === currentUser.entite
        );
      case 'responsable_unite':
        return debours.filter(d => 
          d.collaborateur.unite === currentUser.unite
        );
      case 'directeur':
        return debours;
      default:
        return [];
    }
  };

  const relevantDebours = getRelevantDebours();
  const totalMontant = relevantDebours.reduce((sum, d) => sum + d.montant, 0);
  const moyenneMontant = relevantDebours.length > 0 ? totalMontant / relevantDebours.length : 0;

  // Statistiques par type
  const parType = relevantDebours.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + d.montant;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par statut
  const parStatut = relevantDebours.reduce((acc, d) => {
    acc[d.statut] = (acc[d.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par mois (simulation)
  const parMois = relevantDebours.reduce((acc, d) => {
    const mois = d.date.substring(0, 7); // YYYY-MM
    acc[mois] = (acc[mois] || 0) + d.montant;
    return acc;
  }, {} as Record<string, number>);

  const topCollaborateurs = currentUser.role !== 'collaborateur' ? 
    relevantDebours.reduce((acc, d) => {
      const key = `${d.collaborateur.prenom} ${d.collaborateur.nom}`;
      acc[key] = (acc[key] || 0) + d.montant;
      return acc;
    }, {} as Record<string, number>) : {};

  const mainStats = [
    {
      title: 'Total des débours',
      value: relevantDebours.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Montant total',
      value: `${totalMontant.toFixed(2)} CHF`,
      icon: Euro,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Montant moyen',
      value: `${moyenneMontant.toFixed(2)} CHF`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '-3%',
      changeType: 'negative'
    },
    {
      title: 'Collaborateurs actifs',
      value: new Set(relevantDebours.map(d => d.collaborateur.id)).size,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Statistiques et analyses</h2>
              <p className="text-blue-100 text-lg">
                Vue d'ensemble des débours et indicateurs de performance
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 bg-opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition par type */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Répartition par type</h3>
              <p className="text-sm text-gray-600">Distribution des dépenses</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(parType).map(([type, montant], index) => {
              const maxMontant = Math.max(...Object.values(parType));
              const percentage = (montant / maxMontant) * 100;
              const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];
              const color = colors[index % colors.length];
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {typeLabels[type as keyof typeof typeLabels]}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {montant.toFixed(2)} CHF
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-500 transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Répartition par statut</h3>
              <p className="text-sm text-gray-600">État des demandes</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(parStatut).map(([statut, nombre]) => {
              const maxNombre = Math.max(...Object.values(parStatut));
              const percentage = (nombre / maxNombre) * 100;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'valide': return 'green';
                  case 'en_attente': return 'orange';
                  case 'rejete': return 'red';
                  default: return 'gray';
                }
              };
              const color = getStatusColor(statut);
              
              return (
                <div key={statut} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {statusLabels[statut as keyof typeof statusLabels]}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{nombre}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-500 transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Évolution mensuelle</h3>
              <p className="text-sm text-gray-600">Tendance des dépenses</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(parMois).map(([mois, montant], index) => {
              const maxMontant = Math.max(...Object.values(parMois));
              const percentage = (montant / maxMontant) * 100;
              
              return (
                <div key={mois} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{mois}</span>
                    <span className="text-sm font-bold text-gray-800">{montant.toFixed(2)} CHF</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top collaborateurs (pour les managers) */}
        {currentUser.role !== 'collaborateur' && Object.keys(topCollaborateurs).length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Top collaborateurs</h3>
                <p className="text-sm text-gray-600">Classement par montant</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(topCollaborateurs)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([nom, montant], index) => {
                  const maxMontant = Math.max(...Object.values(topCollaborateurs));
                  const percentage = (montant / maxMontant) * 100;
                  
                  return (
                    <div key={nom} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                          'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{nom}</p>
                          <p className="text-sm font-bold text-gray-700">{montant.toFixed(2)} CHF</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
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
        )}
      </div>
    </div>
  );
}