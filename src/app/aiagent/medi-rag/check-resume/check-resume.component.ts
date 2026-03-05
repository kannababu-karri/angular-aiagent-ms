import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MediRagService } from "../../../services/medi.rag.service";


@Component({
  selector: 'app-check-resume',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-resume.html'
})

export class CheckResumeComponent implements OnInit {

    constructor(private mediRagService: MediRagService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    checkResumeForm!: FormGroup;

    errorMessages: string[] = [];
    successMessage: string = '';

    selectedFile!: File;

    isProcessing = false;
    jobDescription: string = '';

    aiAgentReason: any = null;
    match: any = null;

    ngOnInit(): void {
        this.checkResumeForm  = this.fb.group({
            file: ['', Validators.required],
            jobDescription: ['', Validators.required]
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
    
    jsCheckResumeSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    checkResumeSubmit(): void {
        if (this.isProcessing) {
            return; // prevent multiple clicks
        }

        console.log('Submitting check resume form');
        // Check file

        const formValidationResult = this.validateForm();
        console.log('Form validation result:', formValidationResult);

        if (formValidationResult === false) {
            this.checkResumeForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }

        const formData = new FormData();

        console.log('After Selected file:', this.selectedFile);

        // Add file
        if (this.selectedFile) {
            formData.append('resumeFile', this.selectedFile);

            const jobDescription = this.checkResumeForm.value.jobDescription;
            console.log('Form data jobDescription:', jobDescription);
            formData.append('jobDescription',jobDescription)   
        } else {
            this.errorMessages.push('Upload File is required.');
            return;
        }

        console.log('Form data prepared for submission:', formData);
        
        this.isProcessing = true;

        this.mediRagService.checkResume(formData).subscribe({
            next: (checkResume) => {
                console.log('Compliance process response:', checkResume);
                
                this.match = checkResume.match;
                this.aiAgentReason = checkResume.reason;

                console.log('Check resume ai agent match:', this.match);
                console.log('Check resume ai agent reason:', this.aiAgentReason);

                this.successMessage = 'Resume successfully analyzed. Results are displayed below.';

                this.errorMessages = [];

                this.isProcessing = false; // done processing

                this.cd.detectChanges();

                this.router.navigate(['/medirag/check-resume']);
            },
            error: (err) => {
                console.error('Error processing medirag:', err);
                // Handle validation or custom backend errors
                if (err.status === 400 && err.error) {
                    this.errorMessages = [err.error]; // put backend message in array
                } else {
                    this.errorMessages = ['Error processing check resume. Please try again.'];
                }
                this.successMessage = '';
                this.isProcessing = false; // done processing
                this.cd.detectChanges();

            }
        });
    }

    validateForm(): boolean {
        this.checkResumeForm.markAllAsTouched();

        this.errorMessages = []; // Clear previous errors

        if (!this.selectedFile) {
            this.errorMessages.push('Upload File is required.');
        }
        if (this.checkResumeForm.get('jobDescription')?.invalid) {
            this.errorMessages.push('Job Description is required.');
        }

        console.log('Form validation errors:', this.errorMessages);

        if (this.errorMessages.length > 0) {
            return false;
        }
        return true; 
    }
}