import { Component, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @Input() isFullscreen: boolean = false;
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('textareaField') textareaField!: ElementRef;

  userMessage: string = '';
  private chatService = inject(ChatService);

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.chatService.sendMessage(this.userMessage);
      this.userMessage = '';

      if (this.isFullscreen && this.textareaField) {
        this.adjustTextareaHeight();
        setTimeout(() => {
          this.textareaField.nativeElement.focus();
        }, 0);
      } else if (!this.isFullscreen && this.inputField) {
        setTimeout(() => {
          this.inputField.nativeElement.focus();
        }, 0);
      }
    }
  }

  adjustTextareaHeight(): void {
    if (this.textareaField && this.textareaField.nativeElement) {
      const textarea = this.textareaField.nativeElement;
      textarea.style.height = 'auto';
      const newHeight =
        textarea.scrollHeight < 120 ? textarea.scrollHeight : 120;
      textarea.style.height = `${newHeight}px`;
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
