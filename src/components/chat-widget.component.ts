import { Component, ChangeDetectionStrategy, inject, viewChild, ElementRef, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SushiService } from '../sushi.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  template: `
<div class="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-[150] w-full max-w-lg h-[80vh] md:h-auto md:max-h-[80vh] flex flex-col animate-slide-in-up">
    <div class="bg-zinc-950/90 backdrop-blur-xl border-2 border-zinc-800 rounded-t-3xl md:rounded-3xl shadow-2xl shadow-black/50 w-full h-full flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-zinc-800/50 flex justify-between items-center flex-shrink-0">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-600/50 flex items-center justify-center">
                    <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="40" height="40" alt="Tadashi Logo">
                </div>
                <div>
                    <h3 class="font-black text-white uppercase tracking-tight">Asistente AI</h3>
                    <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Tadashi Sushi</p>
                </div>
            </div>
            <button (click)="closeChat()" class="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Messages -->
        <div #messageContainer class="flex-grow p-6 space-y-6 overflow-y-auto thin-scrollbar">
            @for (msg of messages(); track $index) {
                <div class="flex items-end gap-3" [class.flex-row-reverse]="msg.role === 'user'">
                    @if (msg.role === 'model') {
                        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 flex items-center justify-center">
                           <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="32" height="32" alt="Model avatar">
                        </div>
                    }
                    <div class="max-w-xs lg:max-w-md p-4 rounded-2xl" [class]="msg.role === 'user' ? 'bg-rose-600/20 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-300 rounded-bl-none'">
                        <p class="text-sm leading-relaxed">{{ msg.text }}</p>
                    </div>
                </div>
            }
            @if(isLoading()) {
                <div class="flex items-end gap-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 flex items-center justify-center">
                        <img ngSrc="https://i.ibb.co/s9NpqtL0/254125a4-eeed-44cf-9eac-5061a0c08726.png" class="w-full h-auto scale-[1.3] translate-y-[12%]" width="32" height="32" alt="Model avatar">
                    </div>
                    <div class="max-w-xs lg:max-w-md p-4 rounded-2xl bg-zinc-800 text-zinc-300 rounded-bl-none">
                        <div class="flex items-center gap-2">
                           <span class="w-2 h-2 bg-zinc-500 rounded-full animate-[pulse_1.5s_infinite_0.1s]"></span>
                           <span class="w-2 h-2 bg-zinc-500 rounded-full animate-[pulse_1.5s_infinite_0.2s]"></span>
                           <span class="w-2 h-2 bg-zinc-500 rounded-full animate-[pulse_1.5s_infinite_0.3s]"></span>
                        </div>
                    </div>
                </div>
            }
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-zinc-800/50 flex-shrink-0 bg-zinc-950">
            <div class="flex items-center gap-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-2 focus-within:border-rose-600 transition-colors">
                <input #messageInput (keyup.enter)="sendMessage(messageInput)" type="text" placeholder="Pregunta sobre el menú..." class="flex-grow bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none px-3">
                <button (click)="sendMessage(messageInput)" class="w-12 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center text-white flex-shrink-0 btn-glow">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
</div>
  `,
  imports: [CommonModule, NgOptimizedImage],
})
export class ChatWidgetComponent {
  sushiService = inject(SushiService);

  readonly messages = this.sushiService.chatMessages;
  readonly isLoading = this.sushiService.isChatLoading;

  messageContainer = viewChild<ElementRef<HTMLDivElement>>('messageContainer');

  constructor() {
    effect(() => {
        // This effect runs whenever chatMessages signal changes
        this.messages(); 
        // Use a microtask to scroll after the DOM has been updated
        Promise.resolve().then(() => this.scrollToBottom());
    });
  }

  closeChat() {
    this.sushiService.toggleChat();
  }

  sendMessage(input: HTMLInputElement) {
    const message = input.value.trim();
    if (message) {
      this.sushiService.sendMessageToAi(message);
      input.value = '';
    }
  }

  private scrollToBottom(): void {
    const container = this.messageContainer()?.nativeElement;
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
  }
}
