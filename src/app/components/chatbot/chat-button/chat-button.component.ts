import { Component, inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-button',
  templateUrl: './chat-button.component.html',
})
export class ChatButtonComponent {
  chatService = inject(ChatService);
}
