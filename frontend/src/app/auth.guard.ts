import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const player = localStorage.getItem('player') || sessionStorage.getItem('player');
    if (player) {
      return true;
    }
    this.router.navigate(['/join']);
    return false;
  }
}
