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
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-fullscreen-chat',
  imports: [
    CommonModule,
    FormsModule,
    TypingIndicatorComponent,
    ChatHeaderComponent,
    ChatInputComponent,
    MessageItemComponent,
  ],
  templateUrl: './fullscreen-chat.component.html',
})
export class FullscreenChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  chatService = inject(ChatService);

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  startNewChat(): void {
    this.chatService.resetChat();
  }
}
