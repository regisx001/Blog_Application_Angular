import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatButtonComponent } from './chat-button/chat-button.component';
import { FullscreenChatComponent } from './fullscreen-chat/fullscreen-chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

@Component({
  selector: 'app-chatbot',
  imports: [ChatButtonComponent, FullscreenChatComponent, ChatWindowComponent],
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent {
  chatService = inject(ChatService);
}
