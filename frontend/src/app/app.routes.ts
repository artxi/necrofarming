import { Routes } from '@angular/router';
import { JoinComponent } from './join/join.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join', component: JoinComponent },
  { path: 'profile', component: ProfileComponent },
];
