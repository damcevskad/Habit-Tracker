import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Habit } from '../../model/habit'; 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent {

  habits: Habit[] = [];
  selected: Date | null = null;

  constructor(private router: Router) {}

  navigateToMyHabits() {
    this.router.navigate(['/my-habits']);
  }

  navigateToMyCalendar() {
    this.router.navigate(['/my-calendar']);
  }
}
