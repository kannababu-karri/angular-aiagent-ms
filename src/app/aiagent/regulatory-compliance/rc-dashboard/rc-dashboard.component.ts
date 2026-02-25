import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RegulatoryComplianceService } from "../../../services/regulatory.compliance.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { RCComplianceResultsDto } from "../../../models/rc.compliance.results.dto.model";


@Component({
  selector: 'app-rc-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rc-dashboard.html'
})

export class RCDashboardComponent implements OnInit {

    rcComplianceResultsDtos: RCComplianceResultsDto[] = [];

    constructor(private regulatoryComplianceService: RegulatoryComplianceService,
                private fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                private cd: ChangeDetectorRef
    ) { }

    pageNumber = 0;
    pageSize = 5;   
    totalPages = 0;
    totalElements = 0;

    dashboardForm!: FormGroup;

    errorMessages: string[] = [];
    successMessage: string = '';

    ngOnInit(): void {

        this.resetPagination();

        this.dashboardForm = this.fb.group({
           
        });

        this.loadBatchRecords(this.pageNumber);
    }

    resetPagination() {
        this.pageNumber = 0;
        this.pageSize = 5;
        this.totalPages = 0;
        this.totalElements = 0;

        this.rcComplianceResultsDtos = [];
    }

    loadBatchRecords(page: number = 0) {
        this.pageNumber = page; 
        this.regulatoryComplianceService.getBatchRecords(page, this.pageSize).subscribe({
            next: (data: any) => {
                this.rcComplianceResultsDtos = data.content || [];      
                this.totalPages = data.totalPages;
                this.totalElements = data.totalElements;
                this.pageNumber = data.pageNumber;
                this.pageSize = data.pageSize;
                this.cd.detectChanges();
                console.log('Compliance results loaded:', this.rcComplianceResultsDtos);
            },
            error: (error) => {
                console.error('Error loading batch records:', error);       
                this.errorMessages = ['Failed to load batch records. Please try again later.', error.message];
                this.successMessage = '';
                this.cd.detectChanges();
            }
        });
    }

     jsDashboardSubmit(url: string) {
        this.router.navigate([url]);
    }  

    searchDashboardSubmit() {
        this.loadBatchRecords(this.pageNumber);
    }

    //Navigation for pagination
    nextPage() {
        console.log('nextPage Current page number:', this.pageNumber);
        if (this.pageNumber + 1 < this.totalPages) {
            this.loadBatchRecords(this.pageNumber + 1);
        }
        console.log('nextPage After submit Current page number:', this.pageNumber);
    }

    previousPage() {
        console.log('previousPage Current page number:', this.pageNumber);
        if (this.pageNumber > 0) {
            this.loadBatchRecords(this.pageNumber - 1);
        }
        console.log('previousPage after Current page number:', this.pageNumber);
    }
}