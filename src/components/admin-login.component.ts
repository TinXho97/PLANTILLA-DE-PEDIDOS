import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  template: `
<div class="fixed inset-0 bg-black/98 z-[300] backdrop-blur-3xl flex items-center justify-center p-6">
    <div class="bg-zinc-900 w-full max-md rounded-[3rem] border border-zinc-800 overflow-hidden shadow-[0_0_100px_rgba(217,4,41,0.1)] animate-fade">
        <div class="p-10 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
            <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700">
                    <i class="fas fa-lock text-xl text-rose-500"></i>
                </div>
                <div>
                    <h3 class="text-2xl font-black italic tracking-tighter uppercase">Acceso Restringido</h3>
                    <p class="text-[9px] text-zinc-500 font-black tracking-widest uppercase">Panel de Cocina</p>
                </div>
            </div>
            <button (click)="closeModal()" class="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        
        <div class="p-10">
            <div class="space-y-6 mb-6">
                <div>
                     <label for="adminEmail" class="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Correo Electrónico</label>
                     <input #emailInput (keyup.enter)="login(emailInput, passwordInput)" type="email" id="adminEmail" placeholder="Ingresá tu correo" class="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 text-sm rounded-2xl p-4 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all">
                </div>
                 <div>
                     <label for="adminPassword" class="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Contraseña</label>
                     <input #passwordInput (keyup.enter)="login(emailInput, passwordInput)" type="password" id="adminPassword" placeholder="Ingresá la contraseña" class="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 text-sm rounded-2xl p-4 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all">
                 </div>
            </div>
             
             @if(showError()) {
                <p class="text-rose-500 text-xs font-bold text-center mb-6">Correo o contraseña incorrectos. Intenta de nuevo.</p>
             }
            
            <button (click)="login(emailInput, passwordInput)" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl shadow-rose-900/40 uppercase tracking-widest text-xs btn-glow mb-4">
                Ingresar
            </button>

            <button (click)="quickLogin(emailInput, passwordInput)" class="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-[9px]">
                Usar Credenciales de Prueba
            </button>
        </div>
    </div>
</div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  sushiService = inject(SushiService);
  showError = signal(false);

  login(emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    const email = emailInput.value;
    const password = passwordInput.value;
    const success = this.sushiService.authenticateAdmin(email, password);
    if (!success) {
      this.showError.set(true);
      passwordInput.value = '';
    } else {
      this.showError.set(false);
    }
  }

  quickLogin(emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    emailInput.value = 'tadashi@gmail.com';
    passwordInput.value = '24072212';
    this.login(emailInput, passwordInput);
  }

  closeModal() {
    this.sushiService.hideLoginModal();
    this.showError.set(false);
  }
}
