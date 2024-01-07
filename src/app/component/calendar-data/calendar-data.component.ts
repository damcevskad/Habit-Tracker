import { Component, OnInit, Inject } from '@angular/core';
import { Habit } from '../../model/habit';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarDataService } from '../../services/calendar-data/calendar-data.service';

@Component({
  selector: 'app-calendar-data',
  templateUrl: './calendar-data.component.html',
  styleUrl: './calendar-data.component.css'
})

export class CalendarDataComponent implements OnInit {

  habits: Habit[] = [];

  constructor(private calendarDataService: CalendarDataService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    const selectedDate = this.data.selected;
    console.log('Selected Date:', selectedDate);

    this.calendarDataService.habits$.subscribe((habits) => {
      console.log('Updated Habits:', habits);
      this.habits = habits;
    });
  }

}

