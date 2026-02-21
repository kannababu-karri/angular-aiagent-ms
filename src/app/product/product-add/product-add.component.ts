import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-product-add',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-add.html'
})
export class ProductAddComponent implements OnInit {

    constructor(
          private productService: ProductService,
          private fb: FormBuilder,
          private router: Router,
          private cd: ChangeDetectorRef
      ) { }

    product: Product = {
        productId: 0,
        productName: '',    
        productDescription: '',
        casNumber: ''
    };

    productForm!: FormGroup;
    successMessage = '';

    errorMessages: string[] = [];

    jsProductSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    ngOnInit() {
        this.productForm = this.fb.group({
            productName: ['', Validators.required],
            productDescription: ['', Validators.required],
            casNumber: ['', Validators.required]
        });
    }

    saveNewProduct(): void { 
        if (this.validateForm() === false) {
            this.productForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        this.product = this.productForm.value;
        console.log('Saving new product: ', this.product);

        this.productService.create(this.product).subscribe({
            next: (data: Product) => {
                console.log('Saved product ID:', data.productId);
                this.product = data;
                //Show success message after add

                sessionStorage.setItem('successMessage', 'Product added successfully!');

                this.errorMessages = [];

                this.cd.detectChanges();

                this.router.navigate(['/product'], {});
            },
            error: (err) => {
                console.error('Failed to save new product...', err);
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
        this.productForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.productForm.get('productName')?.invalid) {
            this.errorMessages.push('Product Name is required.');
        }
        if (this.productForm.get('productDescription')?.invalid) {
            this.errorMessages.push('Product Description is required.');
        }
        if (this.productForm.get('casNumber')?.invalid) {
            this.errorMessages.push('Cas Number is required.');
        }

        if (this.productForm.invalid || this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
}
