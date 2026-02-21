import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-delete',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-delete.html'
})
export class ProductDeleteComponent implements OnInit {

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
                 this.product = data;
            },
            error: (err) => {
                this.errorMessages = ['Failed to load product with ID:'+id+' '+err.error]; 
                
                this.cd.detectChanges();
            }
        });
    }

    deleteProduct(): void { 
    
        const productId = this.productForm.value.productId;
        console.log('Delete product: ', productId);

        if (!productId) {
            this.errorMessages = ['Product id is missing:'];
            this.cd.detectChanges();
            return;
        }

        this.productService.delete(productId).subscribe({
            next: (res: string) => { 
                sessionStorage.setItem('successMessage', 'Product deleted successfully!');
                this.errorMessages = [];
                //Show success message after update
                this.router.navigate(['/product'], {});
            },
            error: (err) => {
                console.error('Failed to delete product...', err);

                if (err.status === 404 && err.error?.message) {
                    this.errorMessages = [err.error.message];
                } else {
                    this.errorMessages = ['Failed to delete product: ' + (err.error?.message || 'Unexpected error')];
                }

                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }
}
