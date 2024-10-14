import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../grid/grid.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { ControlsComponent } from '../controls/controls.component';
import { ModalComponent } from '../modal/modal.component';
import { GameService, CellState } from './game.service';

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
  grid: CellState[] = [];
  playerScore: number = 0;
  computerScore: number = 0;
  gameOver: boolean = true;
  message: string = '';
  N: number = 1000;

  private subscriptions = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    // Subscribe to the game state
    this.subscriptions.add(
      this.gameService.grid$.subscribe((grid) => (this.grid = grid))
    );
    this.subscriptions.add(
      this.gameService.playerScore$.subscribe(
        (score) => (this.playerScore = score)
      )
    );
    this.subscriptions.add(
      this.gameService.computerScore$.subscribe(
        (score) => (this.computerScore = score)
      )
    );
    this.subscriptions.add(
      this.gameService.gameOver$.subscribe(
        (gameOver) => (this.gameOver = gameOver)
      )
    );
    this.subscriptions.add(
      this.gameService.message$.subscribe((message) => (this.message = message))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onNChange(value: number): void {
    this.N = value;
    this.gameService.setN(value);
  }

  onPlayAgain(): void {
    this.gameService.handlePlayAgain();
  }

  onCellClicked(index: number): void {
    this.gameService.handleCellClick(index);
  }

  onStartGame(): void {
    this.gameService.setN(this.N);
    this.gameService.startGame();
  }
}
