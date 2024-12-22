import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Token, User } from '../../shared/models/user.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credentials } from '../../shared/models/credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseApiUrl}/users`; // Base API URL for user endpoints
  private tokenKey = `authToken`
  private currentUserSubject = new BehaviorSubject<Token | undefined>(undefined);
  user: Token | undefined = undefined;

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing user on service initialization
    const existingUser = this.getCurrentUser();
    if (existingUser) {
      this.currentUserSubject.next(existingUser);
    }
  }

  /**
   * Login the user
   * @param username - User's username
   * @param password - User's password
   * @returns Observable of login response
   */
  login(user: Credentials): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, user).pipe(
      tap(response => {
        // Save token in sessionStorage
        const token = JSON.stringify(response);
        sessionStorage.setItem(this.tokenKey, token);
        
        // Get user from response and update subject
        const loggedInUser = response.user;
        console.log('Setting logged in user:', loggedInUser);
        this.currentUserSubject.next(loggedInUser);
      })
    );
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
  getCurrentUser(): Token | undefined {
    const tokenData = sessionStorage.getItem(this.tokenKey);
    console.log('get token:', tokenData);
    if (tokenData) {
      console.log('isTokenData:', tokenData);
      const parsedData: Token = JSON.parse(tokenData);
      console.log('getCurrentUser returning:', parsedData);
      return parsedData;
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
