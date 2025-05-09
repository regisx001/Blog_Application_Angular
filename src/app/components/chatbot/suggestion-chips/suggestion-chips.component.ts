import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-suggestion-chips',
  imports: [CommonModule],
  templateUrl: './suggestion-chips.component.html',
})
export class SuggestionChipsComponent {
  @Input() suggestions: string[] = [];
  @Output() onSelect = new EventEmitter<string>();

  selectSuggestion(suggestion: string): void {
    this.onSelect.emit(suggestion);
  }
}
