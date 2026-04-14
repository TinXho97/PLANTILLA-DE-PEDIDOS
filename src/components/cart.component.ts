import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
<div class="fixed inset-0 bg-black/98 z-[100] backdrop-blur-3xl flex items-center justify-center p-6">
    <div class="bg-zinc-900 w-full max-lg rounded-[3rem] border border-zinc-800 overflow-hidden shadow-[0_0_100px_rgba(217,4,41,0.1)] animate-fade">
        <div class="p-10 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
            <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-full overflow-hidden border border-rose-600 flex items-center justify-center">
                    <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="48" height="48" alt="Tadashi Logo small">
                </div>
                <div>
                    <h3 class="text-2xl font-black italic tracking-tighter uppercase">Tu Carrito</h3>
                    <p class="text-[9px] text-zinc-500 font-black tracking-widest uppercase">Selección Gourmet</p>
                </div>
            </div>
            <button (click)="toggleCart()" class="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        
        <div class="p-10 overflow-y-auto max-h-[45vh] space-y-6">
            @if (cart().length === 0) {
                <div class="text-center py-16 opacity-10">
                    <i class="fas fa-shopping-basket text-7xl mb-6"></i>
                    <p class="text-[11px] font-black uppercase tracking-[0.4em]">Sin piezas seleccionadas</p>
                </div>
            } @else {
                @for (item of cart(); track $index) {
                    <div class="flex justify-between items-center bg-zinc-800/20 p-5 rounded-[1.5rem] border border-zinc-800/30">
                        <div class="flex items-center gap-5">
                            <div class="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                                <img [ngSrc]="item.img" class="w-full h-full object-cover" width="64" height="64" [alt]="item.name">
                            </div>
                            <div>
                                <p class="font-black text-xs uppercase tracking-tight">{{ item.name }}</p>
                                <p class="text-rose-600 text-[11px] font-black mt-1">\${{ item.price.toFixed(2) }}</p>
                            </div>
                        </div>
                        <button (click)="removeFromCart($index)" class="w-10 h-10 rounded-full flex items-center justify-center text-zinc-700 hover:text-rose-600 hover:bg-rose-600/10 transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                }
            }
        </div>

        <div class="p-10 bg-zinc-950/80">
            <div class="mb-6">
                 <label for="customerName" class="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Tu Nombre</label>
                 <input #customerNameInput type="text" id="customerName" placeholder="Para identificar tu pedido" class="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 text-sm rounded-2xl p-4 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all">
                 @if(showNameError()) {
                    <p class="text-rose-500 text-xs mt-2 font-bold">Por favor, ingresa tu nombre.</p>
                 }
            </div>
            <div class="flex justify-between items-center mb-8">
                <span class="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Total de tu pedido</span>
                <span id="final-total" class="text-4xl font-black text-rose-600 tracking-tighter">\${{ cartTotal().toFixed(2) }}</span>
            </div>
            <button (click)="confirmOrder(customerNameInput)" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-6 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl shadow-rose-900/40 uppercase tracking-widest text-xs btn-glow">
                Confirmar Pedido Ahora
            </button>
        </div>
    </div>
</div>
  `,
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  sushiService = inject(SushiService);

  readonly cart = this.sushiService.cart;
  readonly cartTotal = this.sushiService.cartTotal;
  readonly showNameError = signal(false);

  removeFromCart(index: number) {
    this.sushiService.removeFromCart(index);
  }

  toggleCart() {
    this.sushiService.toggleCart();
  }

  confirmOrder(nameInput: HTMLInputElement) {
    const name = nameInput.value;
    if (!name.trim()) {
        this.showNameError.set(true);
        nameInput.focus();
        return;
    }
    this.showNameError.set(false);
    this.sushiService.confirmOrder(name);
  }
}