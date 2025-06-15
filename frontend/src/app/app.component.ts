import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  static loginState$ = new BehaviorSubject<boolean>(
    !!(localStorage.getItem('player') || sessionStorage.getItem('player'))
  );
  isLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit() {
    AppComponent.loginState$.subscribe((val) => (this.isLoggedIn = val));
  }

  static setLoggedIn(loggedIn: boolean) {
    AppComponent.loginState$.next(loggedIn);
  }

  logout() {
    // Remove player session
    localStorage.removeItem('player');
    sessionStorage.removeItem('player');
    AppComponent.setLoggedIn(false);
    this.router.navigate(['/']);
  }
}
