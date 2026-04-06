import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.appointment.service';
import { ChatMessage, Doctor, Slot, Specialization } from '../models/chat-appointment-message.model';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-chat-appointment',
    standalone: true,
    imports: [NgClass, NgForOf, NgIf, CommonModule, FormsModule],
    templateUrl: './chat.appointment.component.html'
})
export class ChatAppointmentComponent implements OnInit {
    messages: ChatMessage[] = [];
    userInput: string = '';

    // Conversation state
    conversationState = {
        message: '',
        patientId: '',
        step: 1,
        selectedDate: null as string | null,
        specializationId: null as number | null,
        doctorId: null as string | null,
        slotId: null as number | null,
        slotStartTime: null as string | null,
        slotEndTime: null as string | null
    };

    constructor(
        private chatService: ChatService,
        private router: Router,
        private authService: AuthService,
        private cd: ChangeDetectorRef
    ) {
        //this.startChat();
    }

    ngOnInit(): void {
        this.conversationState.patientId = this.authService.isLoggedIn()
        ? this.authService.getUserName()
        : 'GUEST';

        this.addBotMessage('Hello! Let’s schedule your appointment.');
        this.askDate();
    }

    // Initialize the chat with welcome message
    startChat() {
        this.messages = [];
        this.conversationState.step = 2;
        this.addBotMessage("Hello! Let’s schedule your appointment.\nPlease enter appointment date (YYYY-MM-DD)");
    }

    /** Navigation */
    jsChatbotSubmit(url: string): void {
        this.router.navigate([url]);
    }

    /** Add bot message with optional type/options */
    addBotMessage(message: string, type: 'text' | 'specializations' | 'doctors' | 'slots' = 'text', options: any[] = []) {
        this.messages.push({
            sender: 'bot',
            message,
            type,
            options
        });

        // Scroll to bottom
        setTimeout(() => {
            const container = document.querySelector('.chat-container');
            if (container) container.scrollTop = container.scrollHeight;
        }, 50);
    }

    /** Add user message */
    addUserMessage(msg: string) {
        this.messages.push({ sender: 'user', message: msg });
    }

    /** Ask for date */
    askDate() {
        this.addBotMessage('Please enter appointment date (YYYY-MM-DD)');
        this.conversationState.step = 2;
    }

    /** Handle send message */
    sendMessage(event?: Event, fromButton: boolean = false) {
        event?.preventDefault();

        console.log('User input:', this.userInput);
        console.log('Message:', this.conversationState.message);
        console.log('Current conversation state:', this.conversationState);

        //if (!this.userInput.trim() && !fromButton) return;
        // Only handle error for empty input if called by button or enter
        if (!this.userInput.trim() && !this.conversationState.selectedDate) {
            if (this.conversationState.step === 2) {
                this.addBotMessage('⚠️ Please enter a valid appointment date (YYYY-MM-DD)');
            }
            return;
        }

        // Save user input
        if (this.userInput.trim()) {
            this.addUserMessage(this.userInput);
        }

        // Step 2: Date input
        if (this.conversationState.step === 2 && this.userInput) {
            this.conversationState.selectedDate = this.userInput;
        }

        const payload = this.buildRequest();

        console.log('Sending payload:', payload);

        this.chatService.sendMessage(payload).subscribe(res => {
            //if (res.reply) this.addBotMessage(res.reply);

            switch (this.conversationState.step) {
                case 2: // After date -> specializations
                   if (res.data && !this.conversationState.specializationId) {
                        this.addBotMessage('Select a specialization:', 'specializations', res.data);
                        this.conversationState.step = 3;
                    }
                    break;
                case 3: // After specialization -> doctors
                    if (res.doctors && !this.conversationState.doctorId) {
                        this.addBotMessage('Select a doctor:', 'doctors', res.doctors);
                        this.conversationState.step = 4;
                    }
                    break;
                case 4: // After doctor -> slots
                    if (res.slots && !this.conversationState.slotId) {
                        this.addBotMessage('Select a slot:', 'slots', res.slots);
                        this.conversationState.step = 5;
                    }
                    break;
                case 5: // After slot -> confirmation
                    this.addBotMessage(res.reply || 'Appointment booked successfully!');
                    this.conversationState.step = 6;
                    break;
            }
            this.cd.detectChanges();
        });

        this.userInput = '';
    }

    /** Handle specialization selection */
    selectSpecialization(id: number) {
        this.conversationState.specializationId = id;

        const selectedName = this.messages
            .flatMap(m => m.options || [])
            .find(s => s.id === id)?.name;

        //this.addBotMessage(`You selected specialization: ${selectedName}`);
        this.addUserMessage(selectedName || '');

        this.clearOptions('specializations');

        console.log('Requesting doctors with payload:', this.buildRequest());

        //CALL BACKEND DIRECTLY
        this.chatService.sendMessage(this.buildRequest()).subscribe(res => {
            if (res.doctors) {
                this.addBotMessage('Select a doctor:', 'doctors', res.doctors);
                this.conversationState.step = 4;
            }
        });
    }

    /** Handle doctor selection */
    selectDoctor(id: string) {
        this.conversationState.doctorId = id;

        const selectedName = this.messages
            .flatMap(m => m.options || [])
            .find(d => d.doctorId === id)?.name;

        //this.addBotMessage(`You selected doctor: ${selectedName}`);
        this.addUserMessage(selectedName || '');

        this.clearOptions('doctors');

        console.log('Requesting slots with payload:', this.buildRequest());

        this.chatService.sendMessage(this.buildRequest()).subscribe(res => {
            if (res.slots) {
                this.addBotMessage('Select a slot:', 'slots', res.slots);
                this.conversationState.step = 5;
            }
        });
    }

    /** Handle slot selection */
    selectSlot(slot: Slot) {
        this.conversationState.slotId = slot.slotId;
        this.conversationState.slotStartTime = slot.startTime;
        this.conversationState.slotEndTime = slot.endTime;

        //this.addBotMessage(`You selected slot: ${slot.startTime} - ${slot.endTime}`);
        this.addUserMessage(`${slot.startTime} - ${slot.endTime}`);
        this.clearOptions('slots');

        this.chatService.sendMessage({ ...this.conversationState }).subscribe(res => {
            this.addBotMessage(res.reply || 'Appointment booked successfully!');
            this.conversationState.step = 6;
        });
    }

    clearOptions(type: string) {
        this.messages.forEach(m => {
            if (m.type === type) {
                m.options = [];
            }
        });
    }

    buildRequest(): any {
        return {
            message: this.userInput || '',
            patientId: this.conversationState.patientId,
            step: this.conversationState.step,
            selectedDate: this.conversationState.selectedDate,
            specializationId: this.conversationState.specializationId,
            doctorId: this.conversationState.doctorId,
            slotId: this.conversationState.slotId
        };
    }

    // Clears chat and resets flow
    clearChat() {
        this.startChat();
    }
}