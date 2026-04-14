// FIX: Import signal and computed from @angular/core
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SushiService } from '../sushi.service';
import { MenuItem } from '../models';

@Component({
  selector: 'app-user-view',
  standalone: true,
  template: `
<main id="user-view">
    <!-- Hero Section -->
    <header class="relative h-[70vh] flex items-center justify-center overflow-hidden bg-zinc-950 border-b border-zinc-900">
        <div class="absolute inset-0">
            <img ngSrc="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80" class="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_10s_infinite]" priority width="1600" height="900" alt="Sushi background">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div class="relative z-10 text-center px-6 animate-fade">
            <div class="mb-10 inline-block p-1.5 bg-white rounded-full shadow-[0_0_60px_rgba(217,4,41,0.3)] transform hover:rotate-3 transition-transform duration-500">
                <div class="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-black flex items-center justify-center">
                    <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" alt="Tadashi Logo Hero" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="176" height="176" priority>
                </div>
            </div>
            <h2 class="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">Tadashi <span class="text-rose-600">Sushi</span></h2>
            <p class="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto font-medium tracking-[0.2em] uppercase mb-10 leading-relaxed">
                Sabor artesanal & frescura premium <br> directo a tu mesa.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-6">
                <a href="#menu-section" class="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest btn-glow transition-all uppercase">Explorar Menú</a>
                <a href="https://www.instagram.com/sushitadashi/" target="_blank" class="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-white/10 transition-all uppercase">Ver Instagram</a>
            </div>
        </div>
    </header>

    <!-- Menu Section -->
    <section id="menu-section" class="max-w-7xl mx-auto px-6 py-20">
        <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div class="text-center md:text-left">
                <h3 class="text-4xl font-black uppercase italic tracking-tighter">Nuestra Carta</h3>
                <p class="text-zinc-500 font-bold text-xs tracking-widest uppercase mt-2">Seleccioná tus favoritos</p>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full">
                <button (click)="setFilter('All')" [class]="activeFilter() === 'All' ? 'bg-rose-600 text-white shadow-xl' : 'bg-zinc-900 text-zinc-500 hover:text-white'" class="px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all whitespace-nowrap">TODO EL MENÚ</button>
                <button (click)="setFilter('Combos')" [class]="activeFilter() === 'Combos' ? 'bg-rose-600 text-white shadow-xl' : 'bg-zinc-900 text-zinc-500 hover:text-white'" class="px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all whitespace-nowrap">COMBOS</button>
                <button (click)="setFilter('Rolls')" [class]="activeFilter() === 'Rolls' ? 'bg-rose-600 text-white shadow-xl' : 'bg-zinc-900 text-zinc-500 hover:text-white'" class="px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all whitespace-nowrap">ROLLS</button>
                <button (click)="setFilter('Veggie')" [class]="activeFilter() === 'Veggie' ? 'bg-rose-600 text-white shadow-xl' : 'bg-zinc-900 text-zinc-500 hover:text-white'" class="px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all whitespace-nowrap">VEGGIE</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            @for (item of filteredMenu(); track item.id) {
                <div class="rounded-[2.5rem] overflow-hidden card-sushi flex flex-col group">
                    <div class="relative overflow-hidden h-80">
                        <img [ngSrc]="item.img" [alt]="item.name" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" width="600" height="400">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-rose-600 font-black text-2xl tracking-tighter bg-black/80 px-4 py-1 rounded-xl">\${{ item.price.toFixed(2) }}</span>
                        </div>
                    </div>
                    <div class="p-10 flex-grow flex flex-col">
                        <h3 class="font-black text-2xl uppercase tracking-tighter italic mb-4 group-hover:text-rose-600 transition-colors">{{ item.name }}</h3>
                        <p class="text-zinc-500 text-xs mb-10 flex-grow leading-relaxed font-bold uppercase tracking-widest">{{ item.desc }}</p>
                        <button (click)="addToCart(item)" class="w-full bg-zinc-900 border border-zinc-800 text-white hover:bg-rose-600 hover:border-rose-600 font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[11px] btn-glow">
                            <i class="fas fa-plus-circle text-lg"></i> Agregar al Pedido
                        </button>
                    </div>
                </div>
            }
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-zinc-950 border-t border-zinc-900 py-24 px-6 text-center">
        <div class="mb-10 opacity-50">
             <div class="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-rose-600 p-0.5 flex items-center justify-center">
                <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="64" height="64" alt="Tadashi logo small">
            </div>
        </div>
        <h3 class="text-3xl font-black mb-6 uppercase tracking-tight">Viví la Experiencia</h3>
        <p class="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">Etiquetanos en tus historias y compartí el arte de Tadashi Sushi con nosotros.</p>
        <a href="https://www.instagram.com/sushitadashi/" target="_blank" class="instagram-link font-black text-4xl tracking-tighter italic">@sushitadashi</a>
        <div class="mt-20 text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em]">Tadashi Sushi &copy; 2024</div>
    </footer>
</main>
  `,
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserViewComponent {
  sushiService = inject(SushiService);
  
  readonly menuItems = this.sushiService.menu;
  
  activeFilter = signal<'All' | 'Combos' | 'Rolls' | 'Veggie'>('All');

  filteredMenu = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.menuItems();
    }
    return this.menuItems().filter(item => item.category === filter);
  });

  setFilter(filter: 'All' | 'Combos' | 'Rolls' | 'Veggie') {
    this.activeFilter.set(filter);
  }

  addToCart(item: MenuItem) {
    this.sushiService.addToCart(item);
  }
}
