import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.baseApiUrl}/sales`; // Base API URL for discount endpoints

  constructor(private http: HttpClient) { }

  /**
   * Fetch sales data based on optional query parameters
   * 
   * @param date Optional specific date (1-31)
   * @param week Optional week (1-4)
   * @param month Mandatory month (1-12)
   * @param year Mandatory year (4 digits)
   * @returns Observable with the sales data
   */
  getSales(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
