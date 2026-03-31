import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ManufacturerService } from '../services/manufacturer.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-manufacturer-circuit-breaker',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './circuit-breaker.html'
})


export class CircuitBreakerComponent implements OnInit {
    logs: string[] = [];

    manufacturerForm!: FormGroup;

    errorMessage: string = '';
    successMessage: string = '';

    isProcessing = false;

    constructor(private mfgService: ManufacturerService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private cd: ChangeDetectorRef) {}

    loginHome(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    ngOnInit(): void {

        this.successMessage = sessionStorage.getItem('successMessage') || '';
        console.log('this.successMessage:', this.successMessage);
        sessionStorage.removeItem('successMessage');

        this.manufacturerForm = new FormGroup({
        });
    }

    loadCircuitBreakerLogs() {

        if (this.isProcessing) {
            return; // prevent multiple clicks
        }
        
        this.isProcessing = true;
        
        this.mfgService.getCircuitBreakerLogs().subscribe({
            next: (response) => {
                this.logs = response;
                console.log('Circuit Breaker Logs:', this.logs);
                this.successMessage = 'Circuit breaker event logs retrieved successfully!';
                this.errorMessage = '';
                this.isProcessing = false;
                this.cd.detectChanges(); 
            },
            error: () => {
                this.errorMessage = 'Failed to get circuit breaker event logs...';
                this.successMessage = '';
                this.isProcessing = false;
                this.cd.detectChanges();
            }
        }); 
    }
}
