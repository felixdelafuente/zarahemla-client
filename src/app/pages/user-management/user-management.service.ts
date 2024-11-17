import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/user.model';
import { NewUser } from '../../shared/models/new-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private baseUrl = `${environment.baseApiUrl}/users`; // Base API URL for user endpoints
  private tokenKey = `${environment.baseApiUrl}`
  user: User | undefined = undefined;

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   * @returns Observable of User array
   */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Observable of User
   */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated users
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
   * Add/Register a new user
   * @param user - User object
   * @returns Observable of the created User
   */
  register(user: NewUser): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param user - Updated User object
   * @returns Observable of updated User
   */
  update(id: string, user: Partial<NewUser>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  /**
   * Delete users by IDs
   * @param ids - Object containing array of user IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
