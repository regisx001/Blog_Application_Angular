import { Component, inject, Input } from '@angular/core';
import { Message } from '../models/chat.model';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-item',
  imports: [FormsModule, CommonModule],
  templateUrl: './message-item.component.html',
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() isFullscreen: boolean = false;

  chatService = inject(ChatService);
}
