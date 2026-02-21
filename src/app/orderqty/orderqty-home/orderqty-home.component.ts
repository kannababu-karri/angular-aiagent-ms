import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { OrderqtyService } from '../../services/orderqty.service';
import { ManufacturerService } from '../../services/manufacturer.service';
import { ProductService } from '../../services/product.service';
import { Orderqty } from '../../models/orderqty.model';
import { Manufacturer } from '../../models/manufacturer.model';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { PageResponseDto } from '../../models/pageresponsedto.model';

@Component({
  selector: 'app-orderqty-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './orderqty-home.html'
})

export class OrderqtyHomeComponent implements OnInit {

    orderqtys: Orderqty[] = [];
    manufacturers: Manufacturer[] = [];
    products: Product[] = [];

    totalPages = 0;
    totalElements = 0;
    pageNumber = 0;
    pageSize = 5;

    isAdminUser: boolean = false;
    userId: number = 0;

    orderqtyForm!: FormGroup;

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

        this.isAdminUser = this.authService.isAdmin();

        this.userId = this.authService.getUserId();

        console.log('userId:', this.userId);

        this.successMessage = sessionStorage.getItem('successMessage') || '';
        console.log('this.successMessage:', this.successMessage);
        sessionStorage.removeItem('successMessage');

        this.orderqtyForm = this.fb.group({
            manufacturerId: [''],
            productId: ['']
        });

        this.loadOrderqtys();

        this.loadManufacturers(this.pageNumber);
        this.loadProducts(this.pageNumber);  
    }

    loadOrderqtys(page: number = 0) {
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

    searchOrderqty(page: number = 0): void{
        this.processSearchResult(page);  
    }

    resetPagination() {
        this.pageNumber = 0;
        this.pageSize = 5;
        this.totalPages = 0;
        this.totalElements = 0;

        this.orderqtys = [];
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

    addOrderqty(url: string) {
        this.router.navigate([url]);
    }

    updateOrderqty(id: number) {
        this.router.navigate(['/orderqty/update', id]);
    }

    deleteOrderqty(id: number) {
        this.router.navigate(['/orderqty/delete', id]);
    }

    private processSearchResult(page: number) {
        this.pageNumber = page;
        console.log('Processing search result for pageNumber:', this.pageNumber);
        const manufacturerId = this.orderqtyForm.value.manufacturerId   ;
        const productId = this.orderqtyForm.value.productId;

        console.log('Searching for orderqty:', manufacturerId + ", " + productId);

        this.orderqtyService.search(manufacturerId,
            productId,
            this.userId,
            page,
            this.pageSize).subscribe({
                next: (data: PageResponseDto<Orderqty>) => {
                    this.orderqtys = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;

                    this.cd.detectChanges();

                    console.log('Search orderqty results:', this.orderqtys);
                },
                error: (err) => { 
                    console.error('Failed to display search orderqtys result...', err);
                    this.errorMessage = 'Failed to display search orderqtys result...'+ err;
                    this.successMessage = '';
                    this.cd.detectChanges();
                }
            });
    }
}
