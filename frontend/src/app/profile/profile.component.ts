import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  player: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.fb.group({
      nickname: ['', Validators.required],
      anonymous: [false]
    });
  }

  ngOnInit() {
    const playerStr = localStorage.getItem('player') || sessionStorage.getItem('player');
    if (playerStr) {
      this.player = JSON.parse(playerStr);
      this.profileForm.patchValue({
        nickname: this.player.nickname || '',
        anonymous: this.player.anonymous || false
      });
    }
  }

  saveProfile() {
    if (!this.player) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    const payload: any = {
      anonymous: this.profileForm.value.anonymous
    };
    if (!this.profileForm.value.anonymous) {
      payload.nickname = this.profileForm.value.nickname;
    }
    this.http.patch<any>(`/api/players/${this.player._id}`, payload).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('player', JSON.stringify(res));
        AppComponent.setLoggedIn(true);
        this.success = 'Profile updated!';
      },
      error: (err) => {
        this.error = err.error?.message || 'An error occurred';
        this.loading = false;
      }
    });
  }
}
