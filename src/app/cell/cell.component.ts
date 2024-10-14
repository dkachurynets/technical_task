import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
})
export class CellComponent {
  @Input() color: string = 'blue';
  @Input() index: number = 0;
  @Output() cellClick = new EventEmitter<number>();

  @HostBinding('class')
  get cellClass() {
    return `cell ${this.color}`;
  }

  onClick(): void {
    this.cellClick.emit(this.index);
  }
}
