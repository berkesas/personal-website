import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {
  @Input() data!: string | undefined;
  time!: Date | null;
  timeFormatted!: string | null;

  ngOnInit(): void {
    this.time = this.data == undefined ? new Date() : new Date(this.data);
    let options = { year: 'numeric', month: 'short', day: 'numeric' };
    // let formatter = new Intl.DateTimeFormat('en-US', options);
    this.timeFormatted = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(this.time);
  }
}