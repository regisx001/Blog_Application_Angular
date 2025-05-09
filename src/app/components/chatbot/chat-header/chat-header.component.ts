import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent {
  @Input() title: string = 'Assistant';
  @Input() subtitle: string = 'Online';
  @Input() isFullscreen: boolean = false;
  @Input() showMinimize: boolean = true;

  @Output() onClose = new EventEmitter<void>();
  @Output() onMinimize = new EventEmitter<void>();
  @Output() onExpand = new EventEmitter<void>();
  @Output() onNewChat = new EventEmitter<void>();
}
