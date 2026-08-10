import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar Eliminação',
  cancelText = 'Cancelar',
  isDanger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <h4 className="font-bold text-rose-200 uppercase text-[11px]">Aviso de Ação Irreversível</h4>
            <p className="mt-0.5 text-slate-300">{message}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="stripe-button-secondary text-xs">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`stripe-button-danger text-xs px-4 py-2 font-bold ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
