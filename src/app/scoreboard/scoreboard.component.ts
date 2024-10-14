import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent {
  @Input() playerScore: number = 0;
  @Input() computerScore: number = 0;
}
