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

  ngOnInit(): void {
    this.time = this.data == undefined ? new Date() : new Date(this.data);
  }
}