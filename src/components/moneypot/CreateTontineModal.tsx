import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface CreateTontineForm {
  name: string;
  amount: number;
  frequency: 'day' | 'week' | 'month';
  memberCount: number;
  duration: number;
  durationUnit: 'day' | 'week' | 'month';
  unlockFrequency: 'day' | 'week' | 'month';
  image?: File;
}

interface CreateTontineModalProps {
  onClose: () => void;
  onSubmit: (data: CreateTontineForm) => void;
}

const FREQUENCIES = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
];

export default function CreateTontineModal({ onClose, onSubmit }: CreateTontineModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CreateTontineForm>({
    name: '',
    amount: 0,
    frequency: 'month',
    memberCount: 2,
    duration: 1,
    durationUnit: 'month',
    unlockFrequency: 'month',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 my-6 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-2xl font-semibold">Créer une tontine</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="create-tontine-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo de couverture (optionnel)
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
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Tontine Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la tontine
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Amount and Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Montant
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    required
                    min="1000"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={form.amount || ''}
                    onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })}
                  />
                  <span className="absolute right-4 top-2 text-gray-500">CFA</span>
                </div>
              </div>
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Fréquence
                </label>
                <select
                  id="frequency"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}
                >
                  {FREQUENCIES.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      Par {freq.label.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member Count */}
            <div>
              <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de participants
              </label>
              <input
                type="number"
                id="memberCount"
                required
                min="2"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.memberCount}
                onChange={(e) => setForm({ ...form, memberCount: parseInt(e.target.value) })}
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <input
                  type="number"
                  id="duration"
                  required
                  min="1"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unité
                </label>
                <select
                  id="durationUnit"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={form.durationUnit}
                  onChange={(e) => setForm({ ...form, durationUnit: e.target.value as any })}
                >
                  {FREQUENCIES.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}(s)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unlock Frequency */}
            <div>
              <label htmlFor="unlockFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Débloquer chaque
              </label>
              <select
                id="unlockFrequency"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={form.unlockFrequency}
                onChange={(e) => setForm({ ...form, unlockFrequency: e.target.value as any })}
              >
                {FREQUENCIES.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            type="submit"
            form="create-tontine-form"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Créer la tontine
          </button>
        </div>
      </div>
    </div>
  );
}