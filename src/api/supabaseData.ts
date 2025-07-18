import { supabase } from '../supabaseClient';
import { User, Debours } from '../types';

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('utilisateurs').select('*');
  if (error) throw error;
  // Adapter ici si nécessaire pour correspondre à l'interface User
  return (data || []).map((row: any) => ({
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    role: row.role,
    entite: row.entite,
    unite: row.unite,
    indemniteForftaitaire: row.indemnite_forftaitaire,
    lieuTravailHabituel: row.lieu_travail_habituel,
    domicile: row.domicile,
    avatar: row.avatar,
    isAdminBy: row.is_admin_by,
    adminSince: row.admin_since
  }));
}

export async function fetchDebours(): Promise<Debours[]> {
  const { data, error } = await supabase.from('debours').select('*');
  if (error) throw error;
  // Adapter ici pour correspondre à l'interface Debours
  return (data || []).map((row: any) => ({
    id: row.id,
    date: row.date,
    collaborateur: row.collaborateur_id, // mapping à faire ensuite avec la liste users
    type: row.type,
    sousType: row.sous_type,
    montant: parseFloat(row.montant),
    description: row.description,
    statut: row.statut,
    justificatifs: row.justificatifs || [],
    commentaires: row.commentaires,
    validateur: row.validateur_id,
    dateValidation: row.date_validation,
    historique: row.historique || [],
    lieuMission: row.lieu_mission,
    kilometrage: row.kilometrage,
    heureDebut: row.heure_debut,
    heureFin: row.heure_fin,
    missionClient: row.mission_client,
    respecteRegleAngle: row.respecte_regle_angle,
    distanceDomicile: row.distance_domicile,
    distanceTravail: row.distance_travail,
    numeroCS: row.numero_cs,
    raisonFournitures: row.raison_fournitures,
    delegationUtilisee: row.delegation_utilisee
  }));
}
