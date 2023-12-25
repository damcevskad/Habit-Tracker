import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CalendarComponent } from './component/calendar/calendar.component';

const routes: Routes = [
  { path: '', redirectTo: '/my-habits', pathMatch: 'full' },
  { path: 'my-habits', component: DashboardComponent },
  { path: 'my-calendar', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

