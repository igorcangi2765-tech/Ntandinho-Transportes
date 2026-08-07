import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationState {
  notifications: NotificationItem[];
  toasts: ToastItem[];
  unreadCount: number;

  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  addToast: (title: string, message?: string, type?: NotificationType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Carga #C849 Chegou a Nampula',
    message: 'Volvo FH16 (João Mucavel) confirmou descarregamento no terminal Nampula.',
    type: 'success',
    timestamp: 'Há 12 minutos',
    read: false,
    link: '/loads',
  },
  {
    id: 'n-2',
    title: 'Manutenção Pendente: Volvo FH16',
    message: 'Alerta de serviço preventivo de travões agendado para o veículo MZ-88-21.',
    type: 'warning',
    timestamp: 'Há 45 minutos',
    read: false,
    link: '/fleet',
  },
  {
    id: 'n-3',
    title: 'Nova Cotação Solicitada: Cervejas de Moçambique',
    message: 'Pedido de transporte para rota Maputo ➔ Beira (3x 40ft containers).',
    type: 'info',
    timestamp: 'Há 2 horas',
    read: true,
    link: '/crm',
  },
  {
    id: 'n-4',
    title: 'Fatura #INV-2026-089 Liquidada',
    message: 'Pagamento de 1.450.000 MT recebido de Tete Mining Corp.',
    type: 'success',
    timestamp: 'Há 4 horas',
    read: true,
    link: '/finance',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  toasts: [],
  unreadCount: initialNotifications.filter((n) => !n.read).length,

  addNotification: (item) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `n-${Date.now()}`,
      timestamp: 'Agora mesmo',
      read: false,
    };
    set((state) => {
      const updated = [newNotif, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  addToast: (title, message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, title, message, type, duration };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
