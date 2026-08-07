export type SearchCategory = 'customer' | 'driver' | 'vehicle' | 'trip' | 'invoice';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  url: string;
  badge?: string;
}

const searchDatabase: SearchResultItem[] = [
  {
    id: 'cust-1',
    title: 'Cervejas de Moçambique (CDM)',
    subtitle: 'Cliente Corporativo • Maputo / Nampula',
    category: 'customer',
    url: '/crm',
    badge: 'Ativo',
  },
  {
    id: 'cust-2',
    title: 'Tete Mining Resources Ltd',
    subtitle: 'Cliente Mineração • Moatize, Tete',
    category: 'customer',
    url: '/crm',
    badge: 'VIP',
  },
  {
    id: 'drv-1',
    title: 'João Mucavel',
    subtitle: 'Motorista Sénior • Carta Classe G • Camião Volvo FH16',
    category: 'driver',
    url: '/fleet',
    badge: 'Em Viagem',
  },
  {
    id: 'veh-1',
    title: 'Volvo FH16 (Matrícula: ABM-849-MC)',
    subtitle: 'Camião Trator 6x4 • Cap: 45 Toneladas',
    category: 'vehicle',
    url: '/fleet',
    badge: 'Operacional',
  },
  {
    id: 'trp-1',
    title: 'Viagem #C849: Maputo ➔ Nampula',
    subtitle: 'Container 40ft • Motorista: João Mucavel',
    category: 'trip',
    url: '/loads',
    badge: '75% Concluído',
  },
  {
    id: 'inv-1',
    title: 'Fatura #INV-2026-089',
    subtitle: 'Tete Mining Corp • Valor: 1.450.000 MZN',
    category: 'invoice',
    url: '/finance',
    badge: 'Pago',
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
