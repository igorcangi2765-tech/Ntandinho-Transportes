export type SearchCategory = 'customer' | 'driver' | 'vehicle' | 'trip' | 'invoice';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  url: string;
  badge?: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  shortcut?: string;
  iconName: string;
  action: () => void;
}
