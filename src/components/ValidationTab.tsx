import React, { useState, useMemo } from 'react';
import { User, Debours } from '../types';
import { DeborsList } from './DeborsList';
import { CheckCircle, Clock, AlertCircle, XCircle, Filter, Eye, TrendingUp, Award, Target, Activity, ArrowRight, FileText, CheckSquare } from 'lucide-react';

interface ValidationTabProps {
  currentUser: User;
  debours: Debours[];
  onValidate: (debours: Debours, action: 'valide' | 'rejete', commentaires?: string) => void;
}

export function ValidationTab({ currentUser, debours, onValidate }: ValidationTabProps) {
  const [selectedDebours, setSelectedDebours] = useState<Debours | null>(null);
  const [commentaires, setCommentaires] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'valide' | 'rejete'>('valide');
  const [filterStatus, setFilterStatus] = useState<'all' | 'conforme' | 'non_conforme'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCommentaires, setBulkCommentaires] = useState('');

  const getValidationDebours = () => {
    switch (currentUser.role) {
      case 'responsable_entite':
        return debours.filter(d => 
          d.collaborateur.role === 'collaborateur' && 
          d.collaborateur.entite === currentUser.entite &&
          d.statut === 'en_attente'
        );
      case 'responsable_unite':
        return debours.filter(d => 
          d.collaborateur.role === 'responsable_entite' && 
          d.collaborateur.unite === currentUser.unite &&
          d.statut === 'en_attente'
        );
      case 'directeur':
        return debours.filter(d => 
          d.collaborateur.role === 'responsable_unite' &&
          d.statut === 'en_attente'
        );
      default:
        return [];
    }
  };

  const analyzeCompliance = (debours: Debours) => {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    if (debours.type === 'deplacement' && debours.sousType === 'indemnite_kilometrique') {
      if (!debours.respecteRegleAngle) {
        issues.push('Ne respecte pas la règle de l\'angle (>90°)');
      }
      if (debours.kilometrage && debours.montant > debours.kilometrage * 0.60) {
        issues.push(`Montant supérieur au barème (${(debours.kilometrage * 0.60).toFixed(2)} CHF max)`);
      }
      if (!debours.lieuMission) {
        issues.push('Lieu de mission manquant');
      }
    }
    
    if (debours.type === 'restauration') {
      if (debours.sousType === 'repas_midi') {
        if (debours.distanceTravail !== undefined && debours.distanceTravail <= 10) {
          issues.push('Distance insuffisante (>10km requis)');
        }
        if (debours.montant > 20 && debours.justificatifs.length === 0) {
          warnings.push('Justificatif manquant pour montant > 20 CHF');
        }
      }
      
      if (debours.sousType === 'repas_soir') {
        if (debours.heureFin && new Date(`2024-01-01T${debours.heureFin}`).getHours() < 20) {
          issues.push('Travail ne dépasse pas 20h00');
        }
        if (debours.heureDebut && debours.heureFin) {
          const debut = new Date(`2024-01-01T${debours.heureDebut}`);
          const fin = new Date(`2024-01-01T${debours.heureFin}`);
          const duree = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
          if (duree < 5) {
            issues.push('Durée de travail insuffisante (<5h)');
          }
        }
        if (debours.montant > 30 && debours.justificatifs.length === 0) {
          warnings.push('Justificatif manquant pour montant > 30 CHF');
        }
      }
    }
    
    if (debours.collaborateur.indemniteForftaitaire && 
        debours.montant < 50 && 
        !debours.missionClient) {
      issues.push('Montant < 50 CHF pour cadre (sauf mission client)');
    }
    
    return {
      isCompliant: issues.length === 0,
      issues,
      warnings,
      riskLevel: issues.length > 0 ? 'high' : warnings.length > 0 ? 'medium' : 'low'
    };
  };

  const validationDebours = getValidationDebours();
  
  const analyzedDebours = useMemo(() => {
    return validationDebours.map(d => ({
      ...d,
      compliance: analyzeCompliance(d)
    }));
  }, [validationDebours]);

  const filteredDebours = analyzedDebours.filter(d => {
    if (filterStatus === 'conforme') return d.compliance.isCompliant;
    if (filterStatus === 'non_conforme') return !d.compliance.isCompliant;
    return true;
  });

  const stats = {
    total: analyzedDebours.length,
    conforme: analyzedDebours.filter(d => d.compliance.isCompliant).length,
    nonConforme: analyzedDebours.filter(d => !d.compliance.isCompliant).length,
    warnings: analyzedDebours.filter(d => d.compliance.warnings.length > 0).length
  };

  const handleValidateClick = (debours: Debours, action: 'valide' | 'rejete') => {
    setSelectedDebours(debours);
    setValidationAction(action);
    setShowModal(true);
  };

  const handleConfirmValidation = () => {
    if (selectedDebours) {
      onValidate(selectedDebours, validationAction, commentaires);
      setShowModal(false);
      setSelectedDebours(null);
      setCommentaires('');
    }
  };

  const handleCancelValidation = () => {
    setShowModal(false);
    setSelectedDebours(null);
    setCommentaires('');
  };

  const handleBulkSelect = (deborId: string) => {
    setSelectedForBulk(prev => 
      prev.includes(deborId) 
        ? prev.filter(id => id !== deborId)
        : [...prev, deborId]
    );
  };

  const handleBulkValidation = () => {
    const selectedDebours = filteredDebours.filter(d => selectedForBulk.includes(d.id));
    if (selectedDebours.length > 0) {
      selectedDebours.forEach(debours => {
        onValidate(debours, 'valide', bulkCommentaires || 'Validation en masse - débours conformes');
      });
      setSelectedForBulk([]);
      setBulkCommentaires('');
      setShowBulkModal(false);
    }
  };

  const getComplianceColor = (compliance: any) => {
    if (!compliance.isCompliant) return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200';
    if (compliance.warnings.length > 0) return 'text-orange-600 bg-gradient-to-r from-orange-50 to-yellow-100 border-orange-200';
    return 'text-green-600 bg-gradient-to-r from-green-50 to-emerald-100 border-green-200';
  };

  const getComplianceIcon = (compliance: any) => {
    if (!compliance.isCompliant) return <XCircle className="w-4 h-4" />;
    if (compliance.warnings.length > 0) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const conformeDebours = filteredDebours.filter(d => d.compliance.isCompliant);

  return (
    <div className="space-y-6">
      {/* Workflow de validation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <ArrowRight className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Workflow de validation</h3>
            <p className="text-sm text-gray-600">Circuit hiérarchique des débours</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Étape 1: Soumission */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Soumission</h4>
            <p className="text-sm text-gray-600 text-center">Collaborateur<br/>crée le débours</p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
          
          {/* Étape 2: En attente */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">En attente</h4>
            <p className="text-sm text-gray-600 text-center">Analyse automatique<br/>et file d'attente</p>
            <div className="mt-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-200">
              {stats.total} débours
            </div>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
          
          {/* Étape 3: Validation */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Validation</h4>
            <p className="text-sm text-gray-600 text-center">
              {currentUser.role === 'responsable_entite' ? 'Resp. Entité' :
               currentUser.role === 'responsable_unite' ? 'Resp. Unité' :
               currentUser.role === 'directeur' ? 'Directeur' : 'Hiérarchie'}
              <br/>examine et décide
            </p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
          
          {/* Étape 4: Résultat */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Résultat</h4>
            <p className="text-sm text-gray-600 text-center">Validé ou rejeté<br/>avec commentaires</p>
            <div className="mt-2 flex gap-2">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                {stats.conforme} ✓
              </div>
              <div className="bg-gradient-to-r from-red-100 to-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                {stats.nonConforme} ✗
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques de conformité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En attente de validation</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-blue-600">
            <Activity className="w-4 h-4" />
            Statut: En attente
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conformes</p>
              <p className="text-3xl font-bold text-green-600">{stats.conforme}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-green-600 font-medium">
              {stats.total > 0 ? Math.round((stats.conforme / stats.total) * 100) : 0}% du total
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Non conformes</p>
              <p className="text-3xl font-bold text-red-600">{stats.nonConforme}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-red-600 font-medium">
              {stats.total > 0 ? Math.round((stats.nonConforme / stats.total) * 100) : 0}% du total
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avec alertes</p>
              <p className="text-3xl font-bold text-orange-600">{stats.warnings}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-orange-600 font-medium">
              Nécessitent attention
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Filtrer par conformité :</span>
          <div className="flex gap-3">
            {[
              { key: 'all', label: 'Tous', count: stats.total, color: 'blue' },
              { key: 'conforme', label: 'Conformes', count: stats.conforme, color: 'green' },
              { key: 'non_conforme', label: 'Non conformes', count: stats.nonConforme, color: 'red' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterStatus === filter.key
                    ? `bg-gradient-to-r from-${filter.color}-100 to-${filter.color}-200 text-${filter.color}-700 border border-${filter.color}-300 shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Validation en masse pour les conformes */}
      {filterStatus === 'conforme' && conformeDebours.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Validation en masse</h3>
                <p className="text-sm text-green-600">
                  {selectedForBulk.length} débours sélectionnés pour validation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedForBulk(conformeDebours.map(d => d.id))}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-medium"
              >
                Sélectionner tout
              </button>
              <button
                onClick={() => setSelectedForBulk([])}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Désélectionner
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                disabled={selectedForBulk.length === 0}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedForBulk.length > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Valider la sélection ({selectedForBulk.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredDebours.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {filterStatus === 'all' ? 'Aucun débours en attente' : 'Aucun débours dans cette catégorie'}
          </h3>
          <p className="text-gray-500 text-lg">
            {filterStatus === 'all' 
              ? 'Tous les débours ont été traités avec succès'
              : 'Essayez un autre filtre pour voir les débours'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Débours à valider ({filteredDebours.length})
                  </h3>
                  <p className="text-sm text-gray-600">Analyse automatique et validation manuelle</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium">Analyse automatique activée</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {filterStatus === 'conforme' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <CheckSquare className="w-4 h-4" />
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Conformité
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Collaborateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Débours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Analyse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDebours.map((debours) => (
                  <tr key={debours.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    {filterStatus === 'conforme' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedForBulk.includes(debours.id)}
                          onChange={() => handleBulkSelect(debours.id)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${getComplianceColor(debours.compliance)}`}>
                        {getComplianceIcon(debours.compliance)}
                        {debours.compliance.isCompliant ? 'Conforme' : 'Non conforme'}
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {debours.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {debours.date} • {debours.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {debours.montant.toFixed(2)} CHF
                      </div>
                      {debours.missionClient && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                          <Award className="w-3 h-3 mr-1" />
                          Mission client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {debours.compliance.issues.map((issue, idx) => (
                          <div key={idx} className="text-xs text-red-600 bg-gradient-to-r from-red-50 to-red-100 px-3 py-1 rounded-full border border-red-200">
                            {issue}
                          </div>
                        ))}
                        {debours.compliance.warnings.map((warning, idx) => (
                          <div key={idx} className="text-xs text-orange-600 bg-gradient-to-r from-orange-50 to-yellow-100 px-3 py-1 rounded-full border border-orange-200">
                            {warning}
                          </div>
                        ))}
                        {debours.compliance.isCompliant && debours.compliance.warnings.length === 0 && (
                          <div className="text-xs text-green-600 bg-gradient-to-r from-green-50 to-emerald-100 px-3 py-1 rounded-full border border-green-200">
                            ✓ Toutes les règles respectées
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDetails(showDetails === debours.id ? null : debours.id)}
                          className="text-blue-600 hover:text-blue-800 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <button
                          onClick={() => handleValidateClick(debours, 'valide')}
                          className={`p-2 rounded-xl transition-all duration-200 group ${
                            debours.compliance.isCompliant
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50 shadow-sm hover:shadow-md'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={debours.compliance.isCompliant ? 'Valider' : 'Non conforme - correction requise'}
                          disabled={!debours.compliance.isCompliant}
                        >
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <button
                          onClick={() => handleValidateClick(debours, 'rejete')}
                          className="text-red-600 hover:text-red-800 p-3 rounded-xl hover:bg-red-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {showModal && selectedDebours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${
                  validationAction === 'valide' 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-200' 
                    : 'bg-gradient-to-r from-red-100 to-red-200'
                }`}>
                  {validationAction === 'valide' ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {validationAction === 'valide' ? 'Valider' : 'Rejeter'} le débours
                  </h3>
                  <p className="text-sm text-gray-600">Cette action est définitive</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Collaborateur :</strong> {selectedDebours.collaborateur.prenom} {selectedDebours.collaborateur.nom}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Montant :</strong> {selectedDebours.montant.toFixed(2)} CHF
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Description :</strong> {selectedDebours.description}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Commentaires {validationAction === 'rejete' ? '(obligatoire)' : '(optionnel)'}
                </label>
                <textarea
                  value={commentaires}
                  onChange={(e) => setCommentaires(e.target.value)}
                  rows={4}
                  placeholder={validationAction === 'valide' ? 'Ajoutez un commentaire...' : 'Expliquez la raison du rejet...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleConfirmValidation}
                  disabled={validationAction === 'rejete' && !commentaires.trim()}
                  className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 ${
                    validationAction === 'valide'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                  } ${
                    validationAction === 'rejete' && !commentaires.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'transform hover:scale-105'
                  }`}
                >
                  {validationAction === 'valide' ? 'Valider' : 'Rejeter'}
                </button>
                <button
                  onClick={handleCancelValidation}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de validation en masse */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-200">
                  <CheckSquare className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Validation en masse
                  </h3>
                  <p className="text-sm text-gray-600">Valider {selectedForBulk.length} débours conformes</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <p className="text-sm text-green-700 mb-2">
                  <strong>Débours sélectionnés :</strong> {selectedForBulk.length}
                </p>
                <p className="text-sm text-green-600">
                  Tous les débours sélectionnés sont conformes aux règles
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Commentaires (optionnel)
                </label>
                <textarea
                  value={bulkCommentaires}
                  onChange={(e) => setBulkCommentaires(e.target.value)}
                  rows={3}
                  placeholder="Commentaire pour la validation en masse..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleBulkValidation}
                  className="flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Valider {selectedForBulk.length} débours
                </button>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}