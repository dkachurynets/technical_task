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
  N: number = 1000;
  playerScore: number = 0;
  computerScore: number = 0;
  selectedCellIndex: number | null = null;
  timerSubscription: Subscription | null = null;
  gameOver: boolean = true;
  message: string = '';

  ngOnInit(): void {
    this.initializeGrid();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  onNChange(value: number): void {
    this.N = value;
  }

  onPlayAgain() {
    this.onStartGame();
  }

  onCellClicked(index: number): void {
    if (this.gameOver || this.grid[index] !== 'yellow') return;

    this.grid[index] = 'green';
    this.playerScore++;
    this.checkGameOver();
    this.timerSubscription?.unsubscribe();
    this.selectedCellIndex = null;
    this.nextTurn();
  }

  onStartGame(): void {
    this.resetGame();
    this.nextTurn();
  }

  private resetGame(): void {
    this.initializeGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.message = '';
  }

  private nextTurn(): void {
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

    this.timerSubscription = timer(this.N).subscribe(() => {
      this.handleTimeout();
    });
  }

  private initializeGrid(): void {
    this.grid = Array.from({ length: this.gridSize * this.gridSize }, () => 'blue');
  }

  private handleTimeout(): void {
    if (this.selectedCellIndex !== null) {
      this.grid[this.selectedCellIndex] = 'red';
      this.computerScore++;
      this.checkGameOver();
      this.selectedCellIndex = null;
      this.nextTurn();
    }
  }

  private checkGameOver(): void {
    if (this.playerScore >= 10) {
      this.gameOver = true;
      this.message = 'You win!';
    } else if (this.computerScore >= 10) {
      this.gameOver = true;
      this.message = 'Computer wins!';
    }
  }

  private endGame(): void {
    this.gameOver = true;
    this.message = 'Game Over';
  }
}
