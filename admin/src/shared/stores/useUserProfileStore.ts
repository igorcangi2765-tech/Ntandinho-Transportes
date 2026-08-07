import { create } from 'zustand';
import { useNotificationStore } from './useNotificationStore';

export type UserRole = 'Administrador' | 'Gestor de Frota' | 'Contabilista' | 'Operador de Cargas';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  powers: string[];
}

interface UserProfileState {
  currentUser: UserProfile;
  availableProfiles: UserProfile[];
  isEditProfileOpen: boolean;

  // Actions
  setEditProfileOpen: (open: boolean) => void;
  switchRoleProfile: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  canAccessRoute: (path: string) => boolean;
}

const defaultProfiles: UserProfile[] = [
  {
    id: 'usr-1',
    name: "Dr. António N'tandinho",
    email: 'admin@ntandinho.co.mz',
    phone: '+258 84 000 0000',
    role: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    powers: ['Acesso Total', 'Aprovação Financeira', 'Gestão RBAC', 'Configuração de Empresa'],
  },
  {
    id: 'usr-2',
    name: 'Mateus Sitoe',
    email: 'frota@ntandinho.co.mz',
    phone: '+258 84 901 8822',
    role: 'Gestor de Frota',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    powers: ['Despacho de Viagens', 'Alocação de Camiões', 'Inspeções Técnicas', 'Abastecimentos'],
  },
  {
    id: 'usr-3',
    name: 'Lúcia Mabunda',
    email: 'financas@ntandinho.co.mz',
    phone: '+258 82 000 0000',
    role: 'Contabilista',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    powers: ['Emissão de Faturas (IVA 16%)', 'Recibos de Pagamento', 'Relatório DRE', 'Cotações CRM'],
  },
  {
    id: 'usr-4',
    name: 'Carlos Alberto Nhantumbo',
    email: 'cargas@ntandinho.co.mz',
    phone: '+258 84 772 9900',
    role: 'Operador de Cargas',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    powers: ['Emissão de Guias de Transporte', 'Rastreio GPS Telemetria'],
  },
];

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  currentUser: defaultProfiles[0],
  availableProfiles: defaultProfiles,
  isEditProfileOpen: false,

  setEditProfileOpen: (open: boolean) => set({ isEditProfileOpen: open }),

  switchRoleProfile: (role: UserRole) => {
    const profile = get().availableProfiles.find((p) => p.role === role) || defaultProfiles[0];
    set({ currentUser: profile });
    useNotificationStore.getState().addToast(
      'Sessão RBAC Alterada',
      `Visão alterada para perfil: ${profile.name} (${profile.role})`,
      'info'
    );
  },

  updateProfile: (data: Partial<UserProfile>) => {
    set((state) => {
      const updated = { ...state.currentUser, ...data };
      const updatedList = state.availableProfiles.map((p) => (p.id === updated.id ? updated : p));
      return { currentUser: updated, availableProfiles: updatedList, isEditProfileOpen: false };
    });
    useNotificationStore.getState().addToast(
      'Perfil Atualizado',
      'As alterações de perfil e avatar foram guardadas com sucesso!',
      'success'
    );
  },

  canAccessRoute: (path: string) => {
    const { currentUser } = get();
    if (currentUser.role === 'Administrador') return true;

    if (path === '/' || path === '') return true;

    if (currentUser.role === 'Gestor de Frota') {
      return ['/fleet', '/loads'].includes(path);
    }

    if (currentUser.role === 'Contabilista') {
      return ['/finance', '/crm', '/reports'].includes(path);
    }

    if (currentUser.role === 'Operador de Cargas') {
      return ['/loads', '/fleet'].includes(path);
    }

    return true;
  },
}));
