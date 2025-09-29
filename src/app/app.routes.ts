import { Routes } from '@angular/router';
import { AvailabilityComponent } from './features/availability/availability';

export const routes: Routes = [
{ path: '', redirectTo: 'availability', pathMatch: 'full' },
{ path: 'availability', component: AvailabilityComponent },
];
