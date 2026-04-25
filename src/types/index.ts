export interface Match {
  id: string;
  group?: string;
  stage: string;
  date: string;
  time: string;
  team1: string;
  team1Flag: string;
  team2: string;
  team2Flag: string;
  venue: string;
  city: string;
  country: string;
  matchNumber: number;
}

export interface Venue {
  id: string;
  city: string;
  country: string;
  stadium: string;
  capacity: number;
  matches: number;
  image: string;
  description: string;
  highlights: string[];
  lat?: number;
  lng?: number;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  includes: string[];
  available: boolean;
  type: 'standard' | 'hospitality' | 'vip' | 'tour';
}

export interface MerchandiseItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
  badge?: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'ticket' | 'merch' | 'hospitality' | 'vip' | 'tour';
  size?: string;
  matchId?: string;
}
