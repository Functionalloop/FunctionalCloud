import { Page } from './App';

export interface PageProps {
  onNavigate: (page: Page, data?: any) => void;
  data?: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;   // set only when product is on sale
  imageUrl: string;
  category: string;
  features: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isLimitedEdition?: boolean;
}

export interface Order {
  id?: string;
  userId?: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail?: string;
  address: string;
  extraDescription?: string;
  city: string;
  state: string;
  zip: string;
  total: number;
  items: any[];
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentProofUrl?: string;
  createdAt: number;
}

