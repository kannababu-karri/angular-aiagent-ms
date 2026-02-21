import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Orderqty } from '../../models/orderqty.model';
import { OrderqtyService } from '../../services/orderqty.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-orderqty-update',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './orderqty-update.html'
})
export class OrderqtyUpdateComponent implements OnInit {

    constructor(
          private orderqtyService: OrderqtyService,
          private authService: AuthService,
          private fb: FormBuilder,
          private router: Router,
          private cd: ChangeDetectorRef,
          private route: ActivatedRoute
      ) { }

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
            orderId: [''],
            quantity: ['', Validators.required]
        });

        // Get ID from route and load manufacturer
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadOrderqty(id);
        } else {
            console.warn('No order ID provided in navigation state.');
        }
    }

   loadOrderqty(id: number): void {
        this.orderqtyService.getByOrderId(id).subscribe({
            next: (data: Orderqty) => {
                this.orderqtyForm.patchValue(data);
                this.orderqty = data;
            },
            error: (err) => {
                this.errorMessages = ['Failed to load order with ID:'+id+' '+err.error]; 
                
                this.cd.detectChanges();
            }
        });
    }

    updateOrderqty(): void { 
        if (this.validateForm() === false) {
            this.orderqtyForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        const updatedOrderqty = this.orderqtyForm.value;
        console.log('Update order: ', updatedOrderqty);

        const user = this.authService.getUser();

        console.log('user details:', user);

        if (!user) {
            console.error('User not logged in or user details are missing.');
            this.errorMessages = ['User not logged in or user details are missing.'];
            return;
        }

        updatedOrderqty.user = user;

        updatedOrderqty.manufacturer = this.orderqty.manufacturer;

        updatedOrderqty.product = this.orderqty.product;

        this.orderqtyService.update(updatedOrderqty).subscribe({
            next: (data: Orderqty) => {
                console.log('Order updated:', updatedOrderqty.orderId);
                this.orderqty = data;

                sessionStorage.setItem('successMessage', 'Order updated successfully!');

                this.errorMessages = [];

                //Show success message after update
                this.router.navigate(['/orderqty'], {});
            },
            error: (err) => {
                this.errorMessages = ['Failed to update order...:'+err.error.message]; 
                
                this.cd.detectChanges();
            }
        });
    }

    validateForm(): boolean {
        this.orderqtyForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.orderqtyForm.get('quantity')?.invalid) {
            this.errorMessages.push('Quantity is required.');
        } else if (this.orderqtyForm.get('quantity')?.value <= 0) {
            this.errorMessages.push('Quantity must be greater than zero.');
        }

        if (this.orderqtyForm.invalid || this.errorMessages.length > 0) {
            return false;
        }
        
        return true; 
    }
}
