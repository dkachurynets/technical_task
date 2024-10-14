import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { timer, Subscription } from 'rxjs';

interface Cell {
  color: string;
}

@Component({
  selector: 'app-root',
  standalone: true, // Declare as standalone component
  imports: [CommonModule, FormsModule], // Import modules here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  gridSize = 10;
  grid: Cell[] = [];
  N: number = 1000; // Default time in milliseconds
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
    this.grid = Array.from({ length: this.gridSize * this.gridSize }, () => ({
      color: 'blue',
    }));
  }

  startGame() {
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
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell.color === 'blue');

    if (availableCells.length === 0) {
      this.endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomIndex].index;
    this.selectedCellIndex = cellIndex;
    this.grid[cellIndex].color = 'yellow';

    // Start timer
    this.timerSubscription = timer(this.N).subscribe(() => {
      this.handleTimeout();
    });
  }

  handleCellClick(index: number) {
    if (this.gameOver || this.grid[index].color !== 'yellow') return;

    // Player clicked on the highlighted cell
    this.grid[index].color = 'green';
    this.playerScore++;
    this.checkGameOver();
    this.timerSubscription?.unsubscribe();
    this.selectedCellIndex = null;
    this.nextTurn();
  }

  handleTimeout() {
    if (this.selectedCellIndex !== null) {
      this.grid[this.selectedCellIndex].color = 'red';
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
}
