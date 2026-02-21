import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manufacturer } from '../../models/manufacturer.model';

import { ManufacturerService } from '../../services/manufacturer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-manufacturer-update',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manufacturer-update.html'
})
export class ManufacturerUpdateComponent implements OnInit {

    constructor(
          private mfgService: ManufacturerService,
          private fb: FormBuilder,
          private router: Router,
          private route: ActivatedRoute,
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
                this.manufacturerForm.patchValue(data); // fill form
            },
            error: () => console.error('Failed to load manufacturer')
        });
    }

    updateManufacturer(): void { 
        if (this.validateForm() === false) {
            this.manufacturerForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        const updatedManufacturer = this.manufacturerForm.value;
        console.log('Update manufacturer: ', updatedManufacturer);

        this.mfgService.update(updatedManufacturer).subscribe({
            next: (data: Manufacturer) => {
                console.log('Manufacturer updated:', updatedManufacturer.manufacturerId);
                this.manufacturer = data;

                sessionStorage.setItem('successMessage', 'Manufacturer updated successfully!');

                //Show success message after update
                this.router.navigate(['/manufacturer'], {});
            },
            error: (err) => {
                console.error('Failed to update manufacturer...', err);
            }
        });
    }

    validateForm(): boolean {
        this.manufacturerForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.manufacturerForm.get('mfgName')?.invalid) {
            this.errorMessages.push('Manufacturer Name is required.');
        }
        if (this.manufacturerForm.get('address1')?.invalid) {
            this.errorMessages.push('Address1 is required.');
        }
        if (this.manufacturerForm.get('city')?.invalid) {
            this.errorMessages.push('City is required.');
        }
        if (this.manufacturerForm.get('state')?.invalid) {
            this.errorMessages.push('State is required.');
        }
        if (this.manufacturerForm.get('zip')?.invalid) {
            this.errorMessages.push('Zip is required.');
        }

        if (this.manufacturerForm.invalid || this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
}
