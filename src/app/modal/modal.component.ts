import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() message: string = '';
  @Output() playAgain = new EventEmitter<void>();

  onPlayAgain() {
    this.playAgain.emit();
  }
}
