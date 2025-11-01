import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>{{ student.name }}</h3>
      <p>Age: {{ student.age }}</p>
      <p>Department: {{ student.dept }}</p>
      <button (click)="onViewDetails()">View Details</button>
    </div>
  `,
  styles: [`
    .card { 
      border: 1px solid #ccc;
      padding: 12px;
      margin: 8px;
      border-radius: 8px;
      width: 200px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover { transform: scale(1.02); }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover { background-color: #0056b3; }
  `]
})
export class StudentCard {
  @Input() student: any;
  @Output() viewDetails = new EventEmitter<any>();

  onViewDetails() {
    this.viewDetails.emit(this.student);
  }
}
