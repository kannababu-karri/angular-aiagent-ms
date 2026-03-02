import { Inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageResponseDto } from "../models/pageresponsedto.model";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { DocumentDto } from "../models/documentdto.model";
import { RagResponse } from "../models/rag-response.model";

@Injectable({
    providedIn: 'root'
})

export class MediRagService {

    private baseUrl = `${environment.apiAiAgent}`;

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) { } 

    documentDto: DocumentDto = {
       content: '',
       metadata: new Map<string, any>()
    };

    getMediragAllDocs(page: number = 0, size: number = 5): Observable<PageResponseDto<DocumentDto>> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
        
        const token = sessionStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        
        return this.httpClient.get<PageResponseDto<DocumentDto>>(`${this.baseUrl}/medirag-all-docs`, { params });
    }

    uploadMediragBatchRecord(formData: FormData) {

        const token = sessionStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.httpClient.post<{ report: string }>(this.baseUrl + '/upload-medirag-pdf', formData, { headers });
    }

   askQuestion(question: string) {
        const body = {
            query: question
        };

        const token = sessionStorage.getItem('token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });


        return this.httpClient.post<RagResponse>(
            this.baseUrl + '/ask-medireg-question',
            body,
            {
                headers: headers
            }
        );
    }
}