import { SearchResultItem } from '../types/search.types';

const searchDatabase: SearchResultItem[] = [
  // Customers
  {
    id: 'cust-1',
    title: 'Cervejas de Moçambique (CDM)',
    subtitle: 'Cliente Corporativo • Maputo / Nampula',
    category: 'customer',
    url: '/admin/crm',
    badge: 'Ativo',
  },
  {
    id: 'cust-2',
    title: 'Tete Mining Resources Ltd',
    subtitle: 'Cliente Mineração • Moatize, Tete',
    category: 'customer',
    url: '/admin/crm',
    badge: 'VIP',
  },
  {
    id: 'cust-3',
    title: 'Porto de Nacala Logistics',
    subtitle: 'Operações Portuárias • Nacala',
    category: 'customer',
    url: '/admin/crm',
    badge: 'Ativo',
  },

  // Drivers
  {
    id: 'drv-1',
    title: 'João Mucavel',
    subtitle: 'Motorista Sénior • Carta Classe G • Camião Volvo FH16',
    category: 'driver',
    url: '/admin/fleet',
    badge: 'Em Viagem',
  },
  {
    id: 'drv-2',
    title: 'Mateus Sitoe',
    subtitle: 'Motorista Internacional SADC • Scania R500',
    category: 'driver',
    url: '/admin/fleet',
    badge: 'Fronteira',
  },
  {
    id: 'drv-3',
    title: 'Carlos Tembe',
    subtitle: 'Motorista Cargas Perigosas • MAN TGX',
    category: 'driver',
    url: '/admin/fleet',
    badge: 'Disponível',
  },

  // Vehicles
  {
    id: 'veh-1',
    title: 'Volvo FH16 (Matrícula: MZ-88-21)',
    subtitle: 'Camião Trator 6x4 • Cap: 45 Toneladas',
    category: 'vehicle',
    url: '/admin/fleet',
    badge: 'Operacional',
  },
  {
    id: 'veh-2',
    title: 'Scania R500 (Matrícula: MZ-12-90)',
    subtitle: 'Camião Plataforma SADC • Cap: 38 Toneladas',
    category: 'vehicle',
    url: '/admin/fleet',
    badge: 'Em Rota SADC',
  },
  {
    id: 'veh-3',
    title: 'MAN TGX 33.540 (Matrícula: MZ-44-01)',
    subtitle: 'Carga Líquida / Tanque • Cap: 40.000L',
    category: 'vehicle',
    url: '/admin/fleet',
    badge: 'Manutenção',
  },

  // Trips / Loads
  {
    id: 'trp-1',
    title: 'Viagem #C849: Maputo ➔ Nampula',
    subtitle: 'Container 40ft • Motorista: João Mucavel',
    category: 'trip',
    url: '/operations?tab=trips',
    badge: '75% Concluído',
  },
  {
    id: 'trp-2',
    title: 'Viagem #C850: Beira ➔ Lilongwe (Malawi)',
    subtitle: 'Carga Geral SADC • Motorista: Mateus Sitoe',
    category: 'trip',
    url: '/operations?tab=trips',
    badge: 'Em Despacho',
  },

  // Invoices
  {
    id: 'inv-1',
    title: 'Fatura #INV-2026-089',
    subtitle: 'Tete Mining Corp • Valor: 1.450.000 MZN',
    category: 'invoice',
    url: '/admin/finance',
    badge: 'Pago',
  },
  {
    id: 'inv-2',
    title: 'Fatura #INV-2026-092',
    subtitle: 'Cervejas de Moçambique • Valor: 890.000 MZN',
    category: 'invoice',
    url: '/admin/finance',
    badge: 'Pendente',
  },
];

export const searchService = {
  async search(query: string): Promise<SearchResultItem[]> {
    if (!query || query.trim().length < 2) return [];

    const normalized = query.toLowerCase().trim();
    return searchDatabase.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
    );
  },
};
