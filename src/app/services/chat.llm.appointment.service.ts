import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, Doctor, Slot, Specialization } from '../models/chat-appointment-message.model';
import { environment } from '../../environments/environment.prod';

export interface ChatRequest {
    message: string;
    patientId: string;
    step: number;
    selectedDate?: string | null;
    specializationId?: number | null;
    doctorId?: string | null;
    slotId?: number | null;
    slotStartTime?: string | null;
    slotEndTime?: string | null;
}

export interface ChatResponse {
    reply: string;               // main message from bot
    message: string;             // optional: used for buttons
    doctors?: Doctor[];          // doctor list
    slots?: Slot[];           // available slots
    data?: any[];                // e.g., specializations
    step?: number;               // optional step update
    selectedDate?: string; // optional date update
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    //private baseUrl = 'http://127.0.0.1:8005/chat'; // Python FastAPI endpoint
    private baseUrl = `${environment.apiLlmChatAppointment}`; // Python FastAPI endpoint

    constructor(private http: HttpClient) { }

    sendMessage(req: ChatRequest): Observable<ChatResponse> {
        const token = localStorage.getItem('jwt');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<ChatResponse>(this.baseUrl, req, { headers });
    }
}