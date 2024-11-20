import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TradingItem } from '../../../shared/models/trading-item.model';
import { NewTradingItem } from '../../../shared/models/new-trading-item.model';

@Injectable({
  providedIn: 'root'
})
export class TradingTabService {
  private baseUrl = `${environment.baseApiUrl}/tradings`; // Base API URL for tradingItem endpoints

  constructor(private http: HttpClient) {}

  /**
   * Get all tradingItems
   * @returns Observable of TradingItem array
   */
  getAll(): Observable<TradingItem[]> {
    return this.http.get<TradingItem[]>(`${this.baseUrl}`);
  }

  /**
   * Get tradingItem by ID
   * @param id - TradingItem ID
   * @returns Observable of TradingItem
   */
  getById(id: string): Observable<TradingItem> {
    return this.http.get<TradingItem>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated tradingItems
   * @param pageNumber - Optional page number
   * @param searchInput - Optional search input
   * @returns Observable with paginated data
   */
  getPaginated(pageNumber?: number, searchInput?: string): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    if (pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }
    if (searchInput) {
      params = params.set('searchInput', searchInput);
    }

    return this.http.get<any>(`${this.baseUrl}/paginate`, {
      params,
      observe: 'response', // Include response headers
    });
  }

  /**
   * Add or subtract quantity to a trading item.
   * 
   * @param id The ID of the trading item to modify
   * @param quantityToAdd The quantity to add (positive value) or subtract (negative value)
   * @returns An Observable of the updated trading item
   */
  modifyQuantity(id: string, quantityToAdd: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/add-quantity`, { quantityToAdd });
  }

  /**
   * Add/Register a new tradingItem
   * @param tradingItem - TradingItem object
   * @returns Observable of the created TradingItem
   */
  add(tradingItem: NewTradingItem): Observable<TradingItem> {
    return this.http.post<TradingItem>(`${this.baseUrl}`, tradingItem);
  }

  /**
   * Update an existing tradingItem
   * @param id - TradingItem ID
   * @param tradingItem - Updated TradingItem object
   * @returns Observable of updated TradingItem
   */
  update(id: string, tradingItem: Partial<NewTradingItem>): Observable<TradingItem> {
    return this.http.put<TradingItem>(`${this.baseUrl}/${id}`, tradingItem);
  }

  /**
   * Delete tradingItems by IDs
   * @param ids - Object containing array of tradingItem IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
