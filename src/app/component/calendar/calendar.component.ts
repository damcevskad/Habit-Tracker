import { Component } from '@angular/core';
import { Habit } from '../../model/habit'; 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent {

  addHabitValue: string = '';

  habits: Habit[] = [];
  selected: Date | null = null;
}
