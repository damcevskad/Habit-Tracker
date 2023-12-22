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

    const updatedHabit: Habit = {
        ...this.habitObj, 
        name: this.updateHabitValue,
        description: this.updateHabitDescription,
        frequency: this.updateHabitFrequency,
        startDate: new Date(this.updateHabitStartDate),
    };

    this.crudService.updateHabit(updatedHabit)
        .subscribe(
            () => {
                this.ngOnInit();
                this.resetHabitDetails();
            },
            error => {
                alert("Failed to update habit.");
                console.error(error);
            }
        );
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
    this.updateHabitDescription = ehabit.description;
    this.updateHabitFrequency = ehabit.frequency;
    this.updateHabitStartDate = ehabit.startDate?.toISOString().split('T')[0] || '';
}

  private resetHabitDetails() {
    this.habitDescription = '';
    this.habitFrequency = '';
    this.habitStartDate = '';
  }

}
