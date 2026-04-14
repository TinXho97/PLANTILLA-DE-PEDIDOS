export interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  img: string;
  category: 'Combos' | 'Rolls' | 'Veggie';
}

export interface Order {
  id: number;
  time: string;
  items: MenuItem[];
  total: number;
  status: 'Pendiente' | 'En preparación' | 'Listo';
  customerName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}