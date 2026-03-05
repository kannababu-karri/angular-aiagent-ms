import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MediRagService } from "../../../services/medi.rag.service";


@Component({
  selector: 'app-medirag-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medirag-process.html'
})

export class MediragProcessComponent implements OnInit {

    constructor(private mediRagService: MediRagService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    documentDtos: any[] = [];
    totalFiles: number = 0;
    pageNumber: number = 0;
    pageSize: number = 5;
    
    totalPages: number = 0;
    totalElements: number = 0;
    errorMessages: string[] = [];
    successMessage: string = '';

    aiAgentResponse: any = null;

    mediragProcessForm!: FormGroup;

    selectedFile!: File;

    isProcessing = false;

    ngOnInit(): void {

        this.resetPagination();

        this.mediragProcessForm  = this.fb.group({
            file: ['', Validators.required]
        });

        this.loadMediragAllDocs(this.pageNumber);
    }

     resetPagination() {
        this.pageNumber = 0;
        this.pageSize = 5;
        this.totalPages = 0;
        this.totalElements = 0;

        this.totalFiles = 0;

        this.documentDtos = [];
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

   //Navigation for pagination
    nextPage() {
        console.log('nextPage Current page number:', this.pageNumber);
        if (this.pageNumber + 1 < this.totalPages) {
            this.loadMediragAllDocs(this.pageNumber + 1);
        }
        console.log('nextPage After submit Current page number:', this.pageNumber);
    }

    previousPage() {
        console.log('previousPage Current page number:', this.pageNumber);
        if (this.pageNumber > 0) {
            this.loadMediragAllDocs(this.pageNumber - 1);
        }
        console.log('previousPage after Current page number:', this.pageNumber);
    }

    loadMediragAllDocs(page: number = 0) {
        this.pageNumber = page; 
        this.mediRagService.getMediragAllDocs(page, this.pageSize).subscribe({
            next: (data: any) => {
                this.documentDtos = data.documents || [];    
                this.totalFiles = data.total_files;   

                this.totalPages = data.totalPages;
                this.totalElements = data.totalElements;
                this.pageNumber = data.pageNumber;
                this.pageSize = data.pageSize;
                this.cd.detectChanges();
                console.log('Medirag documents loaded:', this.documentDtos);
            },
            error: (error) => {
                console.error('Error loading medirag documents:', error);       
                this.errorMessages = ['Failed to load medirag documents. Please try again later.', error.message];
                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }

    mediragProcessSubmit(): void {
        if (this.isProcessing) {
            return; // prevent multiple clicks
        }

        console.log('Submitting medirag process form');
        // Check file

        const formValidationResult = this.validateForm();
        console.log('Form validation result:', formValidationResult);

        if (formValidationResult === false) {
            this.mediragProcessForm.markAllAsTouched();
            console.log('Form blocked: invalid');
            return;
        }

        const formData = new FormData();

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

        this.mediRagService.uploadMediragBatchRecord(formData).subscribe({
            next: (response) => {
                console.log('Compliance process response:', response);
                
                this.aiAgentResponse = response.report;
                console.log('Compliance process aiAgentResponse:', this.aiAgentResponse);

                this.successMessage = 'File details are added successfully in the Chroma data base and file store details are displayed!';

                this.errorMessages = [];

                //Retrieve all docsuments to display in the UI
                this.loadMediragAllDocs(this.pageNumber);

                this.isProcessing = false; // done processing

                this.cd.detectChanges();

                this.router.navigate(['/medirag/medirag-process']);
            },
            error: (err) => {
                console.error('Error processing medirag:', err);
                // Handle validation or custom backend errors
                if (err.status === 400 && err.error) {
                    this.errorMessages = [err.error]; // put backend message in array
                } else {
                    this.errorMessages = ['Error processing medirag. Please try again.'];
                }
                this.successMessage = '';
                this.isProcessing = false; // done processing
                this.cd.detectChanges();

            }
        });
    }

    validateForm(): boolean {
        this.mediragProcessForm.markAllAsTouched();

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