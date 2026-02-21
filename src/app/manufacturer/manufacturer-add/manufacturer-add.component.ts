import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manufacturer } from '../../models/manufacturer.model';

import { ManufacturerService } from '../../services/manufacturer.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-manufacturer-add',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manufacturer-add.html'
})
export class ManufacturerAddComponent implements OnInit {

    constructor(
          private mfgService: ManufacturerService,
          private fb: FormBuilder,
          private router: Router,
          private cd: ChangeDetectorRef
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
            mfgName: ['', Validators.required],
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            zipExt: ['']
        });
    }

    saveNewManufacturer(): void { 
        if (this.validateForm() === false) {
            this.manufacturerForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        this.manufacturer = this.manufacturerForm.value;
        console.log('Saving new manufacturer: ', this.manufacturer);

        this.mfgService.create(this.manufacturer).subscribe({
            next: (data: Manufacturer) => {
                console.log('Saved manufacturer ID:', data.manufacturerId);
                this.manufacturer = data;
                //Show success message after add

                sessionStorage.setItem('successMessage', 'Manufacturer added successfully!');
                
                this.errorMessages = [];

                this.cd.detectChanges();

                this.router.navigate(['/manufacturer'], {});
            },
            error: (err) => {
                console.error('Failed to save new manufacturer...', err);
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
