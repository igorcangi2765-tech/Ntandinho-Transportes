import React, { useState } from 'react';
import { X, User, Camera, Save, Phone, Mail, Shield } from 'lucide-react';
import { useUserProfileStore } from '../../shared/stores/useUserProfileStore';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC = () => {
  const { currentUser, updateProfile, isEditProfileOpen, setEditProfileOpen } = useUserProfileStore();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      avatarUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <div className="max-w-lg w-full bg-navy-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Fixed Header */}
        <div className="p-5 md:p-6 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Editar Perfil de Utilizador</h2>
              <p className="text-[11px] text-slate-400">Fotografia de identificação e contactos corporativos.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditProfileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs flex-1">
            
            {/* Avatar Selector */}
            <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-orange/80 shadow-glow"
                />
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={18} className="text-white" />
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-semibold">Fotografia de Perfil (Avatar):</span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatarUrl(url)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === url ? 'border-brand-orange scale-110 shadow-glow' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Avatar Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-semibold text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Mail size={12} className="text-slate-500" /> E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Phone size={12} className="text-slate-500" /> Telefone Direto
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Shield size={12} className="text-brand-orange" /> Cargo / Nível de Acesso (RBAC)
              </label>
              <input
                type="text"
                readOnly
                value={`${currentUser.role} (${currentUser.role === 'Administrador' ? 'Poderes Totais' : 'Acesso Restrito ao Módulo'})`}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-400 rounded-xl border border-slate-800 text-xs font-semibold cursor-not-allowed"
              />
            </div>

          </div>

          {/* Fixed Footer */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Guardar Alterações do Perfil</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
