import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-update',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-update.html'
})
export class ProductUpdateComponent implements OnInit {

    constructor(
          private productService: ProductService,
          private fb: FormBuilder,
          private router: Router,
          private cd: ChangeDetectorRef,
          private route: ActivatedRoute
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
            productId: [''],
            productName: ['', Validators.required],
            productDescription: ['', Validators.required],
            casNumber: ['', Validators.required]
        });

        // Get ID from route and load manufacturer
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadProduct(id);
        } else {
            console.warn('No product ID provided in navigation state.');
        }
    }

   loadProduct(id: number): void {
        this.productService.getById(id).subscribe({
            next: (data: Product) => {
                this.productForm.patchValue(data);
            },
            error: (err) => {
                this.errorMessages = ['Failed to load product with ID:'+id+' '+err.error]; 
                
                this.cd.detectChanges();
            }
        });
    }

    updateProduct(): void { 
        if (this.validateForm() === false) {
            this.productForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        const updatedProduct = this.productForm.value;
        console.log('Update product: ', updatedProduct);

        this.productService.update(updatedProduct).subscribe({
            next: (data: Product) => {
                console.log('Product updated:', updatedProduct.productId);
                this.product = data;

                sessionStorage.setItem('successMessage', 'Product updated successfully!');

                this.errorMessages = [];

                //Show success message after update
                this.router.navigate(['/product'], {});
            },
            error: (err) => {
                this.errorMessages = ['Failed to update product...:'+err.error]; 
                
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
