import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponseDto } from '../models/pageresponsedto.model';
import { Manufacturer } from '../models/manufacturer.model';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ManufacturerService {
    private baseUrl = `${environment.apiManufacturer}`;

    constructor(private httpClient: HttpClient,
                private authService: AuthService
                ) {}

    getAll(page: number = 0, size: number = 5): Observable<PageResponseDto<Manufacturer>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        return this.httpClient.get<PageResponseDto<Manufacturer>>(this.baseUrl, { params });
    }

    search(mfgName: string = '', page: number = 0, size: number = 5): Observable<PageResponseDto<Manufacturer>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        const url = mfgName ? `${this.baseUrl}/search/${encodeURIComponent(mfgName)}` : `${this.baseUrl}/search`;
        return this.httpClient.get<PageResponseDto<Manufacturer>>(url, { params });
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

    create(manufacturer: Manufacturer): Observable<Manufacturer> {
        return this.httpClient.post<Manufacturer>(
            this.baseUrl,
            manufacturer,
            {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.authService.getToken() // Assuming you have an authService to get the token
                })
            }
        );
    }

    update(manufacturer: Manufacturer): Observable<Manufacturer> {
        return this.httpClient.put<Manufacturer>(`${this.baseUrl}/${manufacturer.manufacturerId}`, manufacturer);
    }

    delete(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }
}
