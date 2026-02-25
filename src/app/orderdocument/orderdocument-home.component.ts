import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { OrderqtyService } from '../services/orderqty.service';
import { ManufacturerService } from '../services/manufacturer.service';
import { ProductService } from '../services/product.service';
import { Orderdocument } from '../models/orderdocument.model';
import { Manufacturer } from '../models/manufacturer.model';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { PageResponseDto } from '../models/pageresponsedto.model';

@Component({
  selector: 'app-orderdocument-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './orderdocument-home.html'
})

export class OrderdocumentHomeComponent implements OnInit {
    orderdocuments: Orderdocument[] = [];
    manufacturers: Manufacturer[] = [];
    products: Product[] = [];

    totalPages = 0;
    totalElements = 0;
    pageNumber = 0;
    pageSize = 5;

    isAdminUser: boolean = false;
    userId: number = 0;

    orderdocumentForm!: FormGroup;

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private orderqtyService: OrderqtyService,
        private authService: AuthService,
        private mfgService: ManufacturerService,
        private productService: ProductService,
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.resetPagination();

        this.orderdocumentForm = this.fb.group({
            manufacturerId: [''],
            productId: ['']
        });

        this.loadOrderdocuments();

        this.loadManufacturers(this.pageNumber);
        this.loadProducts(this.pageNumber);  
    }

    resetPagination() {
        this.pageNumber = 0;
        this.pageSize = 5;
        this.totalPages = 0;
        this.totalElements = 0;

        this.orderdocuments = [];
    }

    loadOrderdocuments(page: number = 0) {
        this.processSearchResult(page); 
    }

    loadManufacturers(pageMfg: number = 0) {
        this.mfgService.getAll(pageMfg, 500).subscribe({
            next: (data: PageResponseDto<Manufacturer>) => {
                this.manufacturers = data.content || [];

                this.cd.detectChanges(); 

                console.log('loadManufacturers manufacturers:', this.manufacturers);
            },
            error: (err) => { 
                console.error('Failed to load manufacturers...', err);
                this.errorMessage = 'Failed to load manufacturers...'+ err;
                this.successMessage = '';
                this.cd.detectChanges();
            }
        }); 
    }

    loadProducts(pageProd: number = 0) {
        this.productService.getAll(pageProd, 500).subscribe({
            next: (data: PageResponseDto<Product>) => {
                this.products = data.content || [];
                
                this.cd.detectChanges();
                console.log('Search all products results:', this.products);
            },
            error: (err) => { 
                console.error('Failed to load products...', err);
                this.errorMessage = 'Failed to load products...'+ err;
                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }

    searchOrderdocument(page: number = 0): void{
        this.processSearchResult(page);  
    }

    //Navigation for pagination
    nextPage() {
        console.log('nextPage Current page number:', this.pageNumber);
        if (this.pageNumber + 1 < this.totalPages) {
            this.processSearchResult(this.pageNumber + 1);
        }
        console.log('nextPage After submit Current page number:', this.pageNumber);
    }

    previousPage() {
        console.log('previousPage Current page number:', this.pageNumber);
        if (this.pageNumber > 0) {
            this.processSearchResult(this.pageNumber - 1);
        }
        console.log('previousPage after Current page number:', this.pageNumber);
    }

    jsOrderdocumentSubmit(url: string) {
        this.router.navigate([url]);
    }

    private processSearchResult(page: number) {
        this.pageNumber = page;
        console.log('Processing search result for pageNumber:', this.pageNumber);
        const manufacturerId = this.orderdocumentForm.value.manufacturerId   ;
        const productId = this.orderdocumentForm.value.productId;

        console.log('Searching for orderdocument:', manufacturerId + ", " + productId);

        if(this.authService.isAdmin()) {
            this.userId = 0;
        } else {
            this.userId = this.authService.getUserId();
        }

        console.log('userId:', this.userId);

        this.orderqtyService.searchmongo(manufacturerId,
            productId,
            this.userId,
            page,
            this.pageSize).subscribe({
                next: (data: PageResponseDto<Orderdocument>) => {
                    this.orderdocuments = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;

                    this.cd.detectChanges();

                    console.log('Search orderdocument results:', data);
                },
                error: (err) => { 
                    console.error('Failed to display search orderdocuments result...', err);
                    this.errorMessage = 'Failed to display search orderdocuments result...'+ err;
                    this.successMessage = '';
                    this.cd.detectChanges();
                }
            });
    }
}
