import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCard } from '../student-card/student-card';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, StudentCard],
  template: `
    <section style="border: 1px solid #ccc; padding: 16px; border-radius: 8px;">
      <h2>Student List (Parent)</h2>
      <p style="font-size: 14px; color: #555;">
        This component passes data to <strong>app-student-card</strong> via <code>@Input()</code> 
        and listens for events using <code>@Output()</code>.
      </p>

      <div style="display: flex; flex-wrap: wrap;">
        <app-student-card
          *ngFor="let student of students"
          [student]="student"
          (viewDetails)="handleViewDetails($event)">
        </app-student-card>
      </div>
    </section>
  `
})
export class StudentList {
  students = [
    { name: 'Arun', age: 21, dept: 'CSE' },
    { name: 'Meena', age: 22, dept: 'ECE' },
    { name: 'Karthik', age: 23, dept: 'IT' }
  ];

  handleViewDetails(student: any) {
    alert(`Details: ${student.name} (${student.dept})`);
  }
}
