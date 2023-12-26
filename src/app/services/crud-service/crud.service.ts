import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Habit } from '../../model/habit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  serviceURL : string;

  constructor(private http : HttpClient) { 
    this.serviceURL = "http://localhost:3000/habits"
  }

  createHabit(habit: Habit) : Observable<Habit> {
    return this.http.post<Habit>(this.serviceURL, habit)
  }
  
  readHabits() : Observable<Habit[]> {
    return this.http.get<Habit[]>(this.serviceURL)
  }

  updateHabit(habit : Habit) : Observable<Habit> {
    return this.http.put<Habit>(this.serviceURL + '/' + habit.id, habit)
  }

  deleteHabit(habit : Habit) : Observable<Habit> {
    return this.http.delete<Habit>(this.serviceURL + '/' + habit.id)
  }

  readHabitOptions() {
    return this.http.get('http://localhost:3000/habitOptions');
}
}

