import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  standalone: false,
})
export class JoinComponent {
  joinForm: FormGroup;
  result: any = null;
  error: string | null = null;
  loading = false;
  step: 'code' | 'details' = 'code';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.joinForm = this.fb.group({
      code: ['', Validators.required],
      nickname: [''],
      anonymous: [false]
    });
    this.joinForm.get('nickname')?.disable();
    this.joinForm.get('anonymous')?.disable();
  }

  onAnonymousChange() {
    if (this.joinForm.get('anonymous')?.value) {
      this.joinForm.get('nickname')?.disable();
      this.joinForm.get('nickname')?.setValue('');
    } else {
      this.joinForm.get('nickname')?.enable();
    }
  }

  joinCode() {
    this.error = null;
    this.result = null;
    this.loading = true;
    const code = this.joinForm.value.code;
    if (this.step === 'code') {
      // Only send code to check if player exists
      this.http.post<any>(`/api/codes/${encodeURIComponent(code)}/claim`, {}).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.alreadyUsed) {
            if (res.player) {
              localStorage.setItem('player', JSON.stringify(res.player));
              AppComponent.setLoggedIn(true);
            }
            this.router.navigate(['/profile']);
          } else {
            this.step = 'details';
            this.joinForm.get('anonymous')?.enable();
            this.joinForm.get('nickname')?.enable();
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'An error occurred';
          this.loading = false;
        }
      });
    } else {
      // Create new player
      const payload = {
        nickname: this.joinForm.get('anonymous')?.value ? undefined : this.joinForm.value.nickname,
        anonymous: this.joinForm.value.anonymous
      };
      this.http.post<any>(`/api/codes/${encodeURIComponent(code)}/claim`, payload).subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
          if (res.player) {
            localStorage.setItem('player', JSON.stringify(res.player));
            AppComponent.setLoggedIn(true);
          }
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.error = err.error?.message || 'An error occurred';
          this.loading = false;
        }
      });
    }
  }
}
