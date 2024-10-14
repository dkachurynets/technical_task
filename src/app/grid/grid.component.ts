import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @Input() grid: string[] = [];
  @Output() cellClicked = new EventEmitter<number>();

  onCellClick(index: number) {
    this.cellClicked.emit(index);
  }
}
