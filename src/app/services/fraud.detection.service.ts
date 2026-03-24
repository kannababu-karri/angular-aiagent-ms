import { Inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { FraudTransaction } from "../models/fraud.transaction.model";
import { FraudDetectionResponseDto } from "../models/fraud-detection-responsedto.model";

@Injectable({
    providedIn: 'root'
})

export class FraudDetectionService {

    private baseUrl = `${environment.apiAiAgent}`;

    constructor(
        private httpClient: HttpClient
    ) { } 

    fraudDetectionSubmit(fraudTransaction: FraudTransaction) {
        const token = sessionStorage.getItem('token');

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        return this.httpClient.post<FraudDetectionResponseDto>(this.baseUrl + '/fraud-detection', fraudTransaction, { headers });
    }
}