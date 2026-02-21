import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Orderqty } from '../../models/orderqty.model';
import { OrderqtyService } from '../../services/orderqty.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-orderqty-delete',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './orderqty-delete.html'
})
export class OrderqtyDeleteComponent implements OnInit {

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

    deleteOrderqty(): void { 
    
        const orderId = this.orderqtyForm.value.orderId;
        console.log('Delete order: ', orderId);

        if (!orderId) {
            this.errorMessages = ['Order id is missing:'];
            this.cd.detectChanges();
            return;
        }

        this.orderqtyService.delete(orderId).subscribe({
            next: (res: string) => { 
                sessionStorage.setItem('successMessage', 'Order deleted successfully!');
                this.errorMessages = [];
                //Show success message after update
                this.router.navigate(['/orderqty'], {});
            },
            error: (err) => {
                console.error('Failed to delete order...', err);

                if (err.status === 404 && err.error?.message) {
                    this.errorMessages = [err.error.message];
                } else {
                    this.errorMessages = ['Failed to delete order: ' + (err.error?.message || 'Unexpected error')];
                }

                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }
}
