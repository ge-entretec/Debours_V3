import React from 'react';
import { Settings, Eye } from 'lucide-react';
import { User } from '../types';
import { roleLabels } from '../data/mockData';

interface DevModeButtonProps {
  currentUser: User;
  availableUsers: User[];
  onUserChange: (user: User) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DevModeButton({ currentUser, availableUsers, onUserChange, isOpen, onToggle }: DevModeButtonProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onToggle}
        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
        title="Mode développeur"
      >
        <Settings className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl min-w-64 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-700">Mode développeur</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">Changer de vue hiérarchique :</p>
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onUserChange(user);
                  onToggle();
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentUser.id === user.id
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-medium">{user.prenom} {user.nom}</div>
                <div className="text-sm text-gray-500">{roleLabels[user.role]}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}