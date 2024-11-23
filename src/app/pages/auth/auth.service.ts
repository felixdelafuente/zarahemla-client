import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { Credentials } from '../../shared/models/credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseApiUrl}/users`; // Base API URL for user endpoints
  private tokenKey = `${environment.baseApiUrl}`
  user: User | undefined = undefined;

  constructor(private http: HttpClient) {}

  /**
   * Login the user
   * @param username - User's username
   * @param password - User's password
   * @returns Observable of login response
   */
  login(user: Credentials): Observable<any> {
    const loginData = user;

    return new Observable((observer) => {
      this.http.post<any>(`${this.baseUrl}/authenticate`, loginData).subscribe({
        next: (response) => {
          // Save token in sessionStorage
          const token = JSON.stringify({
            user: response.user,
            token: response.token,
          });
          sessionStorage.setItem(this.tokenKey, token);
          observer.next(response);
          observer.complete();
        },
        error: (err) => console.log(err),
      });
    });
  }

  /**
   * Logout the user
   * Clears the token from sessionStorage
   */
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  /**
   * Get the current user information from the stored token
   * @returns User object if token exists, otherwise undefined
   */
  getCurrentUser(): User | undefined {
    const tokenData = sessionStorage.getItem(this.tokenKey);
    if (tokenData) {
      const parsedData = JSON.parse(tokenData);
      return parsedData.user;
    }
    return undefined;
  }

  /**
   * Check if the user is authenticated
   * @returns true if the user is logged in, false otherwise
   */
  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null;
  }
}
