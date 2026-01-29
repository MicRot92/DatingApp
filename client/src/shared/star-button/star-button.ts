import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class StarButton {
  disabled = input<boolean>(false);
  selected = input<boolean>(false);
  clickEvent = output<Event>();

  onClick(event: Event) {
    console.log('StarButton clicked. Disabled:', this.disabled(), 'Selected:', this.selected());
    if (!this.disabled()) {
      console.log('Emitting click event');
      this.clickEvent.emit(event);
    }
  }
}
