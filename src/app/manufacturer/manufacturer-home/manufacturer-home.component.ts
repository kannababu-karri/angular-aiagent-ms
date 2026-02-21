import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ManufacturerService } from '../../services/manufacturer.service';
import { Manufacturer } from '../../models/manufacturer.model';
import { AuthService } from '../../services/auth.service';
import { PageResponseDto } from '../../models/pageresponsedto.model';

@Component({
    selector: 'app-manufacturer-home',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manufacturer-home.html'
})


export class ManufacturerHomeComponent implements OnInit {
    // This component serves as the home page for the manufacturer section of the application.
    // It can include links to other manufacturer-related components. The template can be designed to provide a user-friendly
    // interface for manufacturers to navigate through their dashboard and access various features.
 
    manufacturers: Manufacturer[] = [];

    totalPages = 0;
    totalElements = 0;
    pageNumber = 0;
    pageSize = 5;

    isAdminUser = false;

    manufacturerForm!: FormGroup;

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private mfgService: ManufacturerService,
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

        this.manufacturerForm = this.fb.group({
            mfgName: ['']
        });

        this.loadManufacturers();
    }

    loadManufacturers(page: number = 0) {
        this.pageNumber = page;
        this.mfgService.getAll(page, this.pageSize).subscribe({
            next: (data: PageResponseDto<Manufacturer>) => {
                this.manufacturers = data.content || [];
                this.totalPages = data.totalPages;
                this.totalElements = data.totalElements;
                this.pageNumber = data.pageNumber;
                this.pageSize = data.pageSize;

                this.cd.detectChanges(); 

                console.log('loadManufacturers manufacturers:', this.manufacturers);
            },
            error: () => console.error('Failed to load manufacturers...')
        }); 
    }

    searchManufacturer(page: number = 0): void {
        this.pageNumber = page;
        const mfgName = this.manufacturerForm.value.mfgName;
        console.log('Searching for manufacturer:', mfgName);

        this.mfgService.search(mfgName, page, this.pageSize).subscribe({
            next: (data: PageResponseDto<Manufacturer>) => {
                this.manufacturers = data.content || [];
                this.totalPages = data.totalPages;
                this.totalElements = data.totalElements;
                this.pageNumber = data.pageNumber;
                this.pageSize = data.pageSize;
                
                this.cd.detectChanges(); 

                console.log('searchManufacturer manufacturers:', this.manufacturers);
            },
            error: () => console.error('Failed to search manufacturers...')
        }); 
    }

    //Navigation for pagination
    nextPage() {
        if (this.pageNumber + 1 < this.totalPages) {
          const mfgName = this.manufacturerForm.value.mfgName;
          console.log('nextPage mfgName:', mfgName);

          if (mfgName && mfgName.trim() !== '') {
              this.searchManufacturer(this.pageNumber + 1);
          } else {  
              this.loadManufacturers(this.pageNumber + 1);
          }
        }
    }

    previousPage() {
        if (this.pageNumber > 0) {
          const mfgName = this.manufacturerForm.value.mfgName;
          console.log('nextPage mfgName:', mfgName);

          if (mfgName && mfgName.trim() !== '') {
              this.searchManufacturer(this.pageNumber - 1);
          } else {  
              this.loadManufacturers(this.pageNumber - 1);
          }
        }
    }

    addManufacturer(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    updateManufacturer(id: number) {
        this.router.navigate(['/manufacturer/update', id]);
    }

    deleteManufacturer(id: number) {
        this.router.navigate(['/manufacturer/delete', id]);
    }
}
