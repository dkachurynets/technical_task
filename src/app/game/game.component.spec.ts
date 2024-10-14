import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameService, CellState } from './game.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        {
          provide: GameService,
          useValue: {
            grid$: new BehaviorSubject<CellState[]>([]),
            playerScore$: new BehaviorSubject<number>(0),
            computerScore$: new BehaviorSubject<number>(0),
            gameOver$: new BehaviorSubject<boolean>(true),
            message$: new BehaviorSubject<string>(''),
            setN: jasmine.createSpy('setN'),
            startGame: jasmine.createSpy('startGame'),
            handleCellClick: jasmine.createSpy('handleCellClick'),
            handlePlayAgain: jasmine.createSpy('handlePlayAgain'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to game service observables on init', () => {
    expect(component.grid).toEqual([]);
    expect(component.playerScore).toBe(0);
    expect(component.computerScore).toBe(0);
    expect(component.gameOver).toBe(true);
    expect(component.message).toBe('');
  });

  it('should call gameService.setN when onNChange is called', () => {
    const newValue = 2000;
    component.onNChange(newValue);
    expect(gameService.setN).toHaveBeenCalledWith(newValue);
  });

  it('should call gameService.startGame when onStartGame is called', () => {
    component.onStartGame();
    expect(gameService.setN).toHaveBeenCalledWith(component.N);
    expect(gameService.startGame).toHaveBeenCalled();
  });

  it('should call gameService.handleCellClick when onCellClicked is called', () => {
    const cellIndex = 5;
    component.onCellClicked(cellIndex);
    expect(gameService.handleCellClick).toHaveBeenCalledWith(cellIndex);
  });

  it('should call gameService.handlePlayAgain when onPlayAgain is called', () => {
    component.onPlayAgain();
    expect(gameService.handlePlayAgain).toHaveBeenCalled();
  });

  it('should update component properties when game service observables emit values', () => {
    const testGrid = [CellState.Blue, CellState.Yellow];
    const playerScore = 3;
    const computerScore = 2;
    const gameOver = false;
    const message = 'Test Message';

    // Emit new values
    (gameService.grid$ as BehaviorSubject<CellState[]>).next(testGrid);
    (gameService.playerScore$ as BehaviorSubject<number>).next(playerScore);
    (gameService.computerScore$ as BehaviorSubject<number>).next(computerScore);
    (gameService.gameOver$ as BehaviorSubject<boolean>).next(gameOver);
    (gameService.message$ as BehaviorSubject<string>).next(message);

    // Trigger change detection
    fixture.detectChanges();

    expect(component.grid).toEqual(testGrid);
    expect(component.playerScore).toBe(playerScore);
    expect(component.computerScore).toBe(computerScore);
    expect(component.gameOver).toBe(gameOver);
    expect(component.message).toBe(message);
  });

  it('should display the correct scores in the template', () => {
    component.playerScore = 5;
    component.computerScore = 7;
    fixture.detectChanges();

    const playerScoreElement = fixture.debugElement.query(
      By.css('.score-board .player-score')
    ).nativeElement;
    const computerScoreElement = fixture.debugElement.query(
      By.css('.score-board .computer-score')
    ).nativeElement;

    expect(playerScoreElement.textContent).toContain('Player Score: 5');
    expect(computerScoreElement.textContent).toContain('Computer Score: 7');
  });

  it('should display the modal when game is over and message is set', () => {
    component.gameOver = true;
    component.message = 'Test Game Over Message';
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('app-modal'));
    expect(modalElement).toBeTruthy();

    const messageElement = modalElement.query(By.css('.modal-content p'))
      .nativeElement;
    expect(messageElement.textContent).toBe('Test Game Over Message');
  });

  it('should not display the modal when game is not over', () => {
    component.gameOver = false;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('app-modal'));
    expect(modalElement).toBeFalsy();
  });

  it('should pass correct inputs to child components', () => {
    component.N = 1500;
    component.gameOver = false;
    component.grid = [CellState.Blue, CellState.Green];
    fixture.detectChanges();

    const controlsComponent = fixture.debugElement.query(
      By.css('app-controls')
    ).componentInstance;
    const gridComponent = fixture.debugElement.query(By.css('app-grid'))
      .componentInstance;
    const scoreboardComponent = fixture.debugElement.query(
      By.css('app-scoreboard')
    ).componentInstance;

    expect(controlsComponent.N).toBe(1500);
    expect(controlsComponent.gameOver).toBe(false);
    expect(gridComponent.grid).toEqual(component.grid);
    expect(scoreboardComponent.playerScore).toBe(component.playerScore);
    expect(scoreboardComponent.computerScore).toBe(component.computerScore);
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
