import { Injectable, signal, computed } from '@angular/core';
import { MenuItem, Order, ChatMessage } from './models';
import { GoogleGenAI } from '@google/genai';

declare const GEMINI_API_KEY: string;

const MENU_DATA: MenuItem[] = [
    { id: 1, name: "Salmon Cream Roll", price: 14.50, desc: "Salmón premium, queso Philadelphia y palta. El clásico de Tadashi.", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", category: 'Rolls' },
    { id: 2, name: "Hot Tadashi Especial", price: 15.00, desc: "Roll tibio rebozado en panko con salsa teriyaki de la casa.", img: "https://images.unsplash.com/photo-1617239022391-d442a8684f49?auto=format&fit=crop&w=600&q=80", category: 'Rolls' },
    { id: 3, name: "Nigiri Moriawase", price: 18.50, desc: "Cortes seleccionados de pescados blancos y rojos sobre arroz shari.", img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=600&q=80", category: 'Rolls' },
    { id: 4, name: "Vegetarian Zen", price: 11.00, desc: "Mango, pepino, zanahoria y suave aliño oriental. Frescura pura.", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80", category: 'Veggie' },
    { id: 5, name: "Combo Placer (15p)", price: 22.00, desc: "Un recorrido por nuestros sabores más elegidos del mes.", img: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&w=600&q=80", category: 'Combos' },
    { id: 6, name: "Tadashi Box (30p)", price: 38.00, desc: "La experiencia completa para compartir. Incluye piezas premium.", img: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80", category: 'Combos' }
];

@Injectable({ providedIn: 'root' })
export class SushiService {
  readonly menu = signal<MenuItem[]>(MENU_DATA);
  readonly view = signal<'user' | 'admin' | 'my-orders'>('user');
  readonly isCartVisible = signal(false);
  readonly cart = signal<MenuItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly readyOrderNotification = signal<Order | null>(null);
  readonly lastOrder = signal<Order | null>(null);
  
  // Track orders for the current session
  readonly myOrderIds = signal<number[]>([]);

  // AI Chat signals
  readonly isChatOpen = signal(false);
  readonly chatMessages = signal<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy Tadashi, tu asistente virtual. ¿Cómo puedo ayudarte con nuestro menú de sushi hoy?' }
  ]);
  readonly isChatLoading = signal(false);

  // Admin Auth signals
  readonly isAdminAuthenticated = signal(false);
  readonly isLoginModalVisible = signal(false);

  readonly cartCount = computed(() => this.cart().length);
  readonly cartTotal = computed(() => this.cart().reduce((sum, item) => sum + item.price, 0));
  
  // Computed signal for the customer's orders
  readonly myOrders = computed(() => {
    const ids = this.myOrderIds();
    return this.orders().filter(o => ids.includes(o.id));
  });

  showView(view: 'user' | 'admin' | 'my-orders') {
    this.view.set(view);
  }

  toggleCart() {
    this.isCartVisible.update(visible => !visible);
  }

  toggleChat() {
    this.isChatOpen.update(open => !open);
  }
  
  showLoginModal() {
    this.isLoginModalVisible.set(true);
  }

  hideLoginModal() {
    this.isLoginModalVisible.set(false);
  }

  authenticateAdmin(email: string, password: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    // Hardcoded credentials for simplicity
    const isCorrect = cleanEmail === 'tadashi@gmail.com' && cleanPassword === '24072212';
    
    console.log(`Intento de login admin: ${cleanEmail} - Resultado: ${isCorrect}`);
    
    if (isCorrect) {
      this.isAdminAuthenticated.set(true);
      this.hideLoginModal();
      this.showView('admin');
    }
    return isCorrect;
  }

  addToCart(item: MenuItem) {
    this.cart.update(currentCart => [...currentCart, item]);
  }

  removeFromCart(index: number) {
    this.cart.update(currentCart => currentCart.filter((_, i) => i !== index));
  }
  
  confirmOrder(customerName: string) {
    if (this.cart().length === 0 || !customerName.trim()) return;
    
    const newOrder: Order = {
      id: Math.floor(100 + Math.random() * 899),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...this.cart()],
      total: this.cartTotal(),
      status: 'Pendiente',
      customerName: customerName.trim()
    };

    this.orders.update(orders => [newOrder, ...orders]);
    this.myOrderIds.update(ids => [...ids, newOrder.id]);
    this.lastOrder.set(newOrder);
    this.cart.set([]);
    this.isCartVisible.set(false);
  }

  dismissLastOrder() {
    this.lastOrder.set(null);
    this.showView('my-orders');
  }

  updateOrderStatus(id: number, status: 'En preparación' | 'Listo') {
    this.orders.update(orders => orders.map(o => {
        if (o.id === id) {
            const updatedOrder = { ...o, status };
            if (status === 'Listo') {
              this.readyOrderNotification.set(updatedOrder);
            }
            return updatedOrder;
        }
        return o;
    }));
  }

  deleteOrder(id: number) {
    this.orders.update(orders => orders.filter(o => o.id !== id));
  }

  dismissReadyOrderNotification() {
    this.readyOrderNotification.set(null);
  }

  async sendMessageToAi(message: string) {
    this.chatMessages.update(messages => [...messages, { role: 'user', text: message }]);
    this.isChatLoading.set(true);

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const menuString = JSON.stringify(this.menu());

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the menu provided below, please answer the user's question. Menu: ${menuString}\n\nUser Question: "${message}"`,
        config: {
          systemInstruction: `You are Tadashi, a friendly, expert AI assistant for Tadashi Sushi, a gourmet sushi restaurant. Your goal is to help users with the menu and answer their questions in a concise and welcoming manner.
- Your personality is professional, yet warm and enthusiastic about sushi.
- You MUST use the provided menu data to answer questions about ingredients, prices, and categories. Do not invent items.
- If a user asks for a recommendation, suggest items from the menu.
- If a question is outside the scope of the restaurant (e.g., "What's the weather?"), politely decline and steer the conversation back to Tadashi Sushi.
- Keep your answers brief and to the point.`
        }
      });

      this.chatMessages.update(messages => [...messages, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      this.chatMessages.update(messages => [...messages, { role: 'model', text: 'Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo más tarde.' }]);
    } finally {
      this.isChatLoading.set(false);
    }
  }
}