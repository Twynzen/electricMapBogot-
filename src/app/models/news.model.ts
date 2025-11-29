/**
 * News and alerts model for ElectricMap Bogotá
 */

export type NewsType =
  | 'outage'      // Station outage/failure
  | 'price'       // Price change
  | 'new_station' // New station opened
  | 'closure'     // Station closed
  | 'promotion'   // Special promotion
  | 'regulation'  // New regulation/law
  | 'general';    // General news

export type NewsPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  type: NewsType;
  priority: NewsPriority;

  // Related station (optional)
  stationId?: string;
  stationName?: string;

  // Related operator (optional)
  operatorId?: string;
  operatorName?: string;

  // Location (optional, for local news)
  locality?: string;

  // Source
  sourceUrl?: string;
  sourceName?: string;
  author?: string;

  // Media
  imageUrl?: string;

  // Timestamps
  publishedAt: Date;
  expiresAt?: Date;
  createdAt: Date;

  // Status
  isActive: boolean;
  viewCount?: number;
}

export function getNewsTypeLabel(type: NewsType): string {
  const labels: Record<NewsType, string> = {
    'outage': 'Falla',
    'price': 'Precio',
    'new_station': 'Nueva estación',
    'closure': 'Cierre',
    'promotion': 'Promoción',
    'regulation': 'Normativa',
    'general': 'General'
  };
  return labels[type] || type;
}

export function getNewsTypeIcon(type: NewsType): string {
  const icons: Record<NewsType, string> = {
    'outage': 'warning-outline',
    'price': 'pricetag-outline',
    'new_station': 'flash-outline',
    'closure': 'close-circle-outline',
    'promotion': 'star-outline',
    'regulation': 'document-text-outline',
    'general': 'newspaper-outline'
  };
  return icons[type] || 'newspaper-outline';
}

export function getNewsTypeColor(type: NewsType): string {
  const colors: Record<NewsType, string> = {
    'outage': 'danger',
    'price': 'warning',
    'new_station': 'success',
    'closure': 'danger',
    'promotion': 'tertiary',
    'regulation': 'primary',
    'general': 'medium'
  };
  return colors[type] || 'medium';
}
