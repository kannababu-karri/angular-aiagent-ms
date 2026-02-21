import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponseDto } from '../models/pageresponsedto.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    private baseUrl = `${environment.apiProduct}`;

    constructor(private httpClient: HttpClient,
                private authService: AuthService
                ) {}

    create(product: Product): Observable<Product> {
        return this.httpClient.post<Product>(
            this.baseUrl,
            product,
            {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.authService.getToken() // Assuming you have an authService to get the token
                })
            }
        );
    }

    update(product: Product): Observable<Product> {
        return this.httpClient.put<Product>(`${this.baseUrl}/${product.productId}`, product);
    }

    delete(id: number): Observable<string> {
      return this.httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }

    getAll(page: number = 0, size: number = 5): Observable<PageResponseDto<Product>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        return this.httpClient.get<PageResponseDto<Product>>(this.baseUrl, { params });
    }

    // ================= GET PRODUCT BY ID =================
    getById(id: number): Observable<Product> {
        return this.httpClient.get<Product>(`${this.baseUrl}/id/${id}`);
    }

    // ================= GET BY PRODUCT NAME =================
    getByName(name: string): Observable<Product> {
        return this.httpClient.get<Product>(`${this.baseUrl}/name/${encodeURIComponent(name)}`);
    }

    searchByProductName(productName: string = '', page: number = 0, size: number = 5): Observable<PageResponseDto<Product>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Product>>(`${this.baseUrl}/search/productName/${encodeURIComponent(productName)}`, { params });
    }

    searchByDescription(productDescription: string = '', page: number = 0, size: number = 5): Observable<PageResponseDto<Product>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Product>>(`${this.baseUrl}/search/description/${encodeURIComponent(productDescription)}`, { params });
    }

    searchByCasNumber(casNumber: string = '', page: number = 0, size: number = 5): Observable<PageResponseDto<Product>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Product>>(`${this.baseUrl}/search/cas/${encodeURIComponent(casNumber)}`, { params });
    }

    search(productName: string = '', 
          productDescription: string = '', 
          casNumber: string = '', 
          page: number = 0, 
          size: number = 5): Observable<PageResponseDto<Product>> {
        const params = new HttpParams()
          .set('name', productName.trim() || '')
          .set('description', productDescription.trim() || '')
          .set('casNumber', casNumber.trim() || '')
          .set('page', page.toString())
          .set('size', size.toString());

        return this.httpClient.get<PageResponseDto<Product>>(`${this.baseUrl}/search`, { params });
    }








}
