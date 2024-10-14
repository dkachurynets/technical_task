import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../grid/grid.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { ControlsComponent } from '../controls/controls.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    GridComponent,
    ScoreboardComponent,
    ControlsComponent,
    ModalComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {
  gridSize = 10;
  grid: string[] = [];
  N: number = 1000; // Time in milliseconds
  playerScore: number = 0;
  computerScore: number = 0;
  selectedCellIndex: number | null = null;
  timerSubscription: Subscription | null = null;
  gameOver: boolean = true;
  message: string = '';

  ngOnInit() {
    this.initializeGrid();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  initializeGrid() {
    this.grid = Array.from({ length: this.gridSize * this.gridSize }, () => 'blue');
  }

  onStartGame() {
    this.resetGame();
    this.nextTurn();
  }

  resetGame() {
    this.initializeGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.message = '';
  }

  nextTurn() {
    if (this.gameOver) return;

    const availableCells = this.grid
      .map((color, index) => ({ color, index }))
      .filter(({ color }) => color === 'blue');

    if (availableCells.length === 0) {
      this.endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomIndex].index;
    this.selectedCellIndex = cellIndex;
    this.grid[cellIndex] = 'yellow';

    // Start timer
    this.timerSubscription = timer(this.N).subscribe(() => {
      this.handleTimeout();
    });
  }

  onCellClicked(index: number) {
    if (this.gameOver || this.grid[index] !== 'yellow') return;

    // Player clicked on the highlighted cell
    this.grid[index] = 'green';
    this.playerScore++;
    this.checkGameOver();
    this.timerSubscription?.unsubscribe();
    this.selectedCellIndex = null;
    this.nextTurn();
  }

  handleTimeout() {
    if (this.selectedCellIndex !== null) {
      this.grid[this.selectedCellIndex] = 'red';
      this.computerScore++;
      this.checkGameOver();
      this.selectedCellIndex = null;
      this.nextTurn();
    }
  }

  checkGameOver() {
    if (this.playerScore >= 10) {
      this.gameOver = true;
      this.message = 'You win!';
    } else if (this.computerScore >= 10) {
      this.gameOver = true;
      this.message = 'Computer wins!';
    }
  }

  endGame() {
    this.gameOver = true;
    this.message = 'Game Over';
  }

  onNChange(value: number) {
    this.N = value;
  }

  onPlayAgain() {
    this.onStartGame();
  }
}
