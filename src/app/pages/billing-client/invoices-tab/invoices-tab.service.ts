import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InvoicesTabService {
  private baseUrl = `${environment.baseApiUrl}/sales`; // Base API URL for discount endpoints

  constructor(private http: HttpClient) { }
  
  /**
   * Get paginated discounts
   * @param pageNumber - Optional page number
   * @param searchInput - Optional search input
   * @returns Observable with paginated data
   */
  getPaginated(pageNumber?: number, paid?: boolean): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    if (pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }

    if (paid !== undefined) {
      params = params.set('paid', paid);
    }

    return this.http.get<any>(`${this.baseUrl}/paginate`, {
      params,
      observe: 'response', // Include response headers
    });
  }

  /**
   * Changes the paid and recurring status of a transaction.
   * 
   * @param id The ID of the sale item to modify
   * @param paid The boolean to mark transaction as paid
   * @param recurring The boolean to mark transaction as recurring
   * @returns An Observable of the updated trading item
   */
  modifyPaidRecurring(id: string, paid: boolean, recurring: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/paid-recurring`, { paid, recurring });
  }
}
