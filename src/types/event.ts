// TypeScript interfaces for Tikiti app data structures

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image?: string;
  teams?: {
    home: {
      name: string;
      flag: string;
    };
    away: {
      name: string;
      flag: string;
    };
  };
  categories: TicketCategory[];
  // TODO: Backend integration - fetch from Supabase events table
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: number;
  description?: string;
  // TODO: Backend integration - fetch from Supabase ticket_categories table
}

export interface CartItem {
  eventId: string;
  categoryId: string;
  quantity: number;
  price: number;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  paymentMethod: 'M-Pesa' | 'Card';
  // TODO: Backend integration - store in Supabase orders table
}

export interface Order {
  id: string;
  eventId: string;
  items: CartItem[];
  billingDetails: BillingDetails;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  // TODO: Backend integration - store in Supabase orders table
  // TODO: M-Pesa STK push integration
  // TODO: E-ticket generation on payment success
}