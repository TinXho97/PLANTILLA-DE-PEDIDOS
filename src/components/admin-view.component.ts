import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiService } from '../sushi.service';
import { Order } from '../models';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  template: `
<main class="max-w-4xl mx-auto px-6 py-20">
    <div class="flex justify-between items-center mb-16 border-b border-zinc-900 pb-10">
        <div>
            <h2 class="text-5xl font-black italic tracking-tighter uppercase">Cocina</h2>
            <p class="text-zinc-500 font-bold text-xs tracking-widest mt-2 uppercase">Monitor de pedidos en vivo</p>
        </div>
        <div class="bg-rose-600/10 border border-rose-600/30 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span class="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
            <span class="text-rose-600 font-black text-[10px] tracking-widest uppercase">Servidor Online</span>
        </div>
    </div>
    
    <div class="space-y-8">
        @if (orders().length === 0) {
            <div class="bg-zinc-950 border-2 border-dashed border-zinc-900 py-32 text-center rounded-[4rem] opacity-20">
                <p class="text-[11px] font-black uppercase tracking-[0.5em]">Esperando nuevos pedidos...</p>
            </div>
        } @else {
            @for (order of orders(); track order.id) {
                <div class="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden animate-fade shadow-2xl">
                    <div class="absolute top-0 right-0 p-10">
                         <span class="text-rose-600 font-black text-3xl tracking-tighter">\${{ order.total.toFixed(2) }}</span>
                    </div>
                    <div class="mb-10">
                        <span class="text-[11px] font-black tracking-[0.3em] text-zinc-600 uppercase">Ticket #{{order.id}} &bull; {{order.time}}</span>
                        <h4 class="text-3xl font-black italic uppercase tracking-tighter mt-2">{{ order.customerName }}</h4>
                    </div>
                    <div class="space-y-4 mb-10 bg-black/30 p-8 rounded-[2rem] border border-zinc-800/50">
                        @for (item of order.items; track item.id) {
                            <div class="flex justify-between text-xs font-black uppercase tracking-widest">
                                <span class="text-zinc-400">{{ item.name }}</span>
                                <span class="text-white">x1</span>
                            </div>
                        }
                    </div>
                    <div class="flex flex-col sm:flex-row gap-5">
                         @switch (order.status) {
                            @case ('Pendiente') {
                                <button (click)="startPreparation(order.id)" class="flex-grow bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-600 transition-all uppercase tracking-widest text-[11px] shadow-lg">Empezar Preparación</button>
                            }
                            @case ('En preparación') {
                                <button (click)="markAsReady(order.id)" class="flex-grow bg-green-500 text-black font-black py-5 rounded-2xl hover:bg-green-600 transition-all uppercase tracking-widest text-[11px] shadow-lg">Listo para Retirar</button>
                            }
                            @case ('Listo') {
                                <div class="flex-grow bg-zinc-950 text-green-500 font-black py-5 rounded-2xl uppercase tracking-widest text-[11px] text-center flex items-center justify-center gap-2">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Pedido Listo</span>
                                </div>
                            }
                         }
                         <button (click)="deleteOrder(order.id)" class="flex-grow bg-zinc-800 text-zinc-500 font-black py-5 rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[11px]">Finalizar</button>
                    </div>
                    <div class="absolute top-0 left-0 w-2 h-full"
                        [class]="{
                            'bg-rose-600': order.status === 'Pendiente', 
                            'bg-amber-500': order.status === 'En preparación', 
                            'bg-green-600': order.status === 'Listo'
                        }"></div>
                </div>
            }
        }
    </div>
</main>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminViewComponent {
  sushiService = inject(SushiService);
  
  readonly orders = this.sushiService.orders;

  startPreparation(id: number) {
    this.sushiService.updateOrderStatus(id, 'En preparación');
  }

  markAsReady(id: number) {
    this.sushiService.updateOrderStatus(id, 'Listo');
  }

  deleteOrder(id: number) {
    this.sushiService.deleteOrder(id);
  }
}