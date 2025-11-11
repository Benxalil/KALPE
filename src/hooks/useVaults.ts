import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Vault, VaultTransaction, CreateVaultInput, UpdateVaultInput } from '../types/vault';

export function useVaults() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('vaults')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setVaults(data?.map(vault => ({
        id: vault.id,
        userId: vault.user_id,
        name: vault.name,
        purpose: vault.purpose,
        balance: vault.balance,
        targetAmount: vault.target_amount,
        color: vault.color,
        icon: vault.icon,
        isLocked: vault.is_locked,
        createdAt: new Date(vault.created_at),
        updatedAt: new Date(vault.updated_at)
      })) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching vaults');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  const createVault = useCallback(async (input: CreateVaultInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('vaults')
        .insert([{
          user_id: user.id,
          name: input.name,
          purpose: input.purpose,
          target_amount: input.targetAmount,
          color: input.color,
          icon: input.icon,
          balance: 0,
          is_locked: false
        }])
        .select()
        .single();

      if (createError) throw createError;

      const newVault: Vault = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        purpose: data.purpose,
        balance: data.balance,
        targetAmount: data.target_amount,
        color: data.color,
        icon: data.icon,
        isLocked: data.is_locked,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setVaults(prev => [newVault, ...prev]);
      return newVault;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating vault';
      setError(message);
      throw err;
    }
  }, []);

  const updateVault = useCallback(async (vaultId: string, input: UpdateVaultInput) => {
    try {
      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.targetAmount !== undefined) updateData.target_amount = input.targetAmount;
      if (input.color !== undefined) updateData.color = input.color;
      if (input.isLocked !== undefined) updateData.is_locked = input.isLocked;

      const { data, error: updateError } = await supabase
        .from('vaults')
        .update(updateData)
        .eq('id', vaultId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedVault: Vault = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        purpose: data.purpose,
        balance: data.balance,
        targetAmount: data.target_amount,
        color: data.color,
        icon: data.icon,
        isLocked: data.is_locked,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setVaults(prev => prev.map(v => v.id === vaultId ? updatedVault : v));
      return updatedVault;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating vault';
      setError(message);
      throw err;
    }
  }, []);

  const deleteVault = useCallback(async (vaultId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vaults')
        .delete()
        .eq('id', vaultId);

      if (deleteError) throw deleteError;

      setVaults(prev => prev.filter(v => v.id !== vaultId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting vault';
      setError(message);
      throw err;
    }
  }, []);

  const addTransaction = useCallback(async (vaultId: string, type: 'deposit' | 'withdrawal', amount: number, description?: string) => {
    try {
      if (type === 'withdrawal') {
        const vault = vaults.find(v => v.id === vaultId);
        if (!vault || vault.balance < amount) {
          throw new Error('Insufficient balance');
        }
      }

      const { data, error: transError } = await supabase
        .from('vault_transactions')
        .insert([{
          vault_id: vaultId,
          type,
          amount,
          description
        }])
        .select()
        .single();

      if (transError) throw transError;

      const newBalance = type === 'deposit'
        ? vaults.find(v => v.id === vaultId)!.balance + amount
        : vaults.find(v => v.id === vaultId)!.balance - amount;

      const { error: updateError } = await supabase
        .from('vaults')
        .update({ balance: newBalance })
        .eq('id', vaultId);

      if (updateError) throw updateError;

      setVaults(prev => prev.map(v => v.id === vaultId ? { ...v, balance: newBalance } : v));

      return {
        id: data.id,
        vaultId: data.vault_id,
        type: data.type as 'deposit' | 'withdrawal',
        amount: data.amount,
        description: data.description,
        createdAt: new Date(data.created_at)
      } as VaultTransaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding transaction';
      setError(message);
      throw err;
    }
  }, [vaults]);

  const getVaultTransactions = useCallback(async (vaultId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('vault_transactions')
        .select('*')
        .eq('vault_id', vaultId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      return data?.map(trans => ({
        id: trans.id,
        vaultId: trans.vault_id,
        type: trans.type as 'deposit' | 'withdrawal',
        amount: trans.amount,
        description: trans.description,
        createdAt: new Date(trans.created_at)
      })) || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching transactions';
      setError(message);
      throw err;
    }
  }, []);

  return {
    vaults,
    loading,
    error,
    createVault,
    updateVault,
    deleteVault,
    addTransaction,
    getVaultTransactions,
    refetch: fetchVaults
  };
}
