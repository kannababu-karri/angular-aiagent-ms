import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manufacturer } from '../../models/manufacturer.model';

import { ManufacturerService } from '../../services/manufacturer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-manufacturer-delete',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manufacturer-delete.html'
})
export class ManufacturerDeleteComponent implements OnInit {
    constructor(
          private mfgService: ManufacturerService,
          private fb: FormBuilder,
          private router: Router,
          private route: ActivatedRoute,
          private cd: ChangeDetectorRef,
      ) { }

    manufacturer: Manufacturer = {
        manufacturerId: 0,
        mfgName: '',    
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        zipExt: ''
    };

    manufacturerForm!: FormGroup;

    successMessage = '';

    errorMessages: string[] = [];

    jsManufacturerSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    ngOnInit() {
        this.manufacturerForm = this.fb.group({
            manufacturerId: [''],
            mfgName: ['', Validators.required],
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            zipExt: ['']
        });

        // Get ID from route and load manufacturer
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadManufacturer(id);
        } else {
            console.warn('No manufacturer ID provided in navigation state');
        }
    }

    loadManufacturer(id: number): void {
        this.mfgService.getById(id).subscribe({
            next: (data: Manufacturer) => {
                this.manufacturerForm.patchValue(data); 
                this.manufacturer = data; // Store the loaded manufacturer for display
            },
            error: (err) => {
                this.errorMessages = ['Failed to load manufacturer with ID:'+id+' '+err.error]; 
                
                this.cd.detectChanges();
            }
        });
    }

    deleteManufacturer(): void { 
        const manufacturerId = this.manufacturerForm.value.manufacturerId;
        console.log('Delete manufacturerId: ', manufacturerId);

        if (!manufacturerId) {
            console.error('ID missing!');
            return;
        }

        this.mfgService.delete(manufacturerId).subscribe({
            next: () => { 
                sessionStorage.setItem('successMessage', 'Manufacturer deleted successfully!');

                //Show success message after update
                this.router.navigate(['/manufacturer'], {});
            },
            error: (err) => {
                console.error('Failed to delete manufacturer...', err);
            }
        });
    }
}
