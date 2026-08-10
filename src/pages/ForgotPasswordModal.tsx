import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { requestPasswordReset } from '../services/authService';
import { Mail, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success?: boolean; text?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const res = await requestPasswordReset(email);
    setLoading(false);
    setStatusMessage({ success: res.success, text: res.message });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStatusMessage(null);
        setEmail('');
      }}
      title="Recuperação de Palavra-passe"
      subtitle="Insira o seu email corporativo para receber as instruções de reposição"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {statusMessage?.text && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              statusMessage.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.success && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span className="text-xs">{statusMessage.text}</span>
          </div>
        )}

        <div>
          <label className="block text-slate-300 font-medium mb-1">Email Corporativo *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="seu.nome@ntandinho.co.mz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="stripe-input w-full pl-9"
              required
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="stripe-button-secondary text-xs">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="stripe-button-primary text-xs">
            {loading ? 'A enviar...' : 'Enviar Instruções'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
