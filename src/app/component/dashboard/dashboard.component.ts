import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Habit } from '../../model/habit';
import { catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  habitObj: Habit = new Habit();
  habitArr: Habit[] = [];
  addHabitValue: string = '';
  updateHabitValue: string = '';

  habitDescription: string = '';
  habitFrequency: string = '';
  habitStartDate: string = ''; 

  updateHabitDescription: string = ''; 
  updateHabitFrequency: string = '';  
  updateHabitStartDate: string = '';  

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.addHabitValue = '';
    this.updateHabitValue = '';
    this.habitObj = new Habit();
    this.habitArr = [];
    this.readHabit();
  }
  
  createHabit() {
    if (!this.addHabitValue.trim()) {
      alert('Please enter a habit.');
      return;
    }
  
    const newHabit = new Habit();
    newHabit.name = this.addHabitValue;
    newHabit.description = this.habitDescription;
    newHabit.frequency = this.habitFrequency;
    newHabit.startDate = new Date(this.habitStartDate);
  
    this.crudService.createHabit(newHabit)
      .pipe(
        tap(res => {
          this.ngOnInit();
          this.addHabitValue = '';
          this.resetHabitDetails()
        }),
        catchError(err => {
          alert(err);
          throw err;
        })
      )
      .subscribe();
  }
  
  
  readHabit() {
    this.crudService.readHabit()
      .pipe(
        tap((res: any) => {
          this.habitArr = res;
        }),
        catchError(err => {
          alert("Unable to read habits.");
          throw err;
        })
      )
      .subscribe();
  }


  updateHabit() {
    if (!this.updateHabitValue.trim()) {
      alert('Please enter a habit.');
      return;
    }
  
    this.habitObj.name = this.updateHabitValue;
  
    this.crudService.updateHabit(this.habitObj)
      .pipe(
        tap(res => {
          this.ngOnInit();
        }),
        catchError(err => {
          alert("Failed to update habit.");
          throw err;
        })
      )
      .subscribe();
  }
  

  deleteHabit(ehabit: Habit) {
    this.crudService.deleteHabit(ehabit)
      .pipe(
        tap(res => {
          this.ngOnInit();
        }),
        catchError(err => {
          alert("Failed to delete habit.");
          throw err;
        })
      )
      .subscribe();
  }

  call(ehabit: Habit) {
    this.habitObj = ehabit;
    this.updateHabitValue = ehabit.name;
  }

  private resetHabitDetails() {
    this.habitDescription = '';
    this.habitFrequency = '';
    this.habitStartDate = '';
  }

}
