import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { OrderqtyService } from '../../services/orderqty.service';
import { ManufacturerService } from '../../services/manufacturer.service';
import { ProductService } from '../../services/product.service';
import { Orderqty } from '../../models/orderqty.model';
import { Manufacturer } from '../../models/manufacturer.model';
import { Product } from '../../models/product.model';
import { PageResponseDto } from '../../models/pageresponsedto.model';

@Component({
    selector: 'app-orderqty-add',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './orderqty-add.html'
})
export class OrderqtyAddComponent implements OnInit {

    constructor(
        private orderqtyService: OrderqtyService,
        private authService: AuthService,
        private mfgService: ManufacturerService,
        private productService: ProductService,
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private cd: ChangeDetectorRef,
      ) { }

    manufacturers: Manufacturer[] = [];
    products: Product[] = [];

    orderqty: Orderqty = {
        orderId: 0,
        manufacturer: {
            manufacturerId: 0,
            mfgName: '' 
        },
        product: {
            productId: 0,   
            productName: '',
            productDescription: '',
            casNumber: ''
        },
        user: {
            userId: 0,
            userName: '',
            role: ''    
        },
        quantity: 0,
        status: 'N',
        documentType: 'SAVE'
    };
    orderqtyForm!: FormGroup;
    successMessage = '';

    errorMessages: string[] = [];

    jsOrderqtySubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    ngOnInit() {
        this.orderqtyForm = this.fb.group({
            manufacturer: this.fb.group({
                manufacturerId: [0, Validators.required]
            }),
            product: this.fb.group({
                productId: [0, Validators.required]
            }),
            quantity: [0, [Validators.required, Validators.min(1)]]
        });

        this.loadManufacturers(0);
        this.loadProducts(0);
    }

    loadManufacturers(page: number = 0) {
        this.mfgService.getAll(page, 500).subscribe({
            next: (data: PageResponseDto<Manufacturer>) => {
                this.manufacturers = data.content || [];

                this.cd.detectChanges(); 

                console.log('loadManufacturers manufacturers:', this.manufacturers);
            },
            error: (err) => { 
                console.error('Failed to load manufacturers...', err);
                this.errorMessages = ['Failed to load manufacturers...'];
                this.errorMessages = ['error:'+ err];
                this.successMessage = '';
                this.cd.detectChanges();
            }
        }); 
    }

    loadProducts(page: number = 0) {
        this.productService.getAll(page, 500).subscribe({
            next: (data: PageResponseDto<Product>) => {
                this.products = data.content || [];
                this.cd.detectChanges();
                console.log('Search all products results:', this.products);
            },
            error: (err) => { 
                console.error('Failed to load products...', err);
                this.errorMessages = ['Failed to load products...'+ err];
                this.errorMessages = ['error:'+ err];
                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }

    saveNewOrderqty(): void { 
        if (this.validateForm() === false) {
            this.orderqtyForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        
        this.orderqty = this.orderqtyForm.value;
        
        const userId = this.authService.getUserId();

        this.orderqty.user = {
            userId: userId
        };
        console.log('Saving new orderqty: ', this.orderqty);

        this.orderqtyService.create(this.orderqty).subscribe({
            next: (data: Orderqty) => {
                console.log('Saved orderqty ID:', data.orderId);
                this.orderqty = data;
                //Show success message after add

                sessionStorage.setItem('successMessage', 'Order added successfully!');

                this.errorMessages = [];

                this.cd.detectChanges();

                this.router.navigate(['/orderqty'], {});
            },
            error: (err) => {
                console.error('Failed to save new order...', err);
                // Handle validation or custom backend errors
                if (err.status === 400 && err.error) {
                    this.errorMessages = [err.error]; // put backend message in array
                } else {
                    this.errorMessages = ['Server error. Please try again later.'];
                }
                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }

    validateForm(): boolean {
        this.orderqtyForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.orderqtyForm.get('manufacturerId')?.invalid) {
            this.errorMessages.push('Select manufacturer name.');
        }
        if (this.orderqtyForm.get('productId')?.invalid) {
            this.errorMessages.push('Select product name.');
        }
        if (this.orderqtyForm.get('quantity')?.invalid) {
            this.errorMessages.push('Quantity is required.');
        }

        if (this.orderqtyForm.invalid || this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
}
