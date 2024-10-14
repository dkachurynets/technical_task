import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent {
  @Input() N: number = 1000;
  @Input() gameOver: boolean = true;
  @Output() NChange = new EventEmitter<number>();
  @Output() startGame = new EventEmitter<void>();

  onStart() {
    this.startGame.emit();
  }

  onNChange(value: number) {
    this.NChange.emit(value);
  }
}
