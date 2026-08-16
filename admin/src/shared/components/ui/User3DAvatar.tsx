import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Shield,
  UserCog,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useUserProfileStore, UserRole } from '../../stores/useUserProfileStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { cn } from '../../../utils/cn';

interface User3DAvatarProps {
  className?: string;
}

export const User3DAvatar: React.FC<User3DAvatarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { currentUser, availableProfiles, switchRoleProfile, setEditProfileOpen } = useUserProfileStore();
  const { user: authUser, logout } = useAuthStore();
  const { addToast } = useNotificationStore();

  // Active user data preferring authenticated real data
  const displayName = authUser?.name || currentUser.name || 'Utilizador';
  const displayEmail = authUser?.email || currentUser.email || 'utilizador@ntandinho.co.mz';
  const displayRole = authUser?.role === 'ADMIN' ? 'Administrador' : currentUser.role || 'Administrador';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    addToast('Sessão Encerrada', 'Até breve!', 'info');
    navigate('/login');
  };

  const handleOpenEdit = () => {
    setIsOpen(false);
    setEditProfileOpen(true);
  };

  const handleSelectRole = (role: UserRole) => {
    switchRoleProfile(role);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left select-none', className)} ref={menuRef}>
      {/* 3D AVATAR TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'group relative flex items-center p-0.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none',
          'hover:scale-105 active:scale-95',
          isOpen ? 'ring-2 ring-[#F6A823] ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''
        )}
        title={`${displayName} (${displayRole})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* 3D Circular Avatar Container with Depth, Border Gradient & Glow */}
        <div className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#F6A823] via-[#ffc66a] to-amber-200 shadow-md shadow-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
          {/* Inner 3D Sphere & Lighting Effect */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-slate-100 to-slate-300 dark:from-[#1E293B] dark:to-[#0B132B] flex items-center justify-center border border-white/60 dark:border-white/10 shadow-inner">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F6A823] to-amber-600 text-slate-950 font-black text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* 3D Gloss Highlight Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Online Active Indicator Badge with Pulse */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 shadow-sm" />
        </div>
      </button>

      {/* DROPDOWN USER MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          
          {/* User Profile Header Card */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#F6A823] via-[#ffc66a] to-amber-200 shrink-0 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </h4>
                  <Sparkles size={12} className="text-[#F6A823] shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {displayEmail}
                </p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[#d97706] dark:text-[#F6A823] text-[10px] font-extrabold">
                  <Shield size={10} />
                  <span>{displayRole}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
            >
              <UserCog size={15} className="text-slate-400 dark:text-slate-400" />
              <span>Editar Perfil & Foto</span>
            </button>
          </div>

          {/* RBAC Role Profiles Switcher */}
          {availableProfiles && availableProfiles.length > 0 && (
            <div className="p-1.5 border-b border-slate-100 dark:border-slate-800/80">
              <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Alternar Perfil Operacional
              </span>
              <div className="space-y-0.5 mt-0.5 max-h-40 overflow-y-auto custom-scrollbar">
                {availableProfiles.map((p) => {
                  const isCurrent = currentUser?.role === p.role;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleSelectRole(p.role)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl transition-colors cursor-pointer text-left',
                        isCurrent
                          ? 'bg-amber-500/10 text-[#d97706] dark:text-[#F6A823] font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span className="truncate">{p.role}</span>
                      </div>
                      {isCurrent && <CheckCircle2 size={13} className="text-[#F6A823] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Logout Action */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
            >
              <LogOut size={15} className="shrink-0" />
              <span>Sair do Sistema</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
