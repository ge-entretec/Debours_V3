import React from 'react';
import { X, Info, MapPin, Clock, Euro, AlertTriangle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  hasIndemniteForftaitaire?: boolean;
}

export function RulesModal({ isOpen, onClose, userRole, hasIndemniteForftaitaire }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Règles de gestion des débours</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Règles pour les cadres avec indemnité forfaitaire */}
          {hasIndemniteForftaitaire && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">Règles spéciales - Cadres avec indemnité forfaitaire</h3>
              </div>
              <div className="space-y-3 text-amber-700">
                <p className="font-medium">• Montant minimum : 50 CHF (sauf missions client)</p>
                <p className="font-medium">• Exception mission client : débours de tout montant accepté</p>
                <p>• L'indemnité forfaitaire couvre :</p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li>- Repas pris seul·e</li>
                  <li>- Petites consommations</li>
                  <li>- Frais de revue</li>
                  <li>- Petits frais de parking</li>
                  <li>- Pourboires</li>
                </ul>
              </div>
            </div>
          )}

          {/* Règles de déplacement */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Frais de déplacement</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Indemnité kilométrique</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• <strong>Barème :</strong> 0.60 CHF/km</p>
                  <p>• <strong>Condition :</strong> Véhicule privé utilisé</p>
                  <p>• <strong>Règle de l'angle :</strong> Le lieu de mission doit former un angle &gt; 90° par rapport au domicile et au lieu de travail</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Transports publics</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Remboursés intégralement</p>
                  <p>• Sur présentation des justificatifs</p>
                  <p>• Billets, abonnements temporaires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Règles de restauration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Euro className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Frais de restauration</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Repas de midi</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• <strong>Montant forfaitaire :</strong> 20 CHF</p>
                  <p>• <strong>Condition :</strong> Lieu de travail &gt; 10km du bureau ou domicile</p>
                  <p>• <strong>Obligation :</strong> Repas pris au plus proche du lieu de mission</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-3">Repas du soir</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <p>• <strong>Montant forfaitaire :</strong> 30 CHF</p>
                  <p>• <strong>Condition :</strong> Travail au-delà de 20h00</p>
                  <p>• <strong>Durée minimum :</strong> 5 heures consécutives de travail</p>
                </div>
              </div>
            </div>
          </div>

          {/* Règles de validation */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Validation et conformité</h3>
            </div>
            <div className="space-y-3 text-gray-600">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Justificatifs requis</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• <strong>Obligatoires :</strong> Montants dépassant les forfaits</p>
                  <p>• <strong>Optionnels :</strong> Montants forfaitaires respectés</p>
                  <p>• <strong>Forfaits :</strong> Repas midi 20 CHF, repas soir 30 CHF, 0.60 CHF/km</p>
                </div>
              </div>
              <p>• Validation obligatoire par le supérieur hiérarchique direct</p>
              <p>• Le non-respect des règles peut entraîner des sanctions disciplinaires</p>
              <p>• Les débours doivent être soumis dans les 30 jours suivant la dépense</p>
            </div>
          </div>

          {/* Exemples pratiques */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemples pratiques</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">✅ Débours valides</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Train Lausanne-Genève pour client (85 CHF)</li>
                  <li>• Repas soir après réunion jusqu'à 21h (30 CHF)</li>
                  <li>• 120 km véhicule personnel mission Berne (72 CHF)</li>
                  <li>• Cadre : mission client 15 CHF (exemption)</li>
                  <li>• Repas midi 18 CHF (forfait, sans justificatif)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">❌ Débours non valides</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Repas midi à 5km du bureau (20 CHF)</li>
                  <li>• Déplacement sans respecter règle angle</li>
                  <li>• Cadre : parking 15 CHF (&lt; 50 CHF, non client)</li>
                  <li>• Repas midi 25 CHF sans justificatif</li>
                  <li>• Transport 0.70 CHF/km sans justificatif</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            J'ai compris les règles
          </button>
        </div>
      </div>
    </div>
  );
}