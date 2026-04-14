import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  template: `
<main class="max-w-4xl mx-auto px-6 py-20">
    <div class="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-zinc-900 pb-10">
        <div>
            <h2 class="text-5xl font-black italic tracking-tighter uppercase">Mis Pedidos</h2>
            <p class="text-zinc-500 font-bold text-xs tracking-widest mt-2 uppercase">Seguimiento de tu orden</p>
        </div>
        <button (click)="exploreMenu()" class="bg-rose-600 text-white px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] shadow-xl whitespace-nowrap btn-glow mt-6 md:mt-0">
            Volver a la Carta
        </button>
    </div>
    
    <div class="space-y-8">
        @if (myOrders().length === 0) {
            <div class="bg-zinc-950 border-2 border-dashed border-zinc-900 py-32 text-center rounded-[4rem] opacity-20">
                <i class="fas fa-receipt text-6xl mb-6"></i>
                <p class="text-[11px] font-black uppercase tracking-[0.5em]">Aún no has realizado ningún pedido.</p>
            </div>
        } @else {
            @for (order of myOrders(); track order.id) {
                <div class="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden animate-fade shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h4 class="text-3xl font-black italic uppercase tracking-tighter">Ticket #{{order.id}}</h4>
                             <span class="text-[11px] font-black tracking-[0.3em] text-zinc-600 uppercase">Realizado a las {{order.time}}</span>
                        </div>
                        <div class="text-right">
                             <span class="text-rose-600 font-black text-3xl tracking-tighter">\${{ order.total.toFixed(2) }}</span>
                        </div>
                    </div>
                   
                    <!-- Status Indicator -->
                    <div class="bg-black/30 p-6 rounded-[2rem] border border-zinc-800/50 flex items-center justify-between">
                        <span class="text-zinc-400 font-black uppercase tracking-widest text-xs">Estado del pedido</span>
                        @switch (order.status) {
                            @case ('Pendiente') {
                                <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-rose-600/10 border border-rose-600/20">
                                    <span class="w-2 h-2 bg-rose-500 rounded-full"></span>
                                    <span class="text-rose-500 font-black text-[10px] tracking-widest uppercase">Pendiente</span>
                                </div>
                            }
                            @case ('En preparación') {
                                <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                    <span class="text-amber-500 font-black text-[10px] tracking-widest uppercase">En Preparación</span>
                                </div>
                            }
                            @case ('Listo') {
                                 <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                                    <i class="fas fa-check text-green-500"></i>
                                    <span class="text-green-500 font-black text-[10px] tracking-widest uppercase">Listo para Retirar</span>
                                </div>
                            }
                        }
                    </div>
                </div>
            }
        }
    </div>
</main>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrdersComponent {
  sushiService = inject(SushiService);
  
  readonly myOrders = this.sushiService.myOrders;

  exploreMenu() {
    this.sushiService.showView('user');
  }
}
