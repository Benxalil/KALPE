import React from 'react';
import { Phone, FileText, MapPin } from 'lucide-react';

export default function SupportSection() {
  return (
    <div>
      <h2 className="text-lg text-gray-500 mb-4">Support</h2>
      <div className="space-y-2">
        <button className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm">
          <Phone className="h-6 w-6 text-gray-600" />
          <span>Contactez le service client</span>
        </button>
        
        <button className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm">
          <FileText className="h-6 w-6 text-gray-600" />
          <span>Vérifiez votre plafond</span>
        </button>
        
        <button className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm">
          <MapPin className="h-6 w-6 text-gray-600" />
          <span>Trouvez les agents à proximité</span>
        </button>
      </div>
    </div>
  );
}