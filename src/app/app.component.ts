import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'habit-tracker';

  constructor(private router: Router) {}
  
  navigateToMyHabits() {
    this.router.navigate(['/my-habits']);
  }

  navigateToMyCalendar() {
    this.router.navigate(['/my-calendar']);
  }
}
