import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Service } from '../../../shared/models/service.model';
import { Observable } from 'rxjs';
import { NewService } from '../../../shared/models/new-service.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesTabService {
  private baseUrl = `${environment.baseApiUrl}/services`; // Base API URL for service endpoints

  constructor(private http: HttpClient) {}

  /**
   * Get all services
   * @returns Observable of Service array
   */
  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}`);
  }

  /**
   * Get service by ID
   * @param id - Service ID
   * @returns Observable of Service
   */
  getById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated services
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
   * Add/Register a new service
   * @param service - Service object
   * @returns Observable of the created Service
   */
  add(service: NewService): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}`, service);
  }

  /**
   * Update an existing service
   * @param id - Service ID
   * @param service - Updated Service object
   * @returns Observable of updated Service
   */
  update(id: string, service: Partial<NewService>): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}/${id}`, service);
  }

  /**
   * Delete services by IDs
   * @param ids - Object containing array of service IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
