import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.llm.appointment.service';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-chat-llm-appointment',
    standalone: true,
    imports: [ NgForOf, NgIf, CommonModule, FormsModule],
    templateUrl: './chat.llm.appoint.component.html'
})
export class ChatLlmAppointmentComponent implements OnInit {

    userInput: string = '';
    step: number = 1;

    messages: any[] = [];

    isLoading = false;

    conversationState: any = {
        patientId: '',
        step: 1,
        selectedDate: null,
        specializationId: null,
        doctorId: null,
        slotId: null,
        slotStartTime: null,
        slotEndTime: null
    };

    constructor(private chatService: ChatService,
        private router: Router,
        private authService: AuthService,
        private cd: ChangeDetectorRef
    ) { }

        ngOnInit(): void {
        this.conversationState.patientId = this.authService.isLoggedIn()
        ? this.authService.getUserName()
        : 'GUEST';

        this.addBotMessage('Hello! Let’s LLM schedule your appointment.');
        this.askDate();
    }

    /** Navigation */
    jsChatbotSubmit(url: string): void {
        this.router.navigate([url]);
    }

    /** Ask for date */
    askDate() {
        this.addBotMessage('\nPlease enter appointment date (YYYY-MM-DD).');
        this.conversationState.step = 2;
    }

    // Initialize the chat with welcome message
    startChat() {
        this.messages = [];
        this.conversationState.step = 2;
        this.addBotMessage('Hello! Let’s LLM schedule your appointment.');
        this.addBotMessage('\nPlease enter appointment date (YYYY-MM-DD).');
    }

    sendMessage(fromButton = false, buttonMessage = '', action: 'specialization' | 'doctor' | 'slot' | '' = '') {

        // 🚫 prevent multiple clicks issue
        console.log('sendMessage called. fromButton:', fromButton, 'action:', action, 'isLoading:', this.isLoading);
        if (this.isLoading) {
            return;
        }

        const message = buttonMessage || this.userInput.trim();

        if (!message && !this.conversationState.selectedDate) {
            if (this.conversationState.step === 2) {
                this.addBotMessage('⚠️ Please enter a valid appointment date (YYYY-MM-DD)');
            }
            return;
        }

        if (!fromButton && message) {
            this.addUserMessage(message);
        }

        if (!fromButton && this.conversationState.step === 2 && message) {
            this.conversationState.selectedDate = message;
        }

        const payload = this.buildRequest(message);

        console.log('Sending payload:', payload);

        this.isLoading = true;

        this.chatService.sendMessage(payload)
            .pipe(finalize(() => {
                this.isLoading = false;
                this.cd.detectChanges();
            }))
            .subscribe(res => {
                const nextStep = res.step ?? this.getNextStepFallback(fromButton, action);
                this.step = nextStep;
                this.conversationState.step = nextStep;

                console.log('Response step:', res.step, 'fallback step:', nextStep, 'action:', action);
                this.addBotMessage(res.reply, res.data, res.doctors, res.slots);

                this.userInput = '';
            }, err => {
                this.addBotMessage('❌ Server error');
            });
    }

    // -----------------------------
    // UI Actions
    // -----------------------------

    selectSpecialization(spec: any) {
        this.conversationState.specializationId = spec.id;
        this.addUserMessage(spec.name);
        this.sendMessage(true, spec.name, 'specialization');
    }

    selectDoctor(doc: any) {
        this.conversationState.doctorId = doc.doctorId;
        this.addUserMessage(doc.name);
        this.sendMessage(true, doc.name, 'doctor');
    }

    selectSlot(slot: any) {
        this.conversationState.slotId = slot.slotId ?? slot.id;
        this.conversationState.slotStartTime = slot.startTime;
        this.conversationState.slotEndTime = slot.endTime;

        const slotLabel = `${slot.startTime} - ${slot.endTime}`;
        this.addUserMessage(slotLabel);
        this.sendMessage(true, slotLabel, 'slot');
    }

    // -----------------------------
    // Message Helpers
    // -----------------------------

    addUserMessage(message: string) {
        this.messages.push({ sender: 'user', message });
    }

    addBotMessage(message: string, data?: any[], doctors?: any[], slots?: any[]) {
        this.messages.push({
            sender: 'bot',
            message,
            data,
            doctors,
            slots
        });
    }

    // -----------------------------
    // Reset Chat
    // -----------------------------
    resetChat() {
        this.messages = [];
        this.step = 1;

        this.conversationState = {
            patientId: '',
            step: 1,
            selectedDate: null,
            specializationId: null,
            doctorId: null,
            slotId: null,
            slotStartTime: null,
            slotEndTime: null
        };

        this.sendMessage(); // restart flow
    }

    buildRequest(message: string = ''): any {
        return {
            message,
            patientId: this.conversationState.patientId,
            step: this.conversationState.step,
            selectedDate: this.conversationState.selectedDate,
            specializationId: this.conversationState.specializationId,
            doctorId: this.conversationState.doctorId,
            slotId: this.conversationState.slotId,
            slotStartTime: this.conversationState.slotStartTime,
            slotEndTime: this.conversationState.slotEndTime
        };
    }

    private getNextStepFallback(fromButton: boolean, action: 'specialization' | 'doctor' | 'slot' | ''): number {
        if (!fromButton) {
            return this.conversationState.step;
        }

        switch (action) {
            case 'specialization':
                return Math.max(this.conversationState.step, 4);
            case 'doctor':
                return Math.max(this.conversationState.step, 5);
            case 'slot':
                return Math.max(this.conversationState.step, 6);
            default:
                return this.conversationState.step;
        }
    }

    // Clears chat and resets flow
    clearChat() {
        this.startChat();
    }
}