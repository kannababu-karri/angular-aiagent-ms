import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegulatoryComplianceService } from "../../../services/regulatory.compliance.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-rc-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rc-process.html'
})

export class RcProcessComponent implements OnInit {

    constructor(private regulatoryComplianceService: RegulatoryComplianceService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    aiAgentResponse: any = null;
    batchId: any = null;

    rcProcessForm!: FormGroup;

    errorMessages: string[] = [];
    successMessage: string = '';

    selectedFile!: File;

    isProcessing = false;

    ngOnInit(): void {
        this.rcProcessForm  = this.fb.group({
            batchNo: ['', Validators.required],
            productName: ['', Validators.required],  
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
    
    jsProcessSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }
    rcProcessSubmit(): void {

        if (this.isProcessing) {
            return; // prevent multiple clicks
        }

        console.log('Submitting regulatory compliance process form');
        // Check file

        const formValidationResult = this.validateForm();
        console.log('Form validation result:', formValidationResult);

        if (formValidationResult === false) {
            this.rcProcessForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }

        const formData = new FormData();
        // Add form values
        formData.append('batchNo', this.rcProcessForm.get('batchNo')?.value);
        formData.append('productName', this.rcProcessForm.get('productName')?.value);

        console.log('Form values appended to FormData:', {
            batchNo: this.rcProcessForm.get('batchNo')?.value,
            productName: this.rcProcessForm.get('productName')?.value
        }); 

        console.log('After Selected file:', this.selectedFile);

        // Add file
        if (this.selectedFile) {
            formData.append('file', this.selectedFile);
        } else {
            this.errorMessages.push('Upload File is required.');
            return;
        }

        console.log('Form data prepared for submission:', formData);
        
        this.isProcessing = true;

        this.regulatoryComplianceService.uploadBatchRecord(formData).subscribe({
            next: (response) => {
                console.log('Compliance process response:', response);
                
                this.batchId = response.batchId;
                this.aiAgentResponse = response.report.replace(/\n/g, '<br/>');

                console.log('Compliance process batchId:', this.batchId);
                console.log('Compliance process aiAgentResponse:', this.aiAgentResponse);

                this.successMessage = 'File details are added successfully and compliance details are displayed!';

                this.errorMessages = [];

                this.isProcessing = false; // done processing

                this.cd.detectChanges();

                this.router.navigate(['/regulatorycompliance/rc-process']);
            },
            error: (err) => {
                console.error('Error processing compliance:', err);
                // Handle validation or custom backend errors
                if (err.status === 400 && err.error) {
                    this.errorMessages = [err.error]; // put backend message in array
                } else {
                    this.errorMessages = ['Error processing compliance. Please try again.'];
                }
                this.successMessage = '';
                this.isProcessing = false; // done processing
                this.cd.detectChanges();

            }
        });
    }

    validateForm(): boolean {
        this.rcProcessForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (this.rcProcessForm.get('batchNo')?.invalid) {
            this.errorMessages.push('Batch No is required.');
        }
        if (this.rcProcessForm.get('productName')?.invalid) {
            this.errorMessages.push('Product Name is required.');
        }
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