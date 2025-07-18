import React, { useState, useEffect } from 'react';
import { User, Debours } from '../types';
import { typeLabels, sousTypeLabels, reglesDebours } from '../data/mockData';
import { Upload, AlertCircle, CheckCircle, Info, MapPin, Clock, Calculator, Camera, Scan, FileText, Edit3, Calendar, Sparkles, AlertTriangle, Video, X } from 'lucide-react';
import { RulesModal } from './RulesModal';
import { DocumentAnalysis } from './DocumentAnalysis';

interface DeboursFormProps {
  currentUser: User;
  onSubmit: (debours: Omit<Debours, 'id' | 'historique'>) => void;
  onCancel?: () => void;
}

export function DeboursForm({ currentUser, onSubmit, onCancel }: DeboursFormProps) {
  const [scannedDocument, setScannedDocument] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [lieuRepas, setLieuRepas] = useState('');
  const [distanceError, setDistanceError] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '' as any,
    sousType: '' as any,
    montant: '',
    description: '',
    justificatifs: [] as string[],
    lieuMission: '',
    kilometrage: '',
    heureDebut: '',
    heureFin: '',
    missionClient: false,
    numeroCS: '',
    raisonFournitures: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [justificatifRequired, setJustificatifRequired] = useState(true);

  const isCadre = ['responsable_entite', 'responsable_unite', 'directeur'].includes(currentUser.role);
  const hasIndemniteForftaitaire = currentUser.indemniteForftaitaire;

  const getSousTypes = (type: string) => {
    switch (type) {
      case 'deplacement':
        return ['indemnite_kilometrique', 'transport_public'];
      case 'restauration':
        return isCadre 
          ? ['repas_midi', 'repas_soir', 'repas_client']
          : ['repas_midi', 'repas_soir'];
      default:
        return [];
    }
  };

  const needsDescription = () => {
    return formData.type === 'divers' || 
           (formData.type && !getSousTypes(formData.type).includes(formData.sousType));
  };

  const calculateDistance = async (origin: string, destination: string) => {
    try {
      // Simulation d'appel Google Maps API
      // En réalité, vous devrez utiliser l'API Google Maps Distance Matrix
      const mockDistances = {
        'Restaurant Le Gourmet': 15.2,
        'Café Central': 8.5,
        'Brasserie du Port': 12.8,
        'Restaurant des Alpes': 6.3,
        'Pizzeria Milano': 18.7
      };
      
      const distance = mockDistances[destination as keyof typeof mockDistances] || Math.random() * 25;
      return distance;
    } catch (error) {
      console.error('Erreur calcul distance:', error);
      return null;
    }
  };

  const validateDistance = async () => {
    if (formData.type === 'restauration' && formData.sousType === 'repas_midi' && lieuRepas) {
      const distance = await calculateDistance(
        currentUser.lieuTravailHabituel?.adresse || '',
        lieuRepas
      );
      
      if (distance && distance <= 10) {
        setDistanceError('Le lieu de repas doit être à plus de 10km du lieu de travail');
        setErrors(prev => ({ ...prev, lieuRepas: 'Distance insuffisante' }));
      } else {
        setDistanceError('');
        setErrors(prev => ({ ...prev, lieuRepas: '' }));
      }
    }
  };

  const simulateCameraCapture = () => {
    // Simulation de capture caméra
    setShowCamera(true);
    setTimeout(() => {
      setShowCamera(false);
      setScannedDocument(`photo_${Date.now()}.jpg`);
      setShowAnalysis(true);
    }, 2000);
  };

  const analyzeWithChatGPT = async (file: File) => {
    try {
      // Simulation d'analyse ChatGPT
      // En réalité, vous devrez :
      // 1. Encoder le fichier en base64
      // 2. Envoyer à ChatGPT Vision API via Supabase Edge Function
      // 3. Parser la réponse JSON
      
      const mockAnalysis = {
        montant: 45.80,
        date: '2024-12-05',
        type: 'restauration',
        sousType: 'repas_midi',
        description: 'Restaurant Le Gourmet - Repas client',
        confidence: 0.92
      };
      
      return mockAnalysis;
    } catch (error) {
      console.error('Erreur analyse ChatGPT:', error);
      return null;
    }
  };

  const handleFileAnalysis = async (file: File) => {
    const analysis = await analyzeWithChatGPT(file);
    if (analysis) {
      setFormData(prev => ({
        ...prev,
        montant: analysis.montant.toString(),
        date: analysis.date,
        type: analysis.type,
        sousType: analysis.sousType,
        description: analysis.description,
        justificatifs: [file.name]
      }));
    }
  };

  const simulateDocumentScan = () => {
    const mockDocuments = [
      { type: 'restauration', montant: 45.80, description: 'Restaurant Le Gourmet - Repas client' },
      { type: 'deplacement', montant: 125.50, description: 'Billet CFF Lausanne-Zurich' },
      { type: 'restauration', montant: 28.90, description: 'Café Central - Repas soir' },
      { type: 'deplacement', montant: 89.20, description: 'Taxi aéroport' }
    ];
    
    const randomDoc = mockDocuments[Math.floor(Math.random() * mockDocuments.length)];
    
    setScannedDocument(`document_${Date.now()}.pdf`);
    setShowAnalysis(true);
  };

  const handleAnalysisComplete = (result: any) => {
    setFormData(prev => ({
      ...prev,
      montant: result.montant.toString(),
      date: result.date,
      type: result.type,
      sousType: result.sousType || '',
      description: result.description,
      justificatifs: [scannedDocument || '']
    }));
    setShowAnalysis(false);
  };

  const handleAnalysisCancel = () => {
    setShowAnalysis(false);
    setScannedDocument(null);
  };

  const checkJustificatifRequirement = () => {
    const montant = parseFloat(formData.montant);
    
    if (isCadre) {
      setJustificatifRequired(true);
      return;
    }
    
    if (formData.type === 'restauration' && 
        ((formData.sousType === 'repas_midi' && montant <= 20) ||
         (formData.sousType === 'repas_soir' && montant <= 30))) {
      setJustificatifRequired(false);
    } else if (formData.type === 'deplacement' && 
               formData.sousType === 'indemnite_kilometrique' && 
               formData.kilometrage && 
               montant <= (parseFloat(formData.kilometrage) * 0.60)) {
      setJustificatifRequired(false);
    } else {
      setJustificatifRequired(true);
    }
  };

  const calculateMontant = () => {
    if (formData.type === 'deplacement' && formData.sousType === 'indemnite_kilometrique' && formData.kilometrage) {
      const km = parseFloat(formData.kilometrage);
      if (!isNaN(km)) {
        const montant = km * 0.60;
        setCalculatedAmount(montant);
        setFormData(prev => ({ ...prev, montant: montant.toFixed(2) }));
      }
    } else if (formData.type === 'restauration' && !isCadre) {
      if (formData.sousType === 'repas_midi') {
        setCalculatedAmount(20);
        setFormData(prev => ({ ...prev, montant: '20.00' }));
      } else if (formData.sousType === 'repas_soir') {
        setCalculatedAmount(30);
        setFormData(prev => ({ ...prev, montant: '30.00' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    
    if (!formData.type) {
      newErrors.type = 'Le type de débours est requis';
    }
    
    if (getSousTypes(formData.type).length > 0 && !formData.sousType) {
      newErrors.sousType = 'Le sous-type est requis pour ce type de débours';
    }
    
    if (!formData.montant) {
      newErrors.montant = 'Le montant est requis';
    } else {
      const montant = parseFloat(formData.montant);
      if (isNaN(montant) || montant <= 0) {
        newErrors.montant = 'Le montant doit être un nombre positif';
      } else if (hasIndemniteForftaitaire && montant < 50 && !formData.missionClient) {
        newErrors.montant = 'En tant que cadre avec indemnité forfaitaire, le montant minimum est de 50 CHF (sauf mission client)';
      }
      
      if (justificatifRequired && formData.justificatifs.length === 0) {
        newErrors.justificatifs = 'Un justificatif est requis';
      }
    }
    
    if (needsDescription() && !formData.description.trim()) {
      newErrors.description = 'La description est requise pour ce type de débours';
    }
    
    if (formData.type === 'fournitures') {
      if (!formData.numeroCS) {
        newErrors.numeroCS = 'Le numéro CS ou ACO est requis pour les fournitures';
      }
      if (!formData.raisonFournitures) {
        newErrors.raisonFournitures = 'La raison de l\'achat est requise pour les fournitures';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const debours: Omit<Debours, 'id' | 'historique'> = {
      date: formData.date,
      collaborateur: currentUser,
      type: formData.type,
      sousType: formData.sousType || undefined,
      montant: parseFloat(formData.montant),
      description: formData.description || `${typeLabels[formData.type]} - ${sousTypeLabels[formData.sousType as keyof typeof sousTypeLabels] || 'Standard'}`,
      statut: 'brouillon',
      justificatifs: formData.justificatifs,
      lieuMission: formData.lieuMission ? {
        adresse: formData.lieuMission,
        latitude: 46.5197 + (Math.random() - 0.5) * 0.1,
        longitude: 6.6323 + (Math.random() - 0.5) * 0.1
      } : undefined,
      kilometrage: formData.kilometrage ? parseFloat(formData.kilometrage) : undefined,
      heureDebut: formData.heureDebut || undefined,
      heureFin: formData.heureFin || undefined,
      missionClient: formData.missionClient,
      respecteRegleAngle: formData.type === 'deplacement' && formData.sousType === 'indemnite_kilometrique' 
        ? Math.random() > 0.15 : undefined,
      distanceDomicile: Math.random() * 50,
      distanceTravail: Math.random() * 50,
      numeroCS: formData.numeroCS || undefined,
      raisonFournitures: formData.raisonFournitures || undefined
    };

    onSubmit(debours);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (file) {
        // Analyser le fichier avec ChatGPT
        handleFileAnalysis(file);
      }
    }
  };

  useEffect(() => {
    calculateMontant();
    checkJustificatifRequirement();
  }, [formData.kilometrage, formData.sousType, formData.montant, formData.type]);

  useEffect(() => {
    if (lieuRepas) {
      validateDistance();
    }
  }, [lieuRepas, formData.type, formData.sousType]);

  const sousTypes = getSousTypes(formData.type);

  if (showAnalysis && scannedDocument) {
    return (
      <DocumentAnalysis
        documentName={scannedDocument}
        onAnalysisComplete={handleAnalysisComplete}
        onCancel={handleAnalysisCancel}
      />
    );
  }

  if (showCamera) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Scan en cours...
            </h3>
            <p className="text-gray-600 mb-6">
              Positionnez votre document devant la caméra
            </p>
            <div className="bg-gray-900 rounded-2xl p-8 mb-6">
              <div className="border-2 border-dashed border-white rounded-xl p-8">
                <Camera className="w-16 h-16 text-white mx-auto mb-4" />
                <p className="text-white">Caméra active - Scan automatique</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowCamera(false)}
            className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Nouveau débours</h2>
                    <p className="text-blue-100">
                      {isCadre ? 'Processus optimisé pour cadres' : 'Saisissez les détails de votre débours professionnel'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRulesModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Info className="w-5 h-5" />
                Règles
              </button>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 bg-opacity-20 rounded-full blur-2xl"></div>
        </div>
        
        {hasIndemniteForftaitaire && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">Cadre avec indemnité forfaitaire</p>
                <p className="text-sm text-amber-700">
                  Montant minimum 50 CHF (sauf mission client) • Pas de déduction forfaitaire pour les repas
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8">
          {scannedDocument && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Document scanné avec succès</p>
                  <p className="text-sm text-green-600">{scannedDocument}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne 1: Informations de base */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Informations de base
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de débours *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: key as any, sousType: '' }))}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                            formData.type === key
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-800">{label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.type && (
                      <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  {sousTypes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Sous-type *
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {sousTypes.map((sousType) => (
                          <button
                            key={sousType}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, sousType: sousType as any }))}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                              formData.sousType === sousType
                                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-800">
                              {sousTypeLabels[sousType as keyof typeof sousTypeLabels]}
                            </span>
                            {isCadre && sousType === 'repas_client' && (
                              <span className="block text-xs text-purple-600 mt-0.5">
                                Pas de déduction forfaitaire
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      {errors.sousType && (
                        <p className="mt-2 text-sm text-red-600">{errors.sousType}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne 2: Détails et montant */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  Détails et montant
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant (CHF) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.montant}
                        onChange={(e) => setFormData(prev => ({ ...prev, montant: e.target.value }))}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                          errors.montant ? 'border-red-500' : 'border-gray-300'
                        }`}
                        readOnly={calculatedAmount !== null}
                      />
                      <Calculator className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.montant && (
                      <p className="mt-1 text-sm text-red-600">{errors.montant}</p>
                    )}
                  </div>

                  {formData.type === 'deplacement' && formData.sousType === 'indemnite_kilometrique' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kilométrage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.kilometrage}
                          onChange={(e) => setFormData(prev => ({ ...prev, kilometrage: e.target.value }))}
                          placeholder="Distance en km"
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        />
                        <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {formData.type === 'fournitures' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro CS ou ACO *
                        </label>
                        <input
                          type="text"
                          value={formData.numeroCS}
                          onChange={(e) => setFormData(prev => ({ ...prev, numeroCS: e.target.value }))}
                          placeholder="Ex: CS-2024-001 ou ACO-2024-001"
                          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                            errors.numeroCS ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.numeroCS && (
                          <p className="mt-1 text-sm text-red-600">{errors.numeroCS}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raison de l'achat *
                        </label>
                        <textarea
                          value={formData.raisonFournitures}
                          onChange={(e) => setFormData(prev => ({ ...prev, raisonFournitures: e.target.value }))}
                          placeholder="Expliquez la raison de cet achat de fournitures..."
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                            errors.raisonFournitures ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.raisonFournitures && (
                          <p className="mt-1 text-sm text-red-600">{errors.raisonFournitures}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {isCadre && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
                      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.missionClient}
                          onChange={(e) => setFormData(prev => ({ ...prev, missionClient: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <div>
                          <span className="text-gray-800">Mission client</span>
                          <span className="text-blue-600 ml-1">(exemption règle 50 CHF)</span>
                          <p className="text-xs text-gray-600 mt-1">
                            Cochez si ce débours est directement lié à une mission client
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  {needsDescription() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Décrivez la nature du débours..."
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  )}

                  {/* Lieu de repas pour validation distance */}
                  {formData.type === 'restauration' && formData.sousType === 'repas_midi' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu de repas * (pour contrôle des 10km)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lieuRepas}
                          onChange={(e) => setLieuRepas(e.target.value)}
                          placeholder="Ex: Restaurant Le Gourmet, Rue de la Paix 12, Genève"
                          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                            errors.lieuRepas ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {distanceError && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {distanceError}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        Contrôle automatique avec Google Maps API
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne 3: Justificatifs */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Justificatifs
                </h3>
                
                {formData.justificatifs.length === 0 && justificatifRequired && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center hover:border-orange-400 transition-all duration-300 group">
                      <div className="mb-6">
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl w-fit mx-auto mb-4 group-hover:from-orange-100 group-hover:to-red-100 transition-colors">
                          <Upload className="w-12 h-12 text-orange-500 group-hover:text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajouter un justificatif</h3>
                        <p className="text-sm text-gray-600">Choisissez votre méthode préférée</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 mb-6">
                        {/* Option 1: Scan IA */}
                        <label className="cursor-pointer group/option">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-blue-300">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <Sparkles className="w-8 h-8 text-white" />
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-lg">Scan IA</p>
                                <p className="text-sm text-blue-100 mt-1">Analyse automatique intelligente</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        
                        {/* Option 2: Caméra IA */}
                        <button
                          type="button"
                          onClick={simulateCameraCapture}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-green-300 group/option"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                              <Camera className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-lg">Caméra IA</p>
                              <p className="text-sm text-green-100 mt-1">Scanner avec caméra</p>
                            </div>
                          </div>
                        </button>
                        
                        {/* Option 3: Upload classique */}
                        <label className="cursor-pointer group/option">
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-6 rounded-2xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-gray-400">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-white bg-opacity-70 rounded-xl">
                                <FileText className="w-8 h-8 text-gray-600" />
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-lg">Upload classique</p>
                                <p className="text-sm text-gray-500 mt-1">Sélection manuelle</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) {
                                const fileNames = Array.from(files).map(file => file.name);
                                setFormData(prev => ({
                                  ...prev,
                                  justificatifs: [...prev.justificatifs, ...fileNames]
                                }));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl p-3 border border-blue-200">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Reconnaissance automatique powered by ChatGPT</span>
                      </div>
                    </div>
                    {errors.justificatifs && (
                      <p className="mt-1 text-sm text-red-600">{errors.justificatifs}</p>
                    )}
                  </div>
                )}

                {/* Justificatifs ajoutés */}
                {formData.justificatifs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">Justificatifs ajoutés :</h4>
                    {formData.justificatifs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{file}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            justificatifs: prev.justificatifs.filter((_, i) => i !== index)
                          }))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Informations sur les justificatifs */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Règles des justificatifs</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Repas midi ≤ 20 CHF : pas de justificatif</li>
                    <li>• Repas soir ≤ 30 CHF : pas de justificatif</li>
                    <li>• Déplacement ≤ 0.60 CHF/km : pas de justificatif</li>
                    <li>• Fournitures : toujours justificatif + CS/ACO</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
            <div className="flex items-center gap-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-2 px-8 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                <Info className="w-5 h-5" />
                Consulter les règles
              </button>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-2xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5" />
              Soumettre le débours
            </button>
          </div>
        </form>
      </div>

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        userRole={currentUser.role}
        hasIndemniteForftaitaire={hasIndemniteForftaitaire}
      />
    </div>
  );
}