import React, { useState } from 'react';
import { Share2, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function ShareSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const referralCode = "KALPE123";
  const shareMessage = `Rejoignez-moi sur Kalpé ! Utilisez mon code parrain pour recevoir un bonus de bienvenue : ${referralCode}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div>
      <h2 className="text-lg text-gray-500 mb-4">Partager</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Share2 className="h-6 w-6 text-gray-600" />
              <span>Inviter un ami à rejoindre Kalpé</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600 mb-4">
                Recevez 200F pour chaque nouvel utilisateur qui rejoint Kalpé via votre code
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Message d'invitation :</p>
                  <p className="text-sm text-gray-800">{shareMessage}</p>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Votre code parrain :</p>
                    <p className="font-medium">{referralCode}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Copier le code"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm">
          <Sparkles className="h-6 w-6 text-gray-600" />
          <span>Utiliser le code promotionnel</span>
        </button>
      </div>
    </div>
  );
}