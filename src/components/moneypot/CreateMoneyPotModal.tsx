import React, { useState, useRef } from 'react';
import { X, Calendar, Target, Image as ImageIcon, Upload } from 'lucide-react';
import { CreateMoneyPotForm } from './types';

interface CreateMoneyPotModalProps {
  onClose: () => void;
  onSubmit: (data: CreateMoneyPotForm) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export default function CreateMoneyPotModal({ onClose, onSubmit }: CreateMoneyPotModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CreateMoneyPotForm>({
    title: '',
    description: '',
    unlockType: 'date',
    targetAmount: undefined,
    targetDate: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setImageError('Format de fichier non supporté. Utilisez JPG, JPEG ou PNG.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setImageError('La taille du fichier ne doit pas dépasser 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageError) {
      onSubmit(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Créer une cagnotte</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de la cagnotte
            </label>
            <div 
              className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-300 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setForm({ ...form, image: undefined });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Cliquez pour ajouter une image</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, JPEG ou PNG (max. 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
              />
            </div>
            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la cagnotte
            </label>
            <input
              type="text"
              id="title"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de déblocage
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex items-center justify-center space-x-2 p-4 rounded-xl border ${
                  form.unlockType === 'date'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
                onClick={() => setForm({ ...form, unlockType: 'date' })}
              >
                <Calendar className="h-5 w-5" />
                <span>Par date</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center space-x-2 p-4 rounded-xl border ${
                  form.unlockType === 'amount'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
                onClick={() => setForm({ ...form, unlockType: 'amount' })}
              >
                <Target className="h-5 w-5" />
                <span>Par montant</span>
              </button>
            </div>
          </div>

          {form.unlockType === 'date' ? (
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de déblocage
              </label>
              <input
                type="date"
                id="targetDate"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.targetDate?.toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, targetDate: new Date(e.target.value) })}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Montant cible
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="targetAmount"
                  required
                  min="1000"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: parseInt(e.target.value) })}
                />
                <span className="absolute right-4 top-2 text-gray-500">CFA</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Créer la cagnotte
          </button>
        </form>
      </div>
    </div>
  );
}