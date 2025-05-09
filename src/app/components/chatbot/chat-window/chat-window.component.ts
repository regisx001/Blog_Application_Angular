import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageItemComponent } from '../message-item/message-item.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { SuggestionChipsComponent } from '../suggestion-chips/suggestion-chips.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-chat-window',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    MessageItemComponent,
    ChatHeaderComponent,
    TypingIndicatorComponent,
    ChatInputComponent,
    SuggestionChipsComponent,
  ],
  templateUrl: './chat-window.component.html',
})
export class ChatWindowComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  chatService = inject(ChatService);

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }
  }

  selectSuggestion(suggestion: string): void {
    // Find the input component and set its value
    const inputElement = document.querySelector(
      'app-chat-input input'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = suggestion;
      inputElement.focus();
    }
  }
}
