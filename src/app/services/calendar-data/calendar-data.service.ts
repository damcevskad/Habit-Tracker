import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Habit } from '../../model/habit';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  
  private dataSubject = new BehaviorSubject<Habit[]>([]);
  habits$: Observable<Habit[]> = this.dataSubject.asObservable();

  setHabits(habits: Habit[]): void {
    this.dataSubject.next(habits);
  }
}