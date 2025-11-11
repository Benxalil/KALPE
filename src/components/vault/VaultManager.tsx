import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useVaults } from '../../hooks/useVaults';
import { Vault, VaultTransaction } from '../../types/vault';
import VaultCard from './VaultCard';
import VaultDetailView from './VaultDetailView';
import CreateVaultModal from './CreateVaultModal';
import EditVaultModal from './EditVaultModal';

interface VaultManagerProps {
  onNavigateBack?: () => void;
}

export default function VaultManager({ onNavigateBack }: VaultManagerProps) {
  const {
    vaults,
    loading,
    error,
    createVault,
    updateVault,
    deleteVault,
    addTransaction,
    getVaultTransactions,
    refetch
  } = useVaults();

  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [vaultTransactions, setVaultTransactions] = useState<VaultTransaction[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);
  const [deleteConfirmVault, setDeleteConfirmVault] = useState<Vault | null>(null);

  useEffect(() => {
    if (selectedVault) {
      fetchTransactions();
    }
  }, [selectedVault]);

  const fetchTransactions = async () => {
    if (selectedVault) {
      try {
        const trans = await getVaultTransactions(selectedVault.id);
        setVaultTransactions(trans);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    }
  };

  const handleCreateVault = async (input: any) => {
    await createVault(input);
    setShowCreateModal(false);
  };

  const handleUpdateVault = async (input: any) => {
    if (editingVault) {
      await updateVault(editingVault.id, input);
      setSelectedVault(null);
      setEditingVault(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteVault = async (vault: Vault) => {
    await deleteVault(vault.id);
    setSelectedVault(null);
    setDeleteConfirmVault(null);
  };

  const handleDeposit = async (amount: number, description?: string) => {
    if (selectedVault) {
      await addTransaction(selectedVault.id, 'deposit', amount, description);
      const updated = vaults.find(v => v.id === selectedVault.id);
      if (updated) {
        setSelectedVault(updated);
      }
      await fetchTransactions();
    }
  };

  const handleWithdraw = async (amount: number, description?: string) => {
    if (selectedVault) {
      await addTransaction(selectedVault.id, 'withdrawal', amount, description);
      const updated = vaults.find(v => v.id === selectedVault.id);
      if (updated) {
        setSelectedVault(updated);
      }
      await fetchTransactions();
    }
  };

  const handleToggleLock = async (isLocked: boolean) => {
    if (selectedVault) {
      await updateVault(selectedVault.id, { isLocked });
      const updated = vaults.find(v => v.id === selectedVault.id);
      if (updated) {
        setSelectedVault(updated);
      }
    }
  };

  if (selectedVault) {
    return (
      <VaultDetailView
        vault={selectedVault}
        transactions={vaultTransactions}
        onBack={() => setSelectedVault(null)}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onToggleLock={handleToggleLock}
        onEdit={() => {
          setEditingVault(selectedVault);
          setShowEditModal(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold">Coffres</h1>
          <button
            onClick={onNavigateBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : vaults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-xl font-semibold mb-2">Aucun coffre</h2>
            <p className="text-gray-600 mb-6">Créez votre premier coffre pour commencer à épargner</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Créer un Coffre
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter un Coffre
            </button>

            <div className="grid grid-cols-1 gap-4">
              {vaults.map(vault => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  onClick={() => setSelectedVault(vault)}
                  onEdit={() => {
                    setEditingVault(vault);
                    setShowEditModal(true);
                  }}
                  onDelete={() => setDeleteConfirmVault(vault)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateVaultModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateVault}
        />
      )}

      {showEditModal && editingVault && (
        <EditVaultModal
          vault={editingVault}
          onClose={() => {
            setShowEditModal(false);
            setEditingVault(null);
          }}
          onSubmit={handleUpdateVault}
        />
      )}

      {deleteConfirmVault && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-2">Supprimer le coffre?</h2>
            <p className="text-gray-600 text-sm mb-6">
              Cette action est irréversible. Le coffre "{deleteConfirmVault.name}" et tous ses historiques seront supprimés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmVault(null)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteVault(deleteConfirmVault)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
