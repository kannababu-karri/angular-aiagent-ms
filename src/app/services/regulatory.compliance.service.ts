import { Inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageResponseDto } from "../models/pageresponsedto.model";
import { RCComplianceResultsDto } from "../models/rc.compliance.results.dto.model";
import { BatchRecords } from "../models/batchrecords.model";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class RegulatoryComplianceService {

    private baseUrl = `${environment.apiAiAgent}`;

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) { } 

    batchRecords: BatchRecords = {
        id: 0,
        batchNo: '',
        productName: '',
        uploadedBy: '',
        uploadDate: '',
        status: ''
    };

    getBatchRecords(page: number = 0, size: number = 5): Observable<PageResponseDto<RCComplianceResultsDto>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        return this.httpClient.get<PageResponseDto<RCComplianceResultsDto>>(`${this.baseUrl}/angular-batch-records`, { params });
    }

    uploadBatchRecord(formData: FormData) {

        //Set the batch record status to "Processing" before uploading the file
        const batchNo = formData.get('batchNo') as string;
        const productName = formData.get('productName') as string;
        const userName = this.authService.getUserName();
        const batchRecords = {
            batchNo: batchNo,
            productName: productName,  
            uploadedBy: userName, 
            status: 'Pending'
        };

        formData.append(
            'batchRecords',
            JSON.stringify(batchRecords)
        );

        const token = sessionStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.httpClient.post<{ batchId: number; report: string }>(this.baseUrl + '/upload-batch-process-pdf', formData, { headers });
  }
}