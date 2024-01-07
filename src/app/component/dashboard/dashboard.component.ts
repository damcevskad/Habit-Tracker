import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../services/crud-service/crud.service';
import { Habit } from '../../model/habit';
import { catchError, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  habitObj: Habit = new Habit();
  allHabits: Habit[] = [];
  addHabitValue: string = '';

  defaultDescription: string = '';
  defaultFrequency: string = '';
  defaultStartDate: string = '';

  updatedValue: string = '';
  updatedDescription: string = '';
  updatedFrequency: string = '';
  updatedStartDate: string = '';

  sortedHabits: Habit[] = [];
  isSortedAsc: boolean = false;
  selectedFrequency: string = 'All';
  habitOptions: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private crudService: CrudService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.addHabitValue = '';
    this.updatedValue = '';
    this.habitObj = new Habit();
    this.allHabits = [];
    this.readHabits();
    this.readHabitOptions();
  }

  createHabit() {
    if (!this.addHabitValue.trim()) {
      this.toastr.error('Please enter a habit.');
      return;
    }
    if (this.allHabits.some(habit => habit.name.toLowerCase() === this.addHabitValue.toLowerCase())) {
      this.toastr.warning('The habit is already in practice.');
      return;
    }

    const newHabit = new Habit();
    newHabit.name = this.addHabitValue;
    newHabit.description = this.defaultDescription;
    newHabit.frequency = this.defaultFrequency;
    newHabit.startDate = new Date(this.defaultStartDate);

    this.crudService.createHabit(newHabit)
    .pipe(
      tap(res => {
        this.initialize();
        this.sortHabits();
        this.toastr.success('Habit added successfully.');
      }),
      catchError(err => {
        this.toastr.error('Unable to create habit.');
        throw err;
      })
    )
    .subscribe();
  }

  readHabits() {
    this.crudService.readHabits()
      .pipe(
        tap((res: any) => {
          this.allHabits = res;
          this.sortHabits();
        }),
        catchError(err => {
          this.toastr.error('"Unable to read habits.');
          throw err;
        })
      )
      .subscribe();
  }

  updateHabit() {
    if (!this.updatedValue.trim()) {
      this.toastr.error('Please enter a habit.');
      return;
    }

    const updatedHabit: Habit = {
      ...this.habitObj,
      name: this.updatedValue,
      description: this.updatedDescription,
      frequency: this.updatedFrequency,
      startDate: new Date(this.updatedStartDate),
    };

    this.crudService.updateHabit(updatedHabit)
    .pipe(
      tap(res => {
        this.initialize();
        this.sortHabits();
        this.toastr.success('Habit updated successfully.');
      }),
      catchError(err => {
        this.toastr.error('Failed to update habit.');
        throw err;
      })
    )
    .subscribe();
  }

  deleteHabit(ehabit: Habit) {
    this.crudService.deleteHabit(ehabit)
    .pipe(
      tap(res => {
        this.initialize();
        this.sortHabits();
        this.toastr.success('Habit deleted successfully.');
      }),
      catchError(err => {
        this.toastr.error('Failed to delete habit.');
        throw err;
      })
    )
    .subscribe();
  }

sortHabits() {
  this.isSortedAsc = !this.isSortedAsc;

  this.sortedHabits = [...this.allHabits].sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name);

    if (nameComparison === 0) {
      const dateA = a.startDate || new Date(0);
      const dateB = b.startDate || new Date(0);
      return this.isSortedAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }

    return this.isSortedAsc ? nameComparison : -nameComparison;
  });
}

  call(ehabit: Habit) {
    this.habitObj = ehabit;
    this.updatedValue = ehabit.name;
    this.updatedDescription = ehabit.description;
    this.updatedFrequency = ehabit.frequency;
    this.updatedStartDate = ehabit.startDate?.toISOString().split('T')[0] || '';
  }

  readHabitOptions() {
    this.crudService.readHabitOptions()
      .pipe(
        tap((res: any) => {
          this.habitOptions = res;
        }),
        catchError(err => {
          alert("Unable to read habit options.");
          throw err;
        })
      )
      .subscribe();
  }

  selectHabit(selectedHabit: string) {
    this.addHabitValue = selectedHabit;
  }

  filterHabits(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.habitOptions = this.habitOptions.filter(option => option.toLowerCase().includes(filterValue));
}

ngOnDestroy(): void {
  this.subscriptions.forEach(subscription => subscription.unsubscribe());
}
}

