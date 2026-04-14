import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-order-ticket',
  standalone: true,
  template: `
<div class="fixed inset-0 bg-black/95 z-[250] backdrop-blur-3xl flex items-center justify-center p-6">
    <div class="bg-white text-black w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        <!-- Ticket Header -->
        <div class="p-8 text-center border-b-2 border-dashed border-zinc-200 relative">
            <div class="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <img src="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-12 h-auto scale-[1.3] translate-y-[12%]" alt="Tadashi Logo">
            </div>
            <h3 class="text-2xl font-black uppercase tracking-tighter">TADASHI SUSHI</h3>
            <p class="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mt-1">Ticket de Pedido</p>
            
            <!-- Decorative circles for "punched" paper effect -->
            <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-black/95 rounded-full"></div>
            <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-black/95 rounded-full"></div>
        </div>

        <!-- Ticket Body -->
        <div class="p-8">
            <div class="text-center mb-8">
                <span class="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Tu Número de Pedido</span>
                <div class="text-6xl font-black tracking-tighter text-rose-600 mt-2">#{{ order()?.id }}</div>
            </div>

            <div class="space-y-4 mb-8">
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>Cliente</span>
                    <span class="text-black">{{ order()?.customerName }}</span>
                </div>
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>Hora</span>
                    <span class="text-black">{{ order()?.time }}</span>
                </div>
                <div class="border-t border-zinc-100 pt-4">
                    @for (item of order()?.items; track item.id) {
                        <div class="flex justify-between text-xs font-bold mb-2">
                            <span>{{ item.name }}</span>
                            <span>$ {{ item.price.toFixed(2) }}</span>
                        </div>
                    }
                </div>
                <div class="border-t-2 border-black pt-4 flex justify-between items-center">
                    <span class="font-black uppercase tracking-widest text-xs">Total</span>
                    <span class="text-2xl font-black italic">$ {{ order()?.total?.toFixed(2) }}</span>
                </div>
            </div>

            <div class="bg-rose-50 p-4 rounded-2xl border border-rose-100 mb-8">
                <p class="text-[10px] text-rose-800 font-bold text-center leading-relaxed uppercase tracking-wider">
                    ⚠️ ¡IMPORTANTE! <br>
                    Toma una captura o anota tu número. <br>
                    Te avisaremos cuando esté listo.
                </p>
            </div>

            <button (click)="close()" class="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-xs shadow-xl">
                Entendido, ir a mis pedidos
            </button>
        </div>
        
        <!-- Ticket Footer -->
        <div class="bg-zinc-50 p-6 text-center">
            <p class="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Gracias por elegir Tadashi Sushi</p>
        </div>
    </div>
</div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTicketComponent {
  sushiService = inject(SushiService);
  readonly order = this.sushiService.lastOrder;

  close() {
    this.sushiService.dismissLastOrder();
  }
}
