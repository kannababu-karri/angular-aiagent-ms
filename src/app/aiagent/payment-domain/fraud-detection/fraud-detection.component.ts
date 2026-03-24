import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FraudDetectionService } from "../../../services/fraud.detection.service";
import { FraudTransaction } from "../../../models/fraud.transaction.model";


@Component({
    selector: 'app-fraud-detection',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './fraud-detection.html'
})

export class FraudDetectionComponent implements OnInit {

    constructor(private fraudDetectionService: FraudDetectionService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    fraudTransaction: FraudTransaction = {
        transactionDate: '',
        amount: 0,
        merchantID: 0,
        transactionType: '',
        location: ''
    };

    result: any;

    fraudDetectionForm!: FormGroup;

    errorMessages: string[] = [];
    successMessage: string = '';

    selectedFile!: File;

    isProcessing = false;

    ngOnInit(): void {
        this.fraudDetectionForm  = this.fb.group({
            transactionDate: ['', Validators.required],
            amount: ['', Validators.required],  
            merchantID: ['', Validators.required],
            transactionType: ['', Validators.required],
            location: ['', Validators.required]
        });
    }
    
    jsFraudDetectionSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    fraudDetectionSubmit(): void {

        if (this.isProcessing) {
            return; // prevent multiple clicks
        }

        console.log('Submitting fraud detection process form');

        const formValidationResult = this.validateForm();
        console.log('Form validation result:', formValidationResult);

        if (formValidationResult === false) {
            this.fraudDetectionForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }
        
        this.isProcessing = true;

        const rawDate = this.fraudDetectionForm.get('transactionDate')?.value;

        const formattedDate = rawDate
            ? rawDate.replace('T', ' ') + ':00'
            : null;

        const fraudTransaction = {
            transactionDate: formattedDate,
            amount: Number(this.fraudDetectionForm.get('amount')?.value),
            merchantID: this.fraudDetectionForm.get('merchantID')?.value,
            transactionType: this.fraudDetectionForm.get('transactionType')?.value,
            location: this.fraudDetectionForm.get('location')?.value
        };

        this.fraudDetectionService.fraudDetectionSubmit(fraudTransaction).subscribe({
            next: (response) => {
                console.log('API Response:', response);
                this.result = response;
                this.successMessage = 'Fraud analysis completed successfully!';
                this.errorMessages = [];
                this.isProcessing = false;
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Fraud detection error:', err);
                this.errorMessages = ['Error detecting fraud. Please try again.'];
                this.successMessage = '';
                this.isProcessing = false;
                this.cd.detectChanges();
            }
        });
    }

    validateForm(): boolean {
        this.fraudDetectionForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.fraudDetectionForm.get('transactionDate')?.invalid) {
            this.errorMessages.push('Date & Time is required.');
        }
        if (this.fraudDetectionForm.get('amount')?.invalid) {
            this.errorMessages.push('Amount is required.');
        }
        if (this.fraudDetectionForm.get('merchantID')?.invalid) {
            this.errorMessages.push('MerchantID is required.');
        }
        if (this.fraudDetectionForm.get('transactionType')?.invalid) {
            this.errorMessages.push('TransactionType is required.');
        }
        if (this.fraudDetectionForm.get('location')?.invalid) {
            this.errorMessages.push('Location is required.');
        }

        console.log('Form validation errors:', this.errorMessages);

        if (this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
    

}