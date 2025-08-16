import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabaseClient';
import { X, Check, Eye, Download } from 'lucide-react';

interface AgentRequest {
  id: string;
  full_name: string;
  phone: string;
  location: string;
  id_card_url: string;
  shop_photo_url: string;
  additional_docs: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  rejection_reason?: string;
}

export default function AgentRequestsList() {
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AgentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: AgentRequest) => {
    try {
      const { error: updateError } = await supabase
        .from('agent_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Update user role
      const { error: roleError } = await supabase.auth.admin.updateUserById(
        request.id,
        { user_metadata: { role: 'agent' } }
      );

      if (roleError) throw roleError;

      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleReject = async (request: AgentRequest) => {
    try {
      const { error } = await supabase
        .from('agent_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', request.id);

      if (error) throw error;

      setRejectionReason('');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Demandes d'agents</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{request.full_name}</h2>
                <p className="text-gray-500">{request.phone}</p>
                <p className="text-gray-500">{request.location}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Demande reçue le {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Eye className="h-5 w-5 text-gray-600" />
                </button>

                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request)}
                      className="p-2 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <a
                href={`${supabase.storage.from('documents').getPublicUrl(request.id_card_url).data?.publicUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Carte d'identité
              </a>
              <a
                href={`${supabase.storage.from('documents').getPublicUrl(request.shop_photo_url).data?.publicUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Photo boutique
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              Refuser la demande de {selectedRequest.full_name}
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Raison du refus..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReject(selectedRequest)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}