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

  habitDescription: string = '';
  habitFrequency: string = '';
  habitStartDate: string = '';

  updateHabitValue: string = '';
  updateHabitDescription: string = '';
  updateHabitFrequency: string = '';
  updateHabitStartDate: string = '';

  sortedHabits: Habit[] = [];
  isSortedAsc: boolean = false;

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
    if (this.habitArr.some(habit => habit.name.toLowerCase() === this.addHabitValue.toLowerCase())) {
      alert('The habit is already in practice.');
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
          this.sortHabits();
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
      .pipe(
        tap(res => {
          this.ngOnInit();
          this.resetHabitDetails();
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

  sortHabits() {
    this.isSortedAsc = !this.isSortedAsc;

    this.sortedHabits = [...this.habitArr].sort((a, b) => {
      const nameComparison = this.isSortedAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);

      if (nameComparison === 0) {
        const dateA = a.startDate || new Date(0);
        const dateB = b.startDate || new Date(0);
        return dateB.getTime() - dateA.getTime();
      }

      return nameComparison;
    });
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
