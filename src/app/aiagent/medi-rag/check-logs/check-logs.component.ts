import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MediRagService } from "../../../services/medi.rag.service";
import { CheckLogs } from "../../../models/check-logs.model";


@Component({
  selector: 'app-check-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-logs.html'
})

export class CheckLogsComponent implements OnInit {

    constructor(private mediRagService: MediRagService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    checkLogsForm!: FormGroup;

    checkLogs: CheckLogs = {
        severity: '',
        affectedComponent: '',
        rootCauses: [],
        solutions: [],
        fixCommands: [],
        confidenceScore: 0
    };

    errorMessages: string[] = [];
    successMessage: string = '';

    selectedFile!: File;

    isProcessing = false;

    ngOnInit(): void {
        this.checkLogsForm  = this.fb.group({
            file: ['', Validators.required]
        });
    }

     // Called when file selected
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file instanceof File) {
            this.selectedFile = file;
        } else {
            this.selectedFile = null as any;    
        }

        console.log('Selected file:', this.selectedFile);
    }
    
    jsCheckLogsSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    checkLogsSubmit(): void {
        if (this.isProcessing) {
            return; // prevent multiple clicks
        }

        console.log('Submitting check logs form');
        // Check file

        const formValidationResult = this.validateForm();
        console.log('Form validation result:', formValidationResult);

        if (formValidationResult === false) {
            this.checkLogsForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }

        const formData = new FormData();

        console.log('After Selected file:', this.selectedFile);

        // Add file
        if (this.selectedFile) {
            formData.append('logFile', this.selectedFile);
        } else {
            this.errorMessages.push('Upload File is required.');
            return;
        }

        console.log('Form data prepared for submission:', formData);
        
        this.isProcessing = true;

        this.mediRagService.checkLogs(formData).subscribe({
            next: (checkLogs) => {
                console.log('Logs process response:', checkLogs);
                
                this.checkLogs = checkLogs;

                console.log('Check logs ai agent response:', this.checkLogs);

                this.successMessage = 'Log successfully analyzed. Log analysis results are.....';

                this.errorMessages = [];

                this.isProcessing = false; // done processing

                this.cd.detectChanges();

                this.router.navigate(['/medirag/check-logs']);
            },
            error: (err) => {
                console.error('Error processing medirag:', err);
                // Handle validation or custom backend errors
                if (err.status === 400 && err.error) {
                    this.errorMessages = [err.error]; // put backend message in array
                } else {
                    this.errorMessages = ['Error processing check logs. Please try again.'];
                }
                this.successMessage = '';
                this.isProcessing = false; // done processing
                this.cd.detectChanges();

            }
        });
    }

    validateForm(): boolean {
        this.checkLogsForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (!this.selectedFile) {
            this.errorMessages.push('Upload File is required.');
        }

        console.log('Form validation errors:', this.errorMessages);

        if (this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
}