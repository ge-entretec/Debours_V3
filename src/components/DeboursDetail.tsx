import React from 'react';
import { Debours, User } from '../types';

interface DeboursDetailProps {
  debours: Debours;
  users: User[];
}

export const DeboursDetail: React.FC<DeboursDetailProps> = ({ debours, users }) => {
  const collaborateur = typeof debours.collaborateur === 'string'
  ? users.find(u => u.id === debours.collaborateur)
  : (debours.collaborateur as User | undefined);
const validateur = typeof debours.validateur === 'string'
  ? users.find(u => u.id === debours.validateur)
  : (debours.validateur as User | undefined);
  
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-2">Détail du débours</h2>
      <div className="mb-2">
        <span className="font-semibold">Date :</span> {debours.date}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Collaborateur :</span> {collaborateur ? collaborateur.nom + ' ' + collaborateur.prenom : debours.collaborateur}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Type :</span> {debours.type}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Montant :</span> {debours.montant} €
      </div>
      <div className="mb-2">
        <span className="font-semibold">Statut :</span> {debours.statut}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Validateur :</span> {validateur ? validateur.nom + ' ' + validateur.prenom : debours.validateur}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Commentaires :</span> {debours.commentaires}
      </div>
      {/* Affichage du document scanné ou fichier joint */}
      {debours.justificatifs && debours.justificatifs.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Justificatif :</span>
          {debours.justificatifs.map((url: string, i: number) => (
            <div key={i} className="mt-2">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le document {i+1}</a>
              <div className="mt-1">
                <img src={url} alt={`Justificatif ${i+1}`} className="max-h-48 border rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
