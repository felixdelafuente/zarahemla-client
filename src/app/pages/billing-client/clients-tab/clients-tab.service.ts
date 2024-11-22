import { Injectable } from '@angular/core';
import { Client } from '../../../shared/models/client.model';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NewClient } from '../../../shared/models/new-client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsTabService {
  private baseUrl = `${environment.baseApiUrl}/clients`; // Base API URL for client endpoints

  constructor(private http: HttpClient) {}

  /**
   * Get all clients
   * @returns Observable of Client array
   */
  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}`);
  }

  /**
   * Get client by ID
   * @param id - Client ID
   * @returns Observable of Client
   */
  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated clients
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
   * Add/Register a new client
   * @param client - Client object
   * @returns Observable of the created Client
   */
  add(client: NewClient): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}`, client);
  }

  /**
   * Update an existing client
   * @param id - Client ID
   * @param client - Updated Client object
   * @returns Observable of updated Client
   */
  update(id: string, client: Partial<NewClient>): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  /**
   * Delete clients by IDs
   * @param ids - Object containing array of client IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
