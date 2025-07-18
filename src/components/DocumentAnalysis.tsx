import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Calendar, 
  Euro, 
  FileText, 
  Sparkles, 
  Zap,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { typeLabels, sousTypeLabels } from '../data/mockData';

interface AnalysisResult {
  montant: number;
  date: string;
  type: string;
  sousType?: string;
  description: string;
  confidence: number;
  suggestions?: {
    type?: string[];
    description?: string[];
  };
}

interface DocumentAnalysisProps {
  documentName: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
}

export function DocumentAnalysis({ documentName, onAnalysisComplete, onCancel }: DocumentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<AnalysisResult | null>(null);

  const simulateAIAnalysis = (): AnalysisResult => {
    const mockAnalyses = [
      {
        montant: 45.80,
        date: '2024-12-05',
        type: 'restauration',
        sousType: 'repas_midi',
        description: 'Restaurant Le Gourmet - Repas client',
        confidence: 0.92,
        suggestions: {
          type: ['restauration', 'divers'],
          description: ['Restaurant Le Gourmet', 'Repas d\'affaires client']
        }
      },
      {
        montant: 125.50,
        date: '2024-12-04',
        type: 'deplacement',
        sousType: 'transport_public',
        description: 'Billet CFF Lausanne-Zurich',
        confidence: 0.98,
        suggestions: {
          type: ['deplacement'],
          description: ['Transport CFF Lausanne-Zurich', 'Billet de train']
        }
      },
      {
        montant: 72.60,
        date: '2024-12-03',
        type: 'deplacement',
        sousType: 'indemnite_kilometrique',
        description: 'Déplacement véhicule personnel - 121 km',
        confidence: 0.85,
        suggestions: {
          type: ['deplacement'],
          description: ['Déplacement professionnel', 'Frais kilométriques']
        }
      },
      {
        montant: 28.90,
        date: '2024-12-02',
        type: 'restauration',
        sousType: 'repas_soir',
        description: 'Café Central - Repas tardif',
        confidence: 0.89,
        suggestions: {
          type: ['restauration'],
          description: ['Repas de travail tardif', 'Dîner professionnel']
        }
      },
      {
        montant: 89.20,
        date: '2024-12-01',
        type: 'deplacement',
        sousType: 'transport_public',
        description: 'Taxi aéroport - Mission urgente',
        confidence: 0.76,
        suggestions: {
          type: ['deplacement', 'divers'],
          description: ['Transport taxi', 'Frais de déplacement urgent']
        }
      }
    ];

    return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = simulateAIAnalysis();
      setAnalysisResult(result);
      setEditedResult(result);
      setIsAnalyzing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    if (editedResult) {
      onAnalysisComplete(editedResult);
    }
  };

  const handleEdit = (field: keyof AnalysisResult, value: any) => {
    if (editedResult) {
      setEditedResult({ ...editedResult, [field]: value });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (confidence >= 0.7) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.7) return <AlertCircle className="w-4 h-4" />;
    return <RefreshCw className="w-4 h-4" />;
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
              <Sparkles className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl animate-pulse"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Analyse IA en cours...
          </h3>
          <p className="text-gray-600 mb-6">
            Notre intelligence artificielle analyse votre document et extrait automatiquement les informations
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Document analysé</p>
                <p className="text-sm text-blue-600">{documentName}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
                <span>Reconnaissance optique de caractères (OCR)...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                </div>
                <span>Extraction des montants et dates...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                </div>
                <span>Classification automatique du type de débours...</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResult || !editedResult) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Analyse IA terminée</h3>
                <p className="text-green-100">
                  Vérifiez et modifiez les informations extraites si nécessaire
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${getConfidenceColor(analysisResult.confidence)}`}>
              {getConfidenceIcon(analysisResult.confidence)}
              <span className="text-sm font-medium">
                Confiance: {Math.round(analysisResult.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Informations extraites */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Informations extraites
              </h4>
              
              <div className="space-y-4">
                {/* Montant */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Euro className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Montant</p>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editedResult.montant}
                            onChange={(e) => handleEdit('montant', parseFloat(e.target.value))}
                            className="text-lg font-bold text-gray-800 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-lg font-bold text-gray-800">
                            {editedResult.montant.toFixed(2)} CHF
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Date</p>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editedResult.date}
                            onChange={(e) => handleEdit('date', e.target.value)}
                            className="text-lg font-bold text-gray-800 bg-transparent border-b border-green-300 focus:outline-none focus:border-green-500"
                          />
                        ) : (
                          <p className="text-lg font-bold text-gray-800">
                            {new Date(editedResult.date).toLocaleDateString('fr-CH')}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Type */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Type de débours</p>
                        {isEditing ? (
                          <div className="space-y-2">
                            <select
                              value={editedResult.type}
                              onChange={(e) => handleEdit('type', e.target.value)}
                              className="text-lg font-bold text-gray-800 bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500"
                            >
                              {Object.entries(typeLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                            {editedResult.sousType && (
                              <select
                                value={editedResult.sousType}
                                onChange={(e) => handleEdit('sousType', e.target.value)}
                                className="text-sm text-gray-600 bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500"
                              >
                                {Object.entries(sousTypeLabels).map(([key, label]) => (
                                  <option key={key} value={key}>{label}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-gray-800">
                              {typeLabels[editedResult.type as keyof typeof typeLabels]}
                            </p>
                            {editedResult.sousType && (
                              <p className="text-sm text-gray-600">
                                {sousTypeLabels[editedResult.sousType as keyof typeof sousTypeLabels]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description et suggestions */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Description</h4>
              {isEditing ? (
                <textarea
                  value={editedResult.description}
                  onChange={(e) => handleEdit('description', e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Description du débours..."
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-gray-800">{editedResult.description}</p>
                </div>
              )}
            </div>

            {analysisResult.suggestions && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Suggestions IA
                </h4>
                <div className="space-y-3">
                  {analysisResult.suggestions.description && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Descriptions alternatives :
                      </p>
                      <div className="space-y-2">
                        {analysisResult.suggestions.description.map((desc, index) => (
                          <button
                            key={index}
                            onClick={() => handleEdit('description', desc)}
                            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-xl transition-colors"
                          >
                            {desc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              <X className="w-5 h-5 inline mr-2" />
              Annuler
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Edit3 className="w-5 h-5 inline mr-2" />
              {isEditing ? 'Terminer' : 'Modifier'}
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-5 h-5 inline mr-2" />
            Confirmer et continuer
          </button>
        </div>
      </div>
    </div>
  );
}