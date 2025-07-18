import React, { useState } from 'react';
import { User, Debours, Delegation } from '../types';
import { roleLabels } from '../data/mockData';
import { 
  Users, 
  Settings, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Eye,
  FileText,
  Clock,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  History,
  Save,
  X,
  UserPlus,
  Crown,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface AdminTabProps {
  currentUser: User;
  users: User[];
  debours: Debours[];
  delegations: Delegation[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateDebours: (debours: Debours, modifications: string) => void;
  onCreateDelegation: (delegation: Omit<Delegation, 'id'>) => void;
  onRevokeDelegation: (delegationId: string, motif: string) => void;
}

export function AdminTab({ 
  currentUser, 
  users, 
  debours, 
  delegations,
  onUpdateUser, 
  onDeleteUser, 
  onUpdateDebours,
  onCreateDelegation,
  onRevokeDelegation
}: AdminTabProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'debours' | 'delegations'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDebours, setSelectedDebours] = useState<Debours | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeborsModal, setShowDeborsModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [editedDebours, setEditedDebours] = useState<Debours | null>(null);
  const [modificationReason, setModificationReason] = useState('');
  const [delegationForm, setDelegationForm] = useState({
    delegataireId: '',
    dateDebut: '',
    dateFin: '',
    typeValidation: 'entite' as 'toutes' | 'entite' | 'unite',
    motif: ''
  });

  const filteredUsers = users.filter(user => 
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDebours = debours.filter(d => 
    d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.collaborateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.collaborateur.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canAssignAdmin = currentUser.role === 'directeur';
  const canDelegate = ['responsable_entite', 'responsable_unite', 'directeur'].includes(currentUser.role);
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setShowEditModal(true);
  };

  const handleAssignAdmin = (user: User) => {
    const updatedUser = {
      ...user,
      role: 'admin' as const,
      isAdminBy: currentUser.id,
      adminSince: new Date().toISOString()
    };
    onUpdateUser(updatedUser);
  };

  const handleRevokeAdmin = (user: User) => {
    const updatedUser = {
      ...user,
      role: user.entite ? 'responsable_entite' : user.unite ? 'responsable_unite' : 'collaborateur' as const,
      isAdminBy: undefined,
      adminSince: undefined
    };
    onUpdateUser(updatedUser);
  };

  const handleEditDebours = (debours: Debours) => {
    setSelectedDebours(debours);
    setEditedDebours({ ...debours });
    setShowDeborsModal(true);
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
    setShowDelegationModal(false);
    setDelegationForm({
      delegataireId: '',
      dateDebut: '',
      dateFin: '',
      typeValidation: 'entite',
      motif: ''
    });
  };

  const handleSaveUser = () => {
    if (editedUser) {
      onUpdateUser(editedUser);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditedUser(null);
    }
  };

  const handleSaveDebours = () => {
    if (editedDebours && modificationReason.trim()) {
      onUpdateDebours(editedDebours, modificationReason);
      setShowDeborsModal(false);
      setSelectedDebours(null);
      setEditedDebours(null);
      setModificationReason('');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setShowDeborsModal(false);
    setShowDelegationModal(false);
    setSelectedUser(null);
    setSelectedDebours(null);
    setEditedUser(null);
    setEditedDebours(null);
    setModificationReason('');
  };

  const adminTabs = [
    { id: 'users', label: 'Gestion des utilisateurs', icon: Users, count: users.length },
    { id: 'debours', label: 'Gestion des débours', icon: FileText, count: debours.length },
    { id: 'delegations', label: 'Délégations', icon: ArrowRight, count: delegations.length }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Administration</h2>
              <p className="text-pink-100 text-lg">
                Gestion avancée des utilisateurs, débours et délégations
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="font-semibold">Accès administrateur</p>
                  <p className="text-sm text-pink-100">
                    Toutes les modifications sont enregistrées et auditées
                  </p>
                </div>
              </div>
            </div>
            {canAssignAdmin && (
              <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Privilèges directeur</p>
                    <p className="text-sm text-pink-100">
                      Vous pouvez attribuer des rôles administrateur
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation des onglets admin */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Database className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Panneau d'administration</h3>
        </div>
        
        <div className="flex gap-3 mb-6">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeTab === tab.id
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-white text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Rechercher ${activeTab === 'users' ? 'des utilisateurs' : 'des débours'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Gestion des utilisateurs */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Gestion des utilisateurs</h3>
                <p className="text-sm text-gray-600">Modifier les informations et rôles</p>
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg">
                <Plus className="w-4 h-4 inline mr-2" />
                Nouvel utilisateur
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organisation
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.prenom[0]}{user.nom[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'directeur' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'responsable_unite' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'responsable_entite' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {user.entite && <div>Entité: {user.entite}</div>}
                        {user.unite && <div>Unité: {user.unite}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Actif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Gestion des débours */}
      {activeTab === 'debours' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Gestion des débours</h3>
                <p className="text-sm text-gray-600">Modifier les débours existants avec traçabilité</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <History className="w-4 h-4" />
                <span className="font-medium">Toutes les modifications sont tracées</span>
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
                    Débours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Montant
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
                {filteredDebours.slice(0, 10).map((debours) => (
                  <tr key={debours.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {debours.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">{debours.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {debours.montant.toFixed(2)} CHF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        debours.statut === 'valide' ? 'bg-green-100 text-green-800' :
                        debours.statut === 'en_attente' ? 'bg-orange-100 text-orange-800' :
                        debours.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {debours.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDebours(debours)}
                          className="text-orange-600 hover:text-orange-800 p-2 rounded-xl hover:bg-orange-50 transition-all duration-200"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
                          title="Historique"
                        >
                          <History className="w-4 h-4" />
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

      {/* Gestion des délégations */}
      {activeTab === 'delegations' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Gestion des délégations</h3>
                <p className="text-sm text-gray-600">Déléguer temporairement vos pouvoirs de validation</p>
              </div>
              {canDelegate && (
                <button
                  onClick={() => setShowDelegationModal(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Nouvelle délégation
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Délégant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Délégué
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Portée
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
                {delegations.map((delegation) => (
                  <tr key={delegation.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {delegation.delegant.prenom[0]}{delegation.delegant.nom[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delegation.delegant.prenom} {delegation.delegant.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {roleLabels[delegation.delegant.role]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {delegation.delegataire.prenom[0]}{delegation.delegataire.nom[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delegation.delegataire.prenom} {delegation.delegataire.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {roleLabels[delegation.delegataire.role]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          {new Date(delegation.dateDebut).toLocaleDateString('fr-CH')} - {new Date(delegation.dateFin).toLocaleDateString('fr-CH')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {delegation.motif}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {delegation.typeValidation === 'toutes' ? 'Toutes' : 
                         delegation.typeValidation === 'entite' ? 'Entité' : 'Unité'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        delegation.statut === 'active' ? 'bg-green-100 text-green-800' :
                        delegation.statut === 'expiree' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {delegation.statut === 'active' ? 'Active' : 
                         delegation.statut === 'expiree' ? 'Expirée' : 'Révoquée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {delegation.statut === 'active' && delegation.delegant.id === currentUser.id && (
                          <button
                            onClick={() => onRevokeDelegation(delegation.id, 'Révoquée par le délégant')}
                            className="text-red-600 hover:text-red-800 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            title="Révoquer la délégation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
                          title="Historique"
                        >
                          <History className="w-4 h-4" />
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

      {/* Modal d'édition utilisateur */}
      {showEditModal && editedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Modifier l'utilisateur</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={editedUser.prenom}
                      onChange={(e) => setEditedUser({...editedUser, prenom: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={editedUser.nom}
                      onChange={(e) => setEditedUser({...editedUser, nom: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                  <select
                    value={editedUser.role}
                    onChange={(e) => setEditedUser({...editedUser, role: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition débours */}
      {showDeborsModal && editedDebours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Modifier le débours</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant (CHF)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedDebours.montant}
                    onChange={(e) => setEditedDebours({...editedDebours, montant: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editedDebours.description}
                    onChange={(e) => setEditedDebours({...editedDebours, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editedDebours.statut}
                    onChange={(e) => setEditedDebours({...editedDebours, statut: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="en_attente">En attente</option>
                    <option value="valide">Validé</option>
                    <option value="rejete">Rejeté</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raison de la modification *</label>
                  <textarea
                    value={modificationReason}
                    onChange={(e) => setModificationReason(e.target.value)}
                    placeholder="Expliquez pourquoi vous modifiez ce débours..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveDebours}
                  disabled={!modificationReason.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg ${
                    !modificationReason.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de délégation */}
      {showDelegationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Créer une délégation</h3>
                <button
                  onClick={handleCancelEdit}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionnez un utilisateur</option>
                    {users.filter(u => u.id !== currentUser.id).map(user => (
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                    <input
                      type="date"
                      value={delegationForm.dateFin}
                      onChange={(e) => setDelegationForm({...delegationForm, dateFin: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portée de la délégation *</label>
                  <select
                    value={delegationForm.typeValidation}
                    onChange={(e) => setDelegationForm({...delegationForm, typeValidation: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateDelegation}
                  disabled={!delegationForm.delegataireId || !delegationForm.dateDebut || !delegationForm.dateFin || !delegationForm.motif.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg ${
                    !delegationForm.delegataireId || !delegationForm.dateDebut || !delegationForm.dateFin || !delegationForm.motif.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-green-600 hover:to-teal-600'
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