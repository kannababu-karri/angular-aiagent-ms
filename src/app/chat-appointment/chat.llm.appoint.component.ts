import { Component } from '@angular/core';
import { ChatService } from '../services/chat.appointment.service';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat-llm-appointment',
    standalone: true,
    imports: [NgClass, NgForOf, NgIf, CommonModule, FormsModule],
    templateUrl: './chat.llm.appoint.component.html'
})
export class ChatLlmAppointmentComponent {

    userInput: string = '';
    step: number = 1;

    messages: any[] = [];

    conversationState: any = {
        patientId: '123',
        step: 1,
        selectedDate: null,
        specializationId: null,
        doctorId: null,
        slotId: null,
        slotStartTime: null,
        slotEndTime: null
    };

    isLoading = false; // 🚀 prevents duplicate calls

    constructor(private chatService: ChatService) { }

    sendMessage(fromButton = false) {

        // 🚫 prevent multiple clicks issue
        if (this.isLoading) return;

        // 🚫 empty validation (date step)
        if (this.step === 2 && !this.userInput.trim() && !fromButton) {
            this.addBotMessage('⚠️ Please enter a valid appointment date (YYYY-MM-DD)');
            return;
        }

        if (!fromButton && this.userInput.trim()) {
            this.addUserMessage(this.userInput);
        }

        const payload = {
            message: this.userInput,
            ...this.conversationState
        };

        this.isLoading = true;

        this.chatService.sendMessage(payload).subscribe(res => {

            this.isLoading = false;

            // ✅ update step
           this.step = res.step ?? this.step;
            this.conversationState.step = res.step;

            // ✅ store date if returned
            if (res.selectedDate) {
                this.conversationState.selectedDate = res.selectedDate;
            }

            // ✅ bot reply
            this.addBotMessage(res.reply, res.data, res.doctors, res.slots);

            // ✅ clear input
            this.userInput = '';

        }, err => {
            this.isLoading = false;
            this.addBotMessage('❌ Server error');
        });
    }

    // -----------------------------
    // UI Actions
    // -----------------------------

    selectSpecialization(spec: any) {
        this.conversationState.specializationId = spec.id;
        this.addUserMessage(spec.name);
        this.sendMessage(true);
    }

    selectDoctor(doc: any) {
        this.conversationState.doctorId = doc.doctorId;
        this.addUserMessage(doc.name);
        this.sendMessage(true);
    }

    selectSlot(slot: any) {
        this.conversationState.slotId = slot.id;
        this.conversationState.slotStartTime = slot.startTime;
        this.conversationState.slotEndTime = slot.endTime;

        this.addUserMessage(`${slot.startTime} - ${slot.endTime}`);
        this.sendMessage(true);
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
            patientId: '123',
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
}