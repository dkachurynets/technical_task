import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';

export enum CellState {
  Blue = 'blue',
  Yellow = 'yellow',
  Green = 'green',
  Red = 'red',
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly GRID_SIZE = 10;
  private readonly WINNING_SCORE = 10;

  private grid: CellState[] = [];
  private N: number = 1000;
  private playerScore = 0;
  private computerScore = 0;
  private selectedCellIndex: number | null = null;
  private timerSubscription: Subscription | null = null;
  private gameOver = true;
  private message = '';

  // Observables to expose the state
  private gridSubject = new BehaviorSubject<CellState[]>([]);
  private playerScoreSubject = new BehaviorSubject<number>(0);
  private computerScoreSubject = new BehaviorSubject<number>(0);
  private gameOverSubject = new BehaviorSubject<boolean>(true);
  private messageSubject = new BehaviorSubject<string>('');

  constructor() {
    this.initializeGrid();
  }

  // Exposed Observables
  get grid$(): Observable<CellState[]> {
    return this.gridSubject.asObservable();
  }

  get playerScore$(): Observable<number> {
    return this.playerScoreSubject.asObservable();
  }

  get computerScore$(): Observable<number> {
    return this.computerScoreSubject.asObservable();
  }

  get gameOver$(): Observable<boolean> {
    return this.gameOverSubject.asObservable();
  }

  get message$(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  setN(value: number): void {
    this.N = value;
  }

  startGame(): void {
    this.resetGame();
    this.nextTurn();
  }

  handleCellClick(index: number): void {
    if (this.canPlayerClickCell(index)) {
      this.handlePlayerClick(index);
    }
  }

  handlePlayAgain(): void {
    this.startGame();
  }

  private initializeGrid(): void {
    this.grid = Array(this.GRID_SIZE * this.GRID_SIZE).fill(CellState.Blue);
    this.gridSubject.next(this.grid);
  }

  private resetGame(): void {
    this.initializeGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.message = '';
    this.selectedCellIndex = null;
    this.unsubscribeTimer();

    // Emit updated state
    this.playerScoreSubject.next(this.playerScore);
    this.computerScoreSubject.next(this.computerScore);
    this.gameOverSubject.next(this.gameOver);
    this.messageSubject.next(this.message);
  }

  private nextTurn(): void {
    if (this.gameOver) return;

    const cellIndex = this.selectRandomAvailableCell();
    if (cellIndex === null) {
      this.endGame('No more available cells.');
      return;
    }

    this.highlightCell(cellIndex);
    this.startTimer();
  }

  private selectRandomAvailableCell(): number | null {
    const availableCells = this.grid
      .map((state, index) => (state === CellState.Blue ? index : null))
      .filter((index): index is number => index !== null);

    if (availableCells.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }

  private highlightCell(index: number): void {
    this.selectedCellIndex = index;
    this.grid[index] = CellState.Yellow;
    this.gridSubject.next([...this.grid]);
  }

  private startTimer(): void {
    this.unsubscribeTimer();

    this.timerSubscription = timer(this.N).subscribe(() => {
      this.handleTimeout();
    });
  }

  private handlePlayerClick(index: number): void {
    this.grid[index] = CellState.Green;
    this.playerScore++;
    this.unsubscribeTimer();
    this.selectedCellIndex = null;

    this.gridSubject.next([...this.grid]);
    this.playerScoreSubject.next(this.playerScore);

    if (this.isWinningScore(this.playerScore)) {
      this.endGame('You win!');
    } else {
      this.nextTurn();
    }
  }

  private handleTimeout(): void {
    if (this.selectedCellIndex !== null) {
      this.grid[this.selectedCellIndex] = CellState.Red;
      this.computerScore++;
      this.selectedCellIndex = null;

      this.gridSubject.next([...this.grid]);
      this.computerScoreSubject.next(this.computerScore);

      if (this.isWinningScore(this.computerScore)) {
        this.endGame('Computer wins!');
      } else {
        this.nextTurn();
      }
    }
  }

  private canPlayerClickCell(index: number): boolean {
    return !this.gameOver && this.grid[index] === CellState.Yellow;
  }

  private isWinningScore(score: number): boolean {
    return score >= this.WINNING_SCORE;
  }

  private endGame(message: string): void {
    this.gameOver = true;
    this.message = message;
    this.unsubscribeTimer();

    this.gameOverSubject.next(this.gameOver);
    this.messageSubject.next(this.message);
  }

  private unsubscribeTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = null;
  }
}
