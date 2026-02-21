import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { PageResponseDto } from '../../models/pageresponsedto.model';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-home.html'
})

export class ProductHomeComponent implements OnInit {

    products: Product[] = [];

    totalPages = 0;
    totalElements = 0;
    pageNumber = 0;
    pageSize = 5;

    isAdminUser = false;

    productForm!: FormGroup;

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private productService: ProductService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        console.log('this.authService.isAdmin():', this.authService.isAdmin());

        this.isAdminUser = this.authService.isAdmin();

        this.successMessage = sessionStorage.getItem('successMessage') || '';
        console.log('this.successMessage:', this.successMessage);
        sessionStorage.removeItem('successMessage');

        this.productForm = this.fb.group({
            productName: [''],
            productDescription: [''],
            casNumber: ['']
        });

        this.loadProducts();
    }

    loadProducts(page: number = 0) {
        this.processSearchResult(page); 
    }

    searchProduct(page: number = 0): void{
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

    addProduct(url: string) {
        this.router.navigate([url]);
    }

    updateProduct(id: number) {
        this.router.navigate(['/product/update', id]);
    }

    deleteProduct(id: number) {
        this.router.navigate(['/product/delete', id]);
    }

    private processSearchResult(page: number) {
        this.pageNumber = page;
        console.log('Processing search result for pageNumber:', this.pageNumber);
        const productName = this.productForm.value.productName;
        const productDescription = this.productForm.value.productDescription;
        const casNumber = this.productForm.value.casNumber;

        console.log('Searching for product:', productName + ", " + productDescription + ", " + casNumber);

        if (productName && productName.trim() != '' && 
            productDescription && productDescription.trim() != '' && 
            casNumber && casNumber.trim() != '') {
            this.productService.search(productName,
                productDescription,
                casNumber,
                page,
                this.pageSize).subscribe({
                    next: (data: PageResponseDto<Product>) => {
                        this.products = data.content || [];
                        this.totalPages = data.totalPages;
                        this.totalElements = data.totalElements;
                        this.pageNumber = data.pageNumber;
                        this.pageSize = data.pageSize;

                        this.cd.detectChanges();

                        console.log('Search product results:', this.products);
                    },
                    error: () => console.error('Failed to search products...')
                });
        } else if (productName && productName.trim() != '') {
            this.productService.searchByProductName(productName, page, this.pageSize).subscribe({
                next: (data: PageResponseDto<Product>) => {
                    this.products = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;
                    this.cd.detectChanges();
                    console.log('Search by product name results:', this.products);
                },
                error: () => console.error('Failed to search products by name...')
            });
        } else if (productDescription && productDescription.trim() != '') {
            this.productService.searchByDescription(productDescription, page, this.pageSize).subscribe({
                next: (data: PageResponseDto<Product>) => {
                    this.products = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;
                    this.cd.detectChanges();
                    console.log('Search by product description results:', this.products);
                },
                error: () => console.error('Failed to search products by description...')
            });
        } else if (casNumber && casNumber.trim() != '') {
            this.productService.searchByCasNumber(casNumber, page, this.pageSize).subscribe({
                next: (data: PageResponseDto<Product>) => {
                    this.products = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;
                    this.cd.detectChanges();
                    console.log('Search by CAS number results:', this.products);
                },
                error: () => console.error('Failed to search products by CAS number...')
            });
        } else {
            this.productService.getAll(page, this.pageSize).subscribe({
                next: (data: PageResponseDto<Product>) => {
                    this.products = data.content || [];
                    this.totalPages = data.totalPages;
                    this.totalElements = data.totalElements;
                    this.pageNumber = data.pageNumber;
                    this.pageSize = data.pageSize;
                    this.cd.detectChanges();
                    console.log('Search all products results:', this.products);
                },
                error: () => console.error('Failed to search all products...')
            });
        }
    }
}
