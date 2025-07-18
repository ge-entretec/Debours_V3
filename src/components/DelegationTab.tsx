import React, { useState } from 'react';
import { User, Delegation } from '../types';
import { roleLabels } from '../data/mockData';
import { 
  UserPlus, 
  Calendar, 
  Users, 
  Clock, 
  Shield, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Crown,
  Save,
  Ban,
  History
} from 'lucide-react';

interface DelegationTabProps {
  currentUser: User;
  users: User[];
  delegations: Delegation[];
  onCreateDelegation: (delegation: Omit<Delegation, 'id'>) => void;
  onRevokeDelegation: (delegationId: string, motif: string) => void;
}

export function DelegationTab({ 
  currentUser, 
  users, 
  delegations, 
  onCreateDelegation, 
  onRevokeDelegation 
}: DelegationTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [delegationForm, setDelegationForm] = useState({
    delegataireId: '',
    dateDebut: '',
    dateFin: '',
    typeValidation: 'entite' as 'toutes' | 'entite' | 'unite',
    motif: ''
  });

  const userDelegations = delegations.filter(d => 
    d.delegant.id === currentUser.id || d.delegataire.id === currentUser.id
  );

  const activeDelegations = userDelegations.filter(d => d.statut === 'active');
  const pastDelegations = userDelegations.filter(d => d.statut !== 'active');

  const canDelegate = ['responsable_entite', 'responsable_unite', 'directeur'].includes(currentUser.role);
  
  const getEligibleUsers = () => {
    return users.filter(u => u.id !== currentUser.id && u.role !== 'admin');
  };

  const handleCreateDelegation = () => {
    const delegataire = users.find(u => u.id === delegationForm.delegataireId);
    if (!delegataire) return;

    const delegation: Omit<Delegation, 'id'> = {
      delegant: currentUser,
      delegataire,
      dateDebut: delegationForm.dateDebut,
      dateFin: delegationForm.dateFin,
      typeValidation: delegationForm.typeValidation,
      motif: delegationForm.motif,
      statut: 'active',
      dateCreation: new Date().toISOString()
    };

    onCreateDelegation(delegation);
    setShowCreateModal(false);
    setDelegationForm({
      delegataireId: '',
      dateDebut: '',
      dateFin: '',
      typeValidation: 'entite',
      motif: ''
    });
  };

  const handleRevoke = (delegationId: string) => {
    onRevokeDelegation(delegationId, 'Révoquée par le délégant');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'active':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'expiree':
        return 'bg-gradient-to-r from-gray-100 to-gray-100 text-gray-600 border-gray-200';
      case 'revoquee':
        return 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'expiree':
        return <Clock className="w-4 h-4" />;
      case 'revoquee':
        return <Ban className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Gestion des délégations</h2>
                <p className="text-blue-100 text-lg">
                  Déléguer temporairement vos pouvoirs de validation
                </p>
              </div>
            </div>
            {canDelegate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Nouvelle délégation
              </button>
            )}
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 bg-opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Délégations actives</p>
              <p className="text-3xl font-bold text-green-600">{activeDelegations.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Délégations données</p>
              <p className="text-3xl font-bold text-blue-600">
                {delegations.filter(d => d.delegant.id === currentUser.id).length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Délégations reçues</p>
              <p className="text-3xl font-bold text-purple-600">
                {delegations.filter(d => d.delegataire.id === currentUser.id).length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Délégations actives */}
      {activeDelegations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Délégations actives</h3>
                <p className="text-sm text-gray-600">Délégations en cours de validité</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {activeDelegations.map((delegation) => (
                <div key={delegation.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {delegation.delegant.id === currentUser.id ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-800">
                            {delegation.delegant.id === currentUser.id ? 'Vous déléguez à' : 'Vous recevez de'}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(delegation.statut)}`}>
                            {getStatusIcon(delegation.statut)}
                            Active
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              {delegation.delegant.id === currentUser.id ? 'Délégué' : 'Délégant'}:
                            </p>
                            <p className="font-medium text-gray-800">
                              {delegation.delegant.id === currentUser.id ? 
                                `${delegation.delegataire.prenom} ${delegation.delegataire.nom}` :
                                `${delegation.delegant.prenom} ${delegation.delegant.nom}`
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Période:</p>
                            <p className="font-medium text-gray-800">
                              {new Date(delegation.dateDebut).toLocaleDateString('fr-CH')} - {new Date(delegation.dateFin).toLocaleDateString('fr-CH')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-600 text-sm">Motif:</p>
                          <p className="text-gray-800 text-sm">{delegation.motif}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        delegation.typeValidation === 'toutes' ? 'bg-purple-100 text-purple-800' :
                        delegation.typeValidation === 'entite' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {delegation.typeValidation === 'toutes' ? 'Toutes' : 
                         delegation.typeValidation === 'entite' ? 'Entité' : 'Unité'}
                      </span>
                      {delegation.delegant.id === currentUser.id && (
                        <button
                          onClick={() => handleRevoke(delegation.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                          title="Révoquer la délégation"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historique des délégations */}
      {pastDelegations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <History className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Historique des délégations</h3>
                <p className="text-sm text-gray-600">Délégations passées et révoquées</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pastDelegations.map((delegation) => (
                <div key={delegation.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                          {getStatusIcon(delegation.statut)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-800">
                            {delegation.delegant.id === currentUser.id ? 'Vous avez délégué à' : 'Vous avez reçu de'}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(delegation.statut)}`}>
                            {getStatusIcon(delegation.statut)}
                            {delegation.statut === 'expiree' ? 'Expirée' : 'Révoquée'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              {delegation.delegant.id === currentUser.id ? 'Délégué' : 'Délégant'}:
                            </p>
                            <p className="font-medium text-gray-800">
                              {delegation.delegant.id === currentUser.id ? 
                                `${delegation.delegataire.prenom} ${delegation.delegataire.nom}` :
                                `${delegation.delegant.prenom} ${delegation.delegant.nom}`
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Période:</p>
                            <p className="font-medium text-gray-800">
                              {new Date(delegation.dateDebut).toLocaleDateString('fr-CH')} - {new Date(delegation.dateFin).toLocaleDateString('fr-CH')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      delegation.typeValidation === 'toutes' ? 'bg-purple-100 text-purple-800' :
                      delegation.typeValidation === 'entite' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {delegation.typeValidation === 'toutes' ? 'Toutes' : 
                       delegation.typeValidation === 'entite' ? 'Entité' : 'Unité'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {userDelegations.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucune délégation</h3>
          <p className="text-gray-500 text-lg mb-6">
            Vous n'avez encore aucune délégation active ou passée
          </p>
          {canDelegate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Créer une délégation
            </button>
          )}
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Créer une délégation</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Délégué *</label>
                  <select
                    value={delegationForm.delegataireId}
                    onChange={(e) => setDelegationForm({...delegationForm, delegataireId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un utilisateur</option>
                    {getEligibleUsers().map(user => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom} ({roleLabels[user.role]})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                    <input
                      type="date"
                      value={delegationForm.dateDebut}
                      onChange={(e) => setDelegationForm({...delegationForm, dateDebut: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                    <input
                      type="date"
                      value={delegationForm.dateFin}
                      onChange={(e) => setDelegationForm({...delegationForm, dateFin: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portée de la délégation *</label>
                  <select
                    value={delegationForm.typeValidation}
                    onChange={(e) => setDelegationForm({...delegationForm, typeValidation: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entite">Mon entité uniquement</option>
                    <option value="unite">Mon unité uniquement</option>
                    <option value="toutes">Toutes mes validations</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motif de la délégation *</label>
                  <textarea
                    value={delegationForm.motif}
                    onChange={(e) => setDelegationForm({...delegationForm, motif: e.target.value})}
                    placeholder="Expliquez la raison de cette délégation..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateDelegation}
                  disabled={!delegationForm.delegataireId || !delegationForm.dateDebut || !delegationForm.dateFin || !delegationForm.motif.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg ${
                    !delegationForm.delegataireId || !delegationForm.dateDebut || !delegationForm.dateFin || !delegationForm.motif.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-blue-600 hover:to-purple-600 hover:shadow-xl'
                  }`}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Créer la délégation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}