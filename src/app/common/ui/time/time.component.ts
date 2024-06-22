import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {
  @Input() data!: string;
  time!: Date | null;

  ngOnInit(): void {
    this.time = new Date(this.data);
  }
}
