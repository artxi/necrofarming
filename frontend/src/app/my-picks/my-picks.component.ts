import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-picks',
  templateUrl: './my-picks.component.html',
  styleUrls: ['./my-picks.component.scss'],
  standalone: false,
})
export class MyPicksComponent implements OnInit {
  picksForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  picksLockedAt: string | null = null;
  player: any = null;
  employees: any[] = [];
  initialPicks: any[] = [];
  saveDisabled = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.picksForm = this.fb.group({
      picks: this.fb.array([])
    });
  }

  ngOnInit() {
    const playerStr = localStorage.getItem('player') || sessionStorage.getItem('player');
    if (!playerStr) {
      this.router.navigate(['/join']);
      return;
    }
    this.player = JSON.parse(playerStr);
    this.fetchEmployees();
    this.fetchPicks();

    this.picksForm.valueChanges.subscribe(() => {
      this.saveDisabled = !this.hasAnyPickChanged();
    });
  }

  get picksArray() {
    return this.picksForm.get('picks') as FormArray;
  }

  fetchEmployees() {
    this.http.get<any[]>('/api/employees').subscribe({
      next: (data) => { this.employees = data; },
      error: () => { this.error = 'Could not load employees.'; }
    });
  }

  fetchPicks() {
    this.loading = true;
    this.http.get<any>(`/api/players/${this.player._id}/picks`).subscribe({
      next: (data) => {
        const picks = data.picks || [];
        this.picksArray.clear();
        for (let i = 0; i < 8; i++) {
          const pick = picks[i] || { employee: '', cause: 'voluntary' };
          this.picksArray.push(this.fb.group({
            employee: [pick.employee],
            cause: [pick.cause]
          }));
        }
        this.initialPicks = this.picksArray.value.map((p: any) => ({ ...p }));
        this.picksLockedAt = data.picksLockedAt || null;
        this.loading = false;
        this.saveDisabled = true; // Ensure save is disabled after loading picks
      },
      error: () => {
        this.error = 'Could not load picks.';
        this.loading = false;
      }
    });
  }

  savePicks() {
    this.error = null;
    this.success = null;
    this.loading = true;
    this.http.patch(`/api/players/${this.player._id}/picks`, this.picksArray.value).subscribe({
      next: () => {
        this.success = 'Picks saved!';
        this.loading = false;
        setTimeout(() => { this.success = null; }, 2000);
        // After save, update initialPicks and disable save
        this.initialPicks = this.picksArray.value.map((p: any) => ({ ...p }));
        this.saveDisabled = true;
      },
      error: () => {
        this.error = 'Could not save picks.';
        this.loading = false;
        setTimeout(() => { this.error = null; }, 2000);
      }
    });
  }

  lockPicks() {
    this.error = null;
    this.success = null;
    // Check if all picks are filled before locking
    const incomplete = this.picksArray.controls.some(ctrl => !ctrl.value.employee || !ctrl.value.cause);
    if (incomplete) {
      this.error = 'Please fill all picks before locking.';
      setTimeout(() => { this.error = null; }, 2000);
      return;
    }
    this.loading = true;
    this.http.post(`/api/players/${this.player._id}/picks/lock`, {}).subscribe({
      next: (res: any) => {
        this.picksLockedAt = res.picksLockedAt;
        this.loading = false;
        // No success message needed
      },
      error: () => {
        this.error = 'Could not lock picks.';
        this.loading = false;
        setTimeout(() => { this.error = null; }, 2000);
      }
    });
  }

  getEmployeeName(id: string): string {
    return this.employees.find(e => e._id === id)?.name || 'N/A';
  }

  getEmployee(id: string) {
    return this.employees.find(e => e._id === id);
  }

  get hasDepartedPicks(): boolean {
    return this.picksArray.value.some((pick: any) => this.getEmployee(pick.employee)?.departureDate);
  }

  hasAnyPickChanged(): boolean {
    // Compare current picks to initial picks
    return this.picksArray.value.some((pick: any, i: number) =>
      pick.employee !== this.initialPicks[i]?.employee || pick.cause !== this.initialPicks[i]?.cause
    );
  }

  areAllPicksFilled(): boolean {
    return this.picksArray.controls.every(ctrl => !!ctrl.value.employee && !!ctrl.value.cause);
  }

  getAvailableEmployees(index: number): any[] {
    const selectedIds = this.picksArray.controls
      .map((ctrl, i) => i !== index ? ctrl.value.employee : null)
      .filter(id => !!id);
    return this.employees.filter(emp => !selectedIds.includes(emp._id));
  }
}
