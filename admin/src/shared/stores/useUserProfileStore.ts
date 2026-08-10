import { create } from 'zustand';
import { useNotificationStore } from './useNotificationStore';

export type UserRole =
  | 'Administrador'
  | 'Gestor'
  | 'Operador'
  | 'Financeiro'
  | 'Responsável de Frota'
  | 'Motorista';

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
    name: "Sérgio N'tandinho",
    email: 'sergio@ntandinho.co.mz',
    phone: '+258 84 300 0001',
    role: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    powers: ['Acesso Total', 'Aprovação Financeira', 'Gestão de Permissões', 'Configuração Global'],
  },
  {
    id: 'usr-2',
    name: 'Maria Nhachungue',
    email: 'maria.operacoes@ntandinho.co.mz',
    phone: '+258 84 300 0002',
    role: 'Gestor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    powers: ['Despacho de Viagens', 'Aprovação de Cotações', 'Gestão de Clientes', 'Relatórios Operacionais'],
  },
  {
    id: 'usr-3',
    name: 'Arnaldo Langa',
    email: 'arnaldo.frota@ntandinho.co.mz',
    phone: '+258 84 300 0003',
    role: 'Responsável de Frota',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    powers: ['Manutenção de Camiões', 'Inspecções Técnicas', 'Vales de Combustível', 'Controlo de Odómetro'],
  },
  {
    id: 'usr-4',
    name: 'Esperança Tembe',
    email: 'esperanca.fin@ntandinho.co.mz',
    phone: '+258 84 300 0004',
    role: 'Financeiro',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    powers: ['Faturação (IVA 16%)', 'Recibos & Pagamentos', 'Fluxo de Caixa', 'Lançamento de Despesas'],
  },
  {
    id: 'usr-5',
    name: 'Eusébio Mabunda',
    email: 'eusebio.nacala@ntandinho.co.mz',
    phone: '+258 84 300 0005',
    role: 'Operador',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    powers: ['Registo de Guias de Transporte', 'Rastreio de Cargas', 'Controlo de Cotações'],
  },
  {
    id: 'usr-6',
    name: 'João Mucavel',
    email: 'joao.motorista@ntandinho.co.mz',
    phone: '+258 84 901 8822',
    role: 'Motorista',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    powers: ['Visualização da Viagem Alocada', 'Registo de Abastecimento'],
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
      'Perfil de Acesso Alterado',
      `Sessão alternada para: ${profile.name} (${profile.role})`,
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
      'As alterações de perfil e dados de contacto foram guardadas!',
      'success'
    );
  },

  canAccessRoute: (path: string) => {
    const { currentUser } = get();
    if (currentUser.role === 'Administrador' || currentUser.role === 'Gestor') return true;

    if (path === '/' || path === '' || path === '/dashboard') return true;

    if (currentUser.role === 'Responsável de Frota') {
      return ['/fleet', '/operations', '/documents'].some((r) => path.startsWith(r));
    }

    if (currentUser.role === 'Financeiro') {
      return ['/finance', '/crm', '/reports', '/documents'].some((r) => path.startsWith(r));
    }

    if (currentUser.role === 'Operador') {
      return ['/operations', '/fleet', '/crm', '/routes', '/services'].some((r) => path.startsWith(r));
    }

    if (currentUser.role === 'Motorista') {
      return ['/operations'].some((r) => path.startsWith(r));
    }

    return true;
  },
}));
