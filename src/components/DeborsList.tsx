import React from 'react';
import { User, Debours } from '../types';
import { statusLabels, typeLabels, sousTypeLabels } from '../data/mockData';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  MessageSquare,
  MapPin,
  Car,
  Train,
  Utensils,
  Award,
  TrendingUp
} from 'lucide-react';

interface DeborsListProps {
  debours: Debours[];
  currentUser: User;
  onValidate?: (debours: Debours, action: 'valide' | 'rejete', commentaires?: string) => void;
  onView?: (debours: Debours) => void;
  showActions?: boolean;
}

export function DeborsList({ 
  debours, 
  currentUser, 
  onValidate, 
  onView, 
  showActions = false 
}: DeborsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valide':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejete':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'en_attente':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valide':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
      case 'rejete':
        return 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border border-red-200';
      case 'en_attente':
        return 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTypeIcon = (debours: Debours) => {
    switch (debours.type) {
      case 'deplacement':
        return debours.sousType === 'indemnite_kilometrique' ? 
          <Car className="w-4 h-4 text-blue-500" /> : 
          <Train className="w-4 h-4 text-green-500" />;
      case 'restauration':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
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
    if (debours.lieuMission) {
      details.push(debours.lieuMission.adresse);
    }
    return details;
  };

  const canValidate = (debours: Debours) => {
    if (debours.statut !== 'en_attente') return false;
    
    switch (currentUser.role) {
      case 'responsable_entite':
        return debours.collaborateur.role === 'collaborateur' && 
               debours.collaborateur.entite === currentUser.entite;
      case 'responsable_unite':
        return debours.collaborateur.role === 'responsable_entite' && 
               debours.collaborateur.unite === currentUser.unite;
      case 'directeur':
        return debours.collaborateur.role === 'responsable_unite';
      default:
        return false;
    }
  };

  if (debours.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun débours trouvé</h3>
        <p className="text-gray-500">Les débours apparaîtront ici une fois soumis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liste des débours</h3>
              <p className="text-sm text-gray-600">Gestion et suivi des demandes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {debours.length} débours
            </span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debours.map((debours, index) => (
              <tr key={debours.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {debours.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {debours.collaborateur.prenom[0]}{debours.collaborateur.nom[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {debours.collaborateur.prenom} {debours.collaborateur.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {debours.collaborateur.entite}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                      {getTypeIcon(debours)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {typeLabels[debours.type]}
                      </div>
                      {debours.sousType && (
                        <div className="text-sm text-gray-500">
                          {sousTypeLabels[debours.sousType as keyof typeof sousTypeLabels]}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900 text-lg">
                    {debours.montant.toFixed(2)} CHF
                  </div>
                  {debours.kilometrage && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit">
                      {debours.kilometrage} km
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="max-w-xs">
                    <div className="truncate font-medium">{debours.description}</div>
                    {getDeborsDetails(debours).length > 0 && (
                      <div className="text-xs text-blue-600 mt-1 space-y-1">
                        {getDeborsDetails(debours).slice(0, 2).map((detail, index) => (
                          <div key={index} className="bg-blue-50 px-2 py-1 rounded-full w-fit">
                            {detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(debours.statut)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(debours.statut)}`}>
                      {statusLabels[debours.statut]}
                    </span>
                    {debours.statut === 'en_attente' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                        <Clock className="w-3 h-3 mr-1" />
                        En cours
                      </span>
                    )}
                    {debours.missionClient && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                        <Award className="w-3 h-3 mr-1" />
                        Client
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView?.(debours)}
                      className="text-blue-600 hover:text-blue-800 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    {showActions && canValidate(debours) && (
                      <>
                        <button
                          onClick={() => onValidate?.(debours, 'valide')}
                          className="text-green-600 hover:text-green-800 p-3 rounded-xl hover:bg-green-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                          title="Valider"
                        >
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => onValidate?.(debours, 'rejete')}
                          className="text-red-600 hover:text-red-800 p-3 rounded-xl hover:bg-red-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </>
                    )}
                    
                    {debours.commentaires && (
                      <div className="text-gray-400 hover:text-gray-600 transition-colors p-3 rounded-xl hover:bg-gray-50 shadow-sm hover:shadow-md" title={debours.commentaires}>
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}