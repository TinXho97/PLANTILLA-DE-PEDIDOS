// FIX: Remove unused imports for signal and computed
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SushiService } from './sushi.service';
import { UserViewComponent } from './components/user-view.component';
import { AdminViewComponent } from './components/admin-view.component';
import { CartComponent } from './components/cart.component';
import { NotificationComponent } from './components/notification.component';
import { ChatWidgetComponent } from './components/chat-widget.component';
import { MyOrdersComponent } from './components/my-orders.component';
import { AdminLoginComponent } from './components/admin-login.component';
import { OrderTicketComponent } from './components/order-ticket.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
<!-- Top Navigation -->
<nav class="bg-black/90 backdrop-blur-2xl border-b border-zinc-900 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Branding -->
        <div class="flex items-center gap-4 cursor-pointer" (click)="showView('user')">
            <div class="logo-ring">
                <div class="relative w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-zinc-800 shadow-2xl">
                    <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" alt="Tadashi Logo" class="h-auto w-full scale-[1.3] translate-y-[12%]" width="56" height="56" priority>
                </div>
            </div>
            <div class="hidden md:block">
                <h1 class="text-2xl font-black tracking-tighter text-white leading-none">TADASHI <span class="text-rose-600 italic">SUSHI</span></h1>
                <p class="text-[10px] tracking-[0.4em] text-zinc-500 font-bold uppercase mt-1">Gourmet Experience</p>
            </div>
        </div>

        <!-- Actions Menu -->
        <div class="flex items-center gap-8">
            <div class="flex gap-10">
                <button (click)="showView('user')" class="relative text-xs font-black tracking-widest transition-all uppercase" [class]="currentView() === 'user' ? 'active-tab' : 'text-zinc-500 hover:text-rose-600'">La Carta</button>
                <button (click)="showView('my-orders')" class="relative text-xs font-black tracking-widest transition-all uppercase" [class]="currentView() === 'my-orders' ? 'active-tab' : 'text-zinc-500 hover:text-rose-600'">Mis Pedidos</button>
                <button (click)="requestAdminView()" class="relative text-xs font-black tracking-widest transition-all uppercase" [class]="currentView() === 'admin' ? 'active-tab' : 'text-zinc-500 hover:text-rose-600'">Cocina</button>
            </div>
            
            <div class="flex items-center gap-5 border-l border-zinc-800 pl-8">
                <a href="https://www.instagram.com/sushitadashi/" target="_blank" class="text-zinc-500 hover:text-white transition-all transform hover:scale-110">
                    <i class="fab fa-instagram text-2xl"></i>
                </a>
                <button (click)="toggleCart()" class="relative bg-zinc-900 p-3 rounded-2xl border border-zinc-800 hover:border-rose-600 transition-all group">
                    <i class="fas fa-shopping-basket text-zinc-400 group-hover:text-rose-600"></i>
                    @if (cartCount() > 0) {
                        <span class="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 rounded-full border-2 border-black text-[11px] font-black flex items-center justify-center">{{ cartCount() }}</span>
                    }
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- View Container -->
@if (currentView() === 'user') {
    <app-user-view></app-user-view>
}

@if (currentView() === 'admin') {
    <app-admin-view></app-admin-view>
}

@if (currentView() === 'my-orders') {
    <app-my-orders></app-my-orders>
}

<!-- Cart Modal -->
@if (isCartVisible()) {
    <app-cart></app-cart>
}

<!-- Login Modal -->
@if (isLoginModalVisible()) {
    <app-admin-login></app-admin-login>
}

<!-- Order Ticket Modal -->
@if (lastOrder()) {
    <app-order-ticket></app-order-ticket>
}

<!-- Notification Toast -->
<app-notification></app-notification>

<!-- AI Chat -->
@if (currentView() === 'user' && !isChatOpen()) {
  <button (click)="toggleChat()" class="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900/50 btn-glow animate-fade">
    <i class="fas fa-comment-dots text-2xl text-white"></i>
  </button>
}

@if (isChatOpen()) {
  <app-chat-widget></app-chat-widget>
}
  `,
  imports: [CommonModule, NgOptimizedImage, UserViewComponent, AdminViewComponent, CartComponent, NotificationComponent, ChatWidgetComponent, MyOrdersComponent, AdminLoginComponent, OrderTicketComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  sushiService = inject(SushiService);

  readonly currentView = this.sushiService.view;
  readonly cartCount = this.sushiService.cartCount;
  readonly isCartVisible = this.sushiService.isCartVisible;
  readonly isChatOpen = this.sushiService.isChatOpen;
  readonly myOrderIds = this.sushiService.myOrderIds;
  readonly isLoginModalVisible = this.sushiService.isLoginModalVisible;
  readonly lastOrder = this.sushiService.lastOrder;

  showView(view: 'user' | 'admin' | 'my-orders') {
    this.sushiService.showView(view);
  }

  requestAdminView() {
    if (this.sushiService.isAdminAuthenticated()) {
      this.sushiService.showView('admin');
    } else {
      this.sushiService.showLoginModal();
    }
  }

  toggleCart() {
    this.sushiService.toggleCart();
  }

  toggleChat() {
    this.sushiService.toggleChat();
  }
}