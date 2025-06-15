import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  aggregated: any[] = [];
  aggregatedSorted: any[] = [];
  employees: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.http.get<any[]>('/api/players/aggregated-picks').toPromise(),
      this.http.get<any[]>('/api/employees').toPromise()
    ]).then(([agg, emps]) => {
      const aggSafe = agg || [];
      const empsSafe = emps || [];
      this.employees = empsSafe;
      this.aggregated = aggSafe.map((row: any) => ({
        ...row,
        name: empsSafe.find((e: any) => e._id === row.employee)?.name || row.employee
      }));
      this.aggregatedSorted = this.aggregated.slice().sort((a, b) => b.count - a.count);
      this.loading = false;
    }).catch(() => {
      this.error = 'Could not load aggregated picks.';
      this.loading = false;
    });
  }

  getEmployee(id: string) {
    return this.employees.find(e => e._id === id);
  }
}
