import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface AgentRegistrationProps {
  onClose: () => void;
}

export default function AgentRegistration({ onClose }: AgentRegistrationProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    if (!form.firstName.trim()) return 'Le prénom est requis';
    if (!form.lastName.trim()) return 'Le nom est requis';
    if (!form.phone.trim()) return 'Le numéro de téléphone est requis';
    if (!form.address.trim()) return 'L\'adresse est requis';
    if (!idDocument) return 'Le document d\'identité est requis';
    
    // Validate phone format
    const phoneRegex = /^\+\d{2}-\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      return 'Format de téléphone invalide (ex: +221-771234567)';
    }

    // Validate file
    if (idDocument) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(idDocument.type)) {
        return 'Format de fichier non supporté. Utilisez PDF, JPG ou PNG.';
      }
      if (idDocument.size > 5 * 1024 * 1024) {
        return 'La taille du fichier ne doit pas dépasser 5MB.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Upload ID document
      const fileExt = idDocument!.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('agent-documents')
        .upload(fileName, idDocument!);

      if (uploadError) throw uploadError;

      // Create agent request
      const { error: requestError } = await supabase
        .from('agent_requests')
        .insert({
          user_id: user.id,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          id_document: fileName,
          status: 'pending'
        });

      if (requestError) throw requestError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdDocument(file);
      setError(null);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as +XX-XXXXXXXXX
    if (digits.length >= 3) {
      const countryCode = digits.substring(0, 3);
      const number = digits.substring(3, 12);
      return `+${countryCode}-${number}`;
    }
    
    return value;
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <CheckCircle2 className="h-20 w-20 text-green-500 relative mx-auto animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Demande envoyée !</h2>
          <p className="text-gray-600 mb-4">
            Votre demande pour devenir agent Kalpé a été soumise avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Nous examinerons votre demande dans les plus brefs délais et vous contacterons par téléphone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour aux paramètres"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-2xl font-bold">Devenir agent Kalpé</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Avantages d'être agent Kalpé</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Gagnez des commissions sur chaque transaction</li>
            <li>• Développez votre activité commerciale</li>
            <li>• Accès à un tableau de bord professionnel</li>
            <li>• Support technique dédié</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })}
              placeholder="+221-771234567"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +221-XXXXXXXXX</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse complète <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Votre adresse complète (ville, quartier, rue...)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document d'identité <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-300 transition-colors"
            >
              {idDocument ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">{idDocument.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdDocument(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">
                    Cliquez pour ajouter votre carte d'identité ou passeport
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, JPG, PNG (max. 5MB)
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-2">Conditions d'éligibilité</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Être majeur (18 ans minimum)</li>
              <li>• Posséder un document d'identité valide</li>
              <li>• Avoir une adresse fixe au Sénégal</li>
              <li>• Accepter les conditions générales</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
          </button>
        </form>
      </div>
    </div>
  );
}