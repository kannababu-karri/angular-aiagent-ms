import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';


import { ManufacturerService } from '../../../services/manufacturer.service';
import { Manufacturer } from '../../../models/manufacturer.model';
import { AuthService } from '../../../services/auth.service';

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

  manufacturerForm!: FormGroup;

  errorMessage = '';
  successMessage = '';

  baseUrlAdd = '/manufacturer/displayNewManufacturer';
  baseUrlReturn = '/manufacturer/returnILHome';

  userRole = 'admin';

  constructor(
      private mfgService: ManufacturerService,
      private authService: AuthService,
      private fb: FormBuilder,
      private router: Router,
      private http: HttpClient
    ) { 
      const token = authService.getToken();
      console.log('JWT Interceptor: Manufacturer home', token);
    }

   ngOnInit(): void {
    this.manufacturerForm = this.fb.group({
      mfgName: ['']
    });
    this.loadAll();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadAll() {
    this.mfgService.getAll().subscribe({
      next: data => this.manufacturers = data,
      error: () => this.errorMessage = 'Failed to load manufacturers'
    });
  }

  onSubmit() {

    const name = this.manufacturerForm.value.mfgName;

    if (!name) {
      this.loadAll();
      return;
    }

    this.mfgService.search(name).subscribe({
      next: data => this.manufacturers = data,
      error: () => this.errorMessage = 'Search failed'
    });
  }

  jsManufacturerSubmit(url: string): void {
    console.log('Navigating to:', url);
    this.router.navigate([url]);
  }

  searchManufacturer(): void {
    const name = this.manufacturerForm.value.mfgName;
    console.log('Searching for manufacturer:', name);
    // Call service to search manufacturers
    this.mfgService.search(name).subscribe({
      next: data => this.manufacturers = data,
      error: () => this.errorMessage = 'Search failed'
    });
  }

  goAdd() {
    this.router.navigate(['/manufacturer/add']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  updateManufacturer(id: number) {
    this.router.navigate(['/manufacturer/update', id]);
  }

  deleteManufacturer(id: number) {

    if (!confirm('Delete?')) return;

    this.mfgService.delete(id).subscribe({
      next: msg => {
        this.successMessage = msg;
        this.loadAll();
      }
    });
  }
}
