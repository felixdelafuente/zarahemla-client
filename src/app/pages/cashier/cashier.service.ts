import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NewSale } from '../../shared/models/new-sale.model';
import { Sale } from '../../shared/models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private baseUrl = `${environment.baseApiUrl}/sales`; // Base API URL for discount endpoints

  constructor(private http: HttpClient) {}

  /**
   * Add/Register a new discount
   * @param cart - Sale object
   * @returns Observable of the created Sale
   */
  add(cart: NewSale): Observable<Sale> {
    return this.http.post<Sale>(`${this.baseUrl}`, cart);
  }
}
