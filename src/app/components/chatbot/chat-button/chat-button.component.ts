import { Component, inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-chat-button',
  imports: [ButtonModule],
  templateUrl: './chat-button.component.html',
})
export class ChatButtonComponent {
  chatService = inject(ChatService);
}
