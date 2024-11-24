import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Vehicle } from '../../../shared/models/vehicle.model';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewVehicle } from '../../../shared/models/new-vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleTabService {
  private baseUrl = `${environment.baseApiUrl}/client/vehicles`; // Base API URL for vehicle endpoints

  constructor(private http: HttpClient) {}

  /**
   * Get all vehicles
   * @returns Observable of Vehicle array
   */
  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}`);
  }

  /**
   * Get vehicle by ID
   * @param id - Vehicle ID
   * @returns Observable of Vehicle
   */
  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get paginated vehicles
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
   * Add/Register a new vehicle
   * @param vehicle - Vehicle object
   * @returns Observable of the created Vehicle
   */
  add(vehicle: NewVehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}`, vehicle);
  }

  /**
   * Update an existing vehicle
   * @param id - Vehicle ID
   * @param vehicle - Updated Vehicle object
   * @returns Observable of updated Vehicle
   */
  update(id: string, vehicle: Partial<NewVehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, vehicle);
  }

  /**
   * Delete vehicles by IDs
   * @param ids - Object containing array of vehicle IDs
   * @returns Observable of any
   */
  delete(ids: { ids: string[] }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, {
      body: ids,
    });
  }
}
