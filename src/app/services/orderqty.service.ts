import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponseDto } from '../models/pageresponsedto.model';
import { Orderqty } from '../models/orderqty.model';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth.service';
import { Orderdocument } from '../models/orderdocument.model';

@Injectable({
  providedIn: 'root'
})

export class OrderqtyService {
    private baseUrl = `${environment.apiOrderqty}`;

    constructor(private httpClient: HttpClient,
                private authService: AuthService
                ) {}

    create(orderqty: Orderqty): Observable<Orderqty> {
        return this.httpClient.post<Orderqty>(
            this.baseUrl,
            orderqty,
            {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.authService.getToken() // Assuming you have an authService to get the token
                })
            }
        );
    }

    update(orderqty: Orderqty): Observable<Orderqty> {
        return this.httpClient.put<Orderqty>(`${this.baseUrl}/${orderqty.orderId}`, orderqty);
    }

    delete(id: number): Observable<string> {
      return this.httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }

    getAll(page: number = 0, size: number = 5): Observable<PageResponseDto<Orderqty>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        return this.httpClient.get<PageResponseDto<Orderqty>>(this.baseUrl, { params });
    }

    // ================= GET PRODUCT BY ID =================
    getByOrderId(id: number): Observable<Orderqty> {
        return this.httpClient.get<Orderqty>(`${this.baseUrl}/orderid/${id}`);
    }

    search(manufacturerId : number, 
          productId: number, 
          userId: number, 
          page: number = 0, 
          size: number = 5): Observable<PageResponseDto<Orderqty>> {
        const params = new HttpParams()
          .set('manufacturerId', manufacturerId || 0)
          .set('productId', productId || 0)
          .set('userId', userId || 0)
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Orderqty>>(`${this.baseUrl}/search`, { params });
    } 

    searchmongo(manufacturerId: number, 
          productId: number, 
          userId: number, 
          page: number = 0, 
          size: number = 5): Observable<PageResponseDto<Orderdocument>> {
        const params = new HttpParams()
          .set('manufacturerId', manufacturerId || 0)
          .set('productId', productId || 0)
          .set('userId', userId || 0)
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Orderdocument>>(`${this.baseUrl}/searchmongo`, { params });
    }
}
