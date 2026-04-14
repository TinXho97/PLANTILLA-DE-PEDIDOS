import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
@if (notification(); as order) {
  <div class="fixed bottom-8 right-8 z-[200] w-full max-sm animate-fade">
    <div class="bg-zinc-900 border border-green-600/50 rounded-3xl shadow-2xl shadow-green-900/20 p-6 flex items-start gap-5">
      <div class="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center border border-green-600/20">
        <i class="fas fa-check-circle text-green-500 text-2xl"></i>
      </div>
      <div class="flex-1">
        <h4 class="font-black text-white uppercase tracking-tight">¡Pedido Listo!</h4>
        <p class="text-zinc-400 text-xs mt-1 leading-relaxed">
          Tu pedido <span class="font-black text-rose-500">#{{ order.id }}</span> está listo para ser retirado.
        </p>
      </div>
      <button (click)="dismiss()" class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all absolute top-4 right-4">
        <i class="fas fa-times text-sm"></i>
      </button>
    </div>
  </div>
}
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  sushiService = inject(SushiService);
  
  readonly notification = this.sushiService.readyOrderNotification;

  dismiss() {
    this.sushiService.dismissReadyOrderNotification();
  }
}
