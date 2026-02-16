import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturer } from '../models/manufacturer.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  private baseUrl = 'http://localhost:8091/api/manufacturer';

  constructor(private httpClient: HttpClient) {}

  // ================= CREATE =================
  create(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.httpClient.post<Manufacturer>(
      this.baseUrl,
      manufacturer
    );
  }

  // ================= GET ALL =================
  getAll(): Observable<Manufacturer[]> {
    console.log('ManufacturerService: Fetching all manufacturers');
    
    return this.httpClient.get<Manufacturer[]>(this.baseUrl);
  }

  // ================= GET BY ID =================
  getById(id: number): Observable<Manufacturer> {
    return this.httpClient.get<Manufacturer>(
      `${this.baseUrl}/id/${id}`
    );
  }

  // ================= GET BY NAME =================
  getByName(name: string): Observable<Manufacturer> {
    return this.httpClient.get<Manufacturer>(
      `${this.baseUrl}/name/${name}`
    );
  }

  // ================= SEARCH =================
  search(mfgName: string): Observable<Manufacturer[]> {
    return this.httpClient.get<Manufacturer[]>(
      `${this.baseUrl}/search/${mfgName}`
    );
  }

  // ================= DELETE =================
  delete(id: number): Observable<string> {
    return this.httpClient.delete(
      `${this.baseUrl}/${id}`,
      { responseType: 'text' }
    );
  }
}