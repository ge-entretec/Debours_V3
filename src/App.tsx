import React, { useState } from 'react';
import { User, Debours, Delegation } from './types';
import { mockUsers, mockDebours, mockDelegations } from './data/mockData';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DeboursForm } from './components/DeboursForm';
import { DeborsList } from './components/DeborsList';
import { ValidationTab } from './components/ValidationTab';
import { StatsTab } from './components/StatsTab';
import { DevModeButton } from './components/DevModeButton';
import { AdminTab } from './components/AdminTab';
import { useDarkMode } from './hooks/useDarkMode';
import { DelegationTab } from './components/DelegationTab';

function App() {
  const { isDarkMode } = useDarkMode();
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [debours, setDebours] = useState<Debours[]>(mockDebours);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [delegations, setDelegations] = useState<Delegation[]>(mockDelegations);
  const [showDevMode, setShowDevMode] = useState(false);

  const activeDelegations = delegations.filter(d => 
    d.statut === 'active' && 
    (d.delegant.id === currentUser.id || d.delegataire.id === currentUser.id)
  ).length;
  const handleSubmitDebours = (newDebours: Omit<Debours, 'id' | 'historique'>) => {
    const debours: Debours = {
      ...newDebours,
      id: Date.now().toString(),
      statut: 'en_attente',
      historique: [
        {
          date: new Date().toISOString(),
          validateur: currentUser,
          action: 'soumis',
          commentaires: 'Débours soumis pour validation'
        }
      ]
    };
    
    setDebours(prev => [...prev, debours]);
    setActiveTab('my-debours');
  };

  const handleValidateDebours = (debours: Debours, action: string, commentaires: string) => {
    setDebours(prev => prev.map(d => {
      if (d.id === debours.id) {
        return {
          ...d,
          statut: action,
          validateur: currentUser,
          dateValidation: new Date().toISOString(),
          commentaires,
          historique: [
            ...d.historique,
            {
              date: new Date().toISOString(),
              validateur: currentUser,
              action,
              commentaires
            }
          ]
        };
      }
      return d;
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    // Mettre à jour l'utilisateur courant si c'est lui qui a été modifié
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUpdateDebours = (updatedDebours: Debours, modifications: string) => {
    setDebours(prev => prev.map(d => {
      if (d.id === updatedDebours.id) {
        return {
          ...updatedDebours,
          historique: [
            ...d.historique,
            {
              date: new Date().toISOString(),
              validateur: currentUser,
              action: 'modifie',
              commentaires: `Modification admin: ${modifications}`
            }
          ]
        };
      }
      return d;
    }));
  };

  const handleCreateDelegation = (newDelegation: Omit<Delegation, 'id'>) => {
    const delegation: Delegation = {
      ...newDelegation,
      id: Date.now().toString()
    };
    setDelegations(prev => [...prev, delegation]);
  };

  const handleRevokeDelegation = (delegationId: string, motif: string) => {
    setDelegations(prev => prev.map(d => 
      d.id === delegationId 
        ? { 
            ...d, 
            statut: 'revoquee' as const, 
            dateRevocation: new Date().toISOString(),
            motifRevocation: motif
          }
        : d
    ));
  };

  const getUserDebours = () => {
    return debours.filter(d => d.collaborateur.id === currentUser.id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} debours={debours} />;
      case 'new':
        return (
          <DeboursForm 
            currentUser={currentUser} 
            onSubmit={handleSubmitDebours}
            onCancel={() => setActiveTab('dashboard')}
          />
        );
      case 'my-debours':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Mes débours</h2>
              <p className="text-gray-600">Historique de vos débours soumis</p>
            </div>
            <DeborsList 
              debours={getUserDebours()} 
              currentUser={currentUser}
            />
          </div>
        );
      case 'delegation':
        return (
          <DelegationTab 
            currentUser={currentUser} 
            users={users}
            delegations={delegations}
            onCreateDelegation={handleCreateDelegation}
            onRevokeDelegation={handleRevokeDelegation}
          />
        );
      case 'validation':
        return (
          <ValidationTab 
            currentUser={currentUser} 
            debours={debours}
            onValidate={handleValidateDebours}
          />
        );
      case 'stats':
        return <StatsTab currentUser={currentUser} debours={debours} />;
      case 'admin':
        return (
          <AdminTab 
            currentUser={currentUser} 
            users={users}
            debours={debours}
            delegations={delegations}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateDebours={handleUpdateDebours}
            onCreateDelegation={handleCreateDelegation}
            onRevokeDelegation={handleRevokeDelegation}
          />
        );
      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Mon équipe</h2>
              <p className="text-gray-600">Aperçu des débours de votre équipe</p>
            </div>
            <DeborsList 
              debours={debours.filter(d => {
                switch (currentUser.role) {
                  case 'responsable_entite':
                    return d.collaborateur.entite === currentUser.entite;
                  case 'responsable_unite':
                    return d.collaborateur.unite === currentUser.unite;
                  case 'directeur':
                    return true;
                  default:
                    return false;
                }
              })} 
              currentUser={currentUser}
            />
          </div>
        );
      default:
        return <Dashboard currentUser={currentUser} debours={debours} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={currentUser.role}
        activeDelegations={activeDelegations}
      >
        {renderContent()}
      </Layout>
      
      <DevModeButton
        currentUser={currentUser}
        availableUsers={users}
        onUserChange={setCurrentUser}
        isOpen={showDevMode}
        onToggle={() => setShowDevMode(!showDevMode)}
      />
    </div>
  );
}

export default App;