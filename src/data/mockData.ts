import { User, Debours, RegleMontant } from '../types';

// Génération de 30 collaborateurs répartis dans différentes entités
export const mockUsers: User[] = [
  // Directeur
  {
    id: '0',
    nom: 'Dubois',
    prenom: 'Sophie',
    email: 'sophie.dubois@company.com',
    role: 'directeur',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Chemin de Bellevue 12, 1006 Lausanne',
      latitude: 46.5289,
      longitude: 6.6156
    }
  },
  // Responsables d'unité
  {
    id: '1',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@company.com',
    role: 'responsable_unite',
    unite: 'Unité 1',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Route de Berne 45, 1010 Lausanne',
      latitude: 46.5584,
      longitude: 6.6389
    }
  },
  {
    id: '2',
    nom: 'Leroy',
    prenom: 'Marc',
    email: 'marc.leroy@company.com',
    role: 'responsable_unite',
    unite: 'Unité 2',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Avenue de Rhodanie 8, 1007 Lausanne',
      latitude: 46.5123,
      longitude: 6.6445
    }
  },
  // Responsables d'entité
  {
    id: '3',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@company.com',
    role: 'responsable_entite',
    entite: 'Entité A',
    unite: 'Unité 1',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Avenue du Léman 25, 1005 Lausanne',
      latitude: 46.5156,
      longitude: 6.6498
    }
  },
  {
    id: '4',
    nom: 'Rousseau',
    prenom: 'Julie',
    email: 'julie.rousseau@company.com',
    role: 'responsable_entite',
    entite: 'Entité B',
    unite: 'Unité 1',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Chemin des Cèdres 18, 1004 Lausanne',
      latitude: 46.5267,
      longitude: 6.6181
    }
  },
  {
    id: '5',
    nom: 'Moreau',
    prenom: 'David',
    email: 'david.moreau@company.com',
    role: 'responsable_entite',
    entite: 'Entité C',
    unite: 'Unité 2',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Route de Chavannes 22, 1007 Lausanne',
      latitude: 46.5089,
      longitude: 6.6234
    }
  },
  {
    id: '6',
    nom: 'Petit',
    prenom: 'Sylvie',
    email: 'sylvie.petit@company.com',
    role: 'responsable_entite',
    entite: 'Entité D',
    unite: 'Unité 2',
    indemniteForftaitaire: true,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: 'Avenue de Tivoli 14, 1007 Lausanne',
      latitude: 46.5234,
      longitude: 6.6378
    }
  },
  // Collaborateurs Entité A
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${7 + i}`,
    nom: ['Dupont', 'Durand', 'Lemaire', 'Bonnet', 'François', 'Michel'][i],
    prenom: ['Jean', 'Paul', 'Anne', 'Claire', 'Thomas', 'Sarah'][i],
    email: `${['jean.dupont', 'paul.durand', 'anne.lemaire', 'claire.bonnet', 'thomas.francois', 'sarah.michel'][i]}@company.com`,
    role: 'collaborateur' as const,
    entite: 'Entité A',
    unite: 'Unité 1',
    indemniteForftaitaire: false,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: `Chemin des ${['Roses', 'Tulipes', 'Lilas', 'Violettes', 'Iris', 'Orchidées'][i]} ${15 + i}, 100${4 + i} Lausanne`,
      latitude: 46.5267 + (Math.random() - 0.5) * 0.02,
      longitude: 6.6181 + (Math.random() - 0.5) * 0.02
    }
  })),
  // Collaborateurs Entité B
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${13 + i}`,
    nom: ['Garcia', 'Rodriguez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez'][i],
    prenom: ['Carlos', 'Maria', 'Antonio', 'Carmen', 'José', 'Ana'][i],
    email: `${['carlos.garcia', 'maria.rodriguez', 'antonio.lopez', 'carmen.gonzalez', 'jose.perez', 'ana.sanchez'][i]}@company.com`,
    role: 'collaborateur' as const,
    entite: 'Entité B',
    unite: 'Unité 1',
    indemniteForftaitaire: false,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: `Avenue des ${['Acacias', 'Chênes', 'Érables', 'Platanes', 'Tilleuls', 'Bouleaux'][i]} ${20 + i}, 100${8 + i} Lausanne`,
      latitude: 46.5156 + (Math.random() - 0.5) * 0.02,
      longitude: 6.6498 + (Math.random() - 0.5) * 0.02
    }
  })),
  // Collaborateurs Entité C
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${19 + i}`,
    nom: ['Weber', 'Müller', 'Schneider', 'Fischer', 'Meyer'][i],
    prenom: ['Hans', 'Petra', 'Klaus', 'Ingrid', 'Stefan'][i],
    email: `${['hans.weber', 'petra.muller', 'klaus.schneider', 'ingrid.fischer', 'stefan.meyer'][i]}@company.com`,
    role: 'collaborateur' as const,
    entite: 'Entité C',
    unite: 'Unité 2',
    indemniteForftaitaire: false,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: `Rue des ${['Pins', 'Sapins', 'Mélèzes', 'Cèdres', 'Cyprès'][i]} ${25 + i}, 101${2 + i} Lausanne`,
      latitude: 46.5089 + (Math.random() - 0.5) * 0.02,
      longitude: 6.6234 + (Math.random() - 0.5) * 0.02
    }
  })),
  // Collaborateurs Entité D
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${24 + i}`,
    nom: ['Rossi', 'Bianchi', 'Ferrari', 'Romano', 'Colombo'][i],
    prenom: ['Marco', 'Giulia', 'Alessandro', 'Francesca', 'Matteo'][i],
    email: `${['marco.rossi', 'giulia.bianchi', 'alessandro.ferrari', 'francesca.romano', 'matteo.colombo'][i]}@company.com`,
    role: 'collaborateur' as const,
    entite: 'Entité D',
    unite: 'Unité 2',
    indemniteForftaitaire: false,
    lieuTravailHabituel: {
      adresse: 'Rue de l\'Entreprise 1, 1000 Lausanne',
      latitude: 46.5197,
      longitude: 6.6323
    },
    domicile: {
      adresse: `Place des ${['Marronniers', 'Peupliers', 'Frênes', 'Ormes', 'Hêtres'][i]} ${30 + i}, 101${7 + i} Lausanne`,
      latitude: 46.5234 + (Math.random() - 0.5) * 0.02,
      longitude: 6.6378 + (Math.random() - 0.5) * 0.02
    }
  }))
];

// Délégations actives
export const mockDelegations = [
  {
    id: '1',
    delegant: mockUsers[3], // Marie Martin (Resp. Entité A)
    delegataire: mockUsers[7], // Jean Dupont (Collaborateur)
    dateDebut: '2024-12-01',
    dateFin: '2024-12-15',
    typeValidation: 'entite',
    motif: 'Congés de fin d\'année',
    statut: 'active',
    dateCreation: '2024-11-28',
  },
  {
    id: '2',
    delegant: mockUsers[1], // Pierre Bernard (Resp. Unité 1)
    delegataire: mockUsers[3], // Marie Martin (Resp. Entité A)
    dateDebut: '2024-12-10',
    dateFin: '2024-12-20',
    typeValidation: 'unite',
    motif: 'Formation management',
    statut: 'active',
    dateCreation: '2024-12-01',
  }
];

// Génération de débours pour une semaine complète (simulation réaliste)
const generateWeekDebours = (): Debours[] => {
  const debours: Debours[] = [];
  const dates = ['2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05', '2024-12-06']; // Lundi à vendredi
  
  // Collaborateurs actifs (environ 70% soumettent des débours)
  const activeUsers = mockUsers.filter(u => u.role === 'collaborateur').slice(0, 20);
  
  activeUsers.forEach((user, userIndex) => {
    // Chaque collaborateur a 1-3 débours dans la semaine
    const nombreDebours = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < nombreDebours; i++) {
      const date = dates[Math.floor(Math.random() * dates.length)];
      const deborType = Math.random();
      
      let newDebours: Debours;
      
      if (deborType < 0.6) {
        // 60% - Déplacements
        const isKilometrique = Math.random() < 0.7;
        if (isKilometrique) {
          const km = Math.floor(Math.random() * 150) + 20;
          const respecteAngle = Math.random() > 0.15; // 85% respectent la règle
          const montant = km * 0.60;
          
          newDebours = {
            id: `${Date.now()}-${userIndex}-${i}`,
            date,
            collaborateur: user,
            type: 'deplacement',
            sousType: 'indemnite_kilometrique',
            montant,
            description: `Déplacement véhicule personnel - ${km} km`,
            statut: 'en_attente',
            justificatifs: respecteAngle && montant <= km * 0.60 ? [] : ['carnet_route.pdf'],
            kilometrage: km,
            lieuMission: {
              adresse: `Mission ${['Genève', 'Berne', 'Zurich', 'Bâle', 'Neuchâtel'][Math.floor(Math.random() * 5)]}`,
              latitude: 46.5197 + (Math.random() - 0.5) * 2,
              longitude: 6.6323 + (Math.random() - 0.5) * 2
            },
            respecteRegleAngle: respecteAngle,
            distanceDomicile: Math.random() * 50 + 10,
            distanceTravail: Math.random() * 50 + 10,
            heureDebut: '08:00',
            heureFin: '17:00',
            missionClient: Math.random() < 0.3,
            historique: [{
              date,
              validateur: user,
              action: 'soumis',
              commentaires: 'Débours soumis pour validation'
            }]
          };
        } else {
          // Transport public
          const montant = Math.random() * 80 + 15;
          newDebours = {
            id: `${Date.now()}-${userIndex}-${i}`,
            date,
            collaborateur: user,
            type: 'deplacement',
            sousType: 'transport_public',
            montant,
            description: 'Transport public pour mission',
            statut: 'en_attente',
            justificatifs: ['billet_transport.pdf'],
            lieuMission: {
              adresse: `Mission ${['Genève', 'Berne', 'Zurich'][Math.floor(Math.random() * 3)]}`,
              latitude: 46.5197 + (Math.random() - 0.5) * 2,
              longitude: 6.6323 + (Math.random() - 0.5) * 2
            },
            respecteRegleAngle: true,
            distanceDomicile: Math.random() * 100 + 20,
            distanceTravail: Math.random() * 100 + 20,
            heureDebut: '08:00',
            heureFin: '17:00',
            missionClient: Math.random() < 0.4,
            historique: [{
              date,
              validateur: user,
              action: 'soumis',
              commentaires: 'Débours soumis pour validation'
            }]
          };
        }
      } else {
        // 40% - Restauration
        const isRepasSoir = Math.random() < 0.3;
        if (isRepasSoir) {
          const montantBase = 30;
          const variation = (Math.random() - 0.5) * 10; // ±5 CHF
          const montant = Math.max(25, montantBase + variation);
          
          newDebours = {
            id: `${Date.now()}-${userIndex}-${i}`,
            date,
            collaborateur: user,
            type: 'restauration',
            sousType: 'repas_soir',
            montant,
            description: 'Repas du soir - travail tardif',
            statut: 'en_attente',
            justificatifs: montant > 30 ? ['facture_restaurant.pdf'] : [],
            heureDebut: '08:00',
            heureFin: Math.random() < 0.8 ? '21:30' : '19:30', // 20% ne respectent pas l'horaire
            lieuMission: {
              adresse: 'Bureau principal',
              latitude: 46.5197,
              longitude: 6.6323
            },
            distanceDomicile: Math.random() * 5 + 1,
            distanceTravail: 0,
            historique: [{
              date,
              validateur: user,
              action: 'soumis',
              commentaires: 'Débours soumis pour validation'
            }]
          };
        } else {
          const montantBase = 20;
          const variation = (Math.random() - 0.5) * 8; // ±4 CHF
          const montant = Math.max(15, montantBase + variation);
          const distanceOk = Math.random() > 0.1; // 90% respectent la distance
          
          newDebours = {
            id: `${Date.now()}-${userIndex}-${i}`,
            date,
            collaborateur: user,
            type: 'restauration',
            sousType: 'repas_midi',
            montant,
            description: 'Repas de midi en mission',
            statut: 'en_attente',
            justificatifs: montant > 20 ? ['facture_restaurant.pdf'] : [],
            lieuMission: {
              adresse: distanceOk ? 'Mission externe' : 'Près du bureau',
              latitude: 46.5197 + (distanceOk ? (Math.random() - 0.5) * 0.2 : 0.01),
              longitude: 6.6323 + (distanceOk ? (Math.random() - 0.5) * 0.2 : 0.01)
            },
            distanceDomicile: distanceOk ? Math.random() * 20 + 12 : Math.random() * 8 + 2,
            distanceTravail: distanceOk ? Math.random() * 20 + 12 : Math.random() * 8 + 2,
            heureDebut: '08:00',
            heureFin: '17:00',
            missionClient: Math.random() < 0.25,
            historique: [{
              date,
              validateur: user,
              action: 'soumis',
              commentaires: 'Débours soumis pour validation'
            }]
          };
        }
      }
      
      debours.push(newDebours);
    }
  });
  
  // Ajouter quelques débours déjà validés/rejetés pour l'historique
  const processedDebours = debours.slice(0, 15).map(d => {
    const random = Math.random();
    if (random < 0.6) {
      // 60% validés
      return {
        ...d,
        statut: 'valide' as const,
        validateur: mockUsers.find(u => u.role === 'responsable_entite' && u.entite === d.collaborateur.entite),
        dateValidation: d.date,
        historique: [
          ...d.historique,
          {
            date: d.date,
            validateur: mockUsers.find(u => u.role === 'responsable_entite' && u.entite === d.collaborateur.entite)!,
            action: 'valide' as const,
            commentaires: 'Débours conforme aux règles'
          }
        ]
      };
    } else if (random < 0.8) {
      // 20% rejetés
      return {
        ...d,
        statut: 'rejete' as const,
        validateur: mockUsers.find(u => u.role === 'responsable_entite' && u.entite === d.collaborateur.entite),
        dateValidation: d.date,
        commentaires: 'Non conforme aux règles internes',
        historique: [
          ...d.historique,
          {
            date: d.date,
            validateur: mockUsers.find(u => u.role === 'responsable_entite' && u.entite === d.collaborateur.entite)!,
            action: 'rejete' as const,
            commentaires: 'Non conforme aux règles internes'
          }
        ]
      };
    }
    return d; // 20% restent en attente
  });
  
  return [...processedDebours, ...debours.slice(15)];
};

export const mockDebours = generateWeekDebours();

export const reglesDebours: RegleMontant[] = [
  {
    type: 'restauration',
    sousType: 'repas_midi',
    montantForftaitaire: 20,
    conditions: ['Distance > 10km du lieu de travail ou domicile', 'Repas pris au plus proche du lieu de mission']
  },
  {
    type: 'restauration',
    sousType: 'repas_soir',
    montantForftaitaire: 30,
    conditions: ['Travail au-delà de 20h00', 'Minimum 5h consécutives de travail']
  },
  {
    type: 'deplacement',
    sousType: 'indemnite_kilometrique',
    montantForftaitaire: 0.60, // CHF par km
    conditions: ['Véhicule privé utilisé', 'Respecter la règle de l\'angle (>90°)']
  }
];

export const typeLabels = {
  deplacement: 'Déplacement',
  restauration: 'Restauration',
  hebergement: 'Hébergement',
  fournitures: 'Fournitures',
  formation: 'Formation',
  divers: 'Divers'
};

export const sousTypeLabels = {
  indemnite_kilometrique: 'Indemnité kilométrique',
  transport_public: 'Transport public',
  repas_midi: 'Repas de midi',
  repas_soir: 'Repas du soir',
  repas_client: 'Repas client',
  mission_client: 'Mission client'
};

export const statusLabels = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  valide: 'Validé',
  rejete: 'Rejeté'
};

export const roleLabels = {
  collaborateur: 'Collaborateur',
  responsable_entite: 'Responsable d\'Entité',
  responsable_unite: 'Responsable d\'Unité',
  directeur: 'Directeur',
  admin: 'Administrateur'
};