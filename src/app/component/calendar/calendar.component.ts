import { Component } from '@angular/core';
import { Habit } from '../../model/habit'; 
import { CalendarDataService } from '../../services/calendar-data/calendar-data.service';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError, Subscription} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDataComponent } from '../calendar-data/calendar-data.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent {

  constructor(private calendarDataService: CalendarDataService, private http: HttpClient, private dialog: MatDialog) {}

  addHabitValue: string = '';
  habits: Habit[] = [];
  selected: Date | null = null;
  private habitsSubscription: Subscription | undefined;

  ngOnInit(): void {
    //this.initialize();
  }

  // private initialize(): void {
  //   this.fetchHabits().subscribe((data: { habits: any[] }) => {
  //     const fetchedHabits = data.habits || [];
  //     console.log('Fetched Habits:', fetchedHabits);
  //     this.calendarDataService.setHabits(fetchedHabits);
  //   });
  // }  

  private fetchHabits(): Observable<void | unknown> {
    return this.http.get<{ habits: any[] }>('/db.json')
      .pipe(
        catchError((error: any) => {
          console.error('Unable to fetch habits:', error);
          return throwError(() => error);
        }),
        tap((data) => {
          const fetchedHabits = data.habits || [];
          console.log('Fetched Habits:', fetchedHabits);
          this.calendarDataService.setHabits(fetchedHabits);
        })
      );
  }
  
      ngOnDestroy(): void {
        if (this.habitsSubscription) {
          this.habitsSubscription.unsubscribe();
        }      
      }
      
      handleDateClick(selectedDate: Date | null): void {
        if (selectedDate !== null) {
          this.selected = selectedDate;
          this.fetchHabits().subscribe(() => {
          });
          this.openModal();
        }
      }
      

  openModal(): void {
    this.dialog.open(CalendarDataComponent, {
      width: '400px',
      data: { selected: this.selected }
    });
  }

  closeModal(): void {
    this.selected = null;
  }
}

