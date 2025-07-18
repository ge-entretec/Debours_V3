export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'collaborateur' | 'responsable_entite' | 'responsable_unite' | 'directeur' | 'admin';
  entite?: string;
  unite?: string;
  avatar?: string;
  indemniteForftaitaire?: boolean; // Pour les cadres avec indemnité forfaitaire
  isAdminBy?: string; // ID du directeur qui a attribué le rôle admin
  adminSince?: string; // Date d'attribution du rôle admin
  lieuTravailHabituel?: {
    adresse: string;
    latitude: number;
    longitude: number;
  };
  domicile?: {
    adresse: string;
    latitude: number;
    longitude: number;
  };
}

export interface Delegation {
  id: string;
  delegant: User; // Celui qui délègue
  delegataire: User; // Celui qui reçoit la délégation
  dateDebut: string;
  dateFin: string;
  typeValidation: 'toutes' | 'entite' | 'unite'; // Scope de la délégation
  motif: string;
  statut: 'active' | 'expiree' | 'revoquee';
  dateCreation: string;
  dateRevocation?: string;
  motifRevocation?: string;
}

export interface Debours {
  id: string;
  date: string;
  collaborateur: User;
  type: 'deplacement' | 'restauration' | 'hebergement' | 'fournitures' | 'formation' | 'divers';
  sousType?: 'indemnite_kilometrique' | 'transport_public' | 'repas_midi' | 'repas_soir' | 'mission_client';
  sousType?: 'indemnite_kilometrique' | 'transport_public' | 'repas_midi' | 'repas_soir' | 'repas_client' | 'mission_client';
  montant: number;
  description: string;
  statut: 'brouillon' | 'en_attente' | 'valide' | 'rejete';
  justificatifs: string[];
  commentaires?: string;
  validateur?: User;
  validePar?: 'titulaire' | 'delegation'; // Indique si validé par le titulaire ou un délégué
  delegationUtilisee?: string; // ID de la délégation utilisée
  dateValidation?: string;
  historique: ValidationStep[];
  
  // Champs spécifiques aux nouvelles règles
  lieuMission?: {
    adresse: string;
    latitude: number;
    longitude: number;
  };
  kilometrage?: number;
  heureDebut?: string;
  heureFin?: string;
  missionClient?: boolean;
  respecteRegleAngle?: boolean;
  distanceDomicile?: number;
  distanceTravail?: number;
  
  // Champs spécifiques aux fournitures
  numeroCS?: string; // Numéro de CS ou ACO
  raisonFournitures?: string; // Raison obligatoire pour les fournitures
}

export interface ValidationStep {
  date: string;
  validateur: User;
  action: 'soumis' | 'valide' | 'rejete';
  commentaires?: string;
}

export interface RegleMontant {
  type: string;
  sousType?: string;
  montantForftaitaire?: number;
  montantMax?: number;
  conditions?: string[];
}

export interface Stats {
  totalDebours: number;
  montantTotal: number;
  enAttente: number;
  valides: number;
  rejetes: number;
  parType: Record<string, number>;
  parMois: Record<string, number>;
}