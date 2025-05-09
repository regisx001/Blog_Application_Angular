import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-typing-indicator',
  imports: [CommonModule],
  templateUrl: './typing-indicator.component.html',
  styleUrl: './typing-indicator.component.css',
})
export class TypingIndicatorComponent {
  @Input() isFullscreen: boolean = false;
}
