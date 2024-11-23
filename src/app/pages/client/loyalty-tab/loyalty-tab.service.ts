import { Injectable } from '@angular/core';
import { Discount } from '../../../shared/models/discount.model';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NewDiscount } from '../../../shared/models/new-discount.model';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyTabService {
  private baseUrl = `${environment.baseApiUrl}/client/discounts`; // Base API URL for discount endpoints

  constructor(private http: HttpClient) {}

  /**
   * Get all discounts
   * @returns Observable of Discount array
   */
  getAll(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.baseUrl}`);
  }

  /**
   * Get discount by ID
   * @param id - Discount ID
   * @returns Observable of Discount
   */
  getById(id: string): Observable<Discount> {
    return this.http.get<Discount>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated discounts
   * @param pageNumber - Optional page number
   * @param searchInput - Optional search input
   * @returns Observable with paginated data
   */
  getPaginated(pageNumber?: number, searchInput?: string, clientId?: string): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    if (pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }
    if (searchInput) {
      params = params.set('searchInput', searchInput);
    }
    if (clientId) {
      params = params.set('clientId', clientId);
    }

    return this.http.get<any>(`${this.baseUrl}/paginate`, {
      params,
      observe: 'response', // Include response headers
    });
  }

  /**
   * Add/Register a new discount
   * @param discount - Discount object
   * @returns Observable of the created Discount
   */
  add(discount: NewDiscount): Observable<Discount> {
    return this.http.post<Discount>(`${this.baseUrl}`, discount);
  }

  /**
   * Update an existing discount
   * @param id - Discount ID
   * @param discount - Updated Discount object
   * @returns Observable of updated Discount
   */
  update(id: string, discount: Partial<NewDiscount>): Observable<Discount> {
    return this.http.put<Discount>(`${this.baseUrl}/${id}`, discount);
  }

  /**
   * Delete discounts by IDs
   * @param ids - Object containing array of discount IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
