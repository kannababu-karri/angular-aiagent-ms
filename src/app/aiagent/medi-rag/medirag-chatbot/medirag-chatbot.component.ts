import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MediRagService } from "../../../services/medi.rag.service";
import { ViewChild, ElementRef } from '@angular/core';
import { RagResponse } from "../../../models/rag-response.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-medirag-chatbot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './medirag-chatbot.html'
})

export class MediragChatbotComponent {
    errorMessages: string[] = [];
    successMessage: string = '';

    userMessage = '';
    messages: any[] = [];

    loading = false;

    @ViewChild('chatBox') chatBox!: ElementRef;

    constructor(private mediRagService: MediRagService,
                private cd: ChangeDetectorRef,
                private router: Router
    ) { }

    jsChatbotSubmit(url: string): void {
        console.log('Navigating to:', url);
        this.router.navigate([url]);
    }

    sendMessage() {
        if (!this.userMessage.trim() || this.loading) return;

        const question = this.userMessage;
        // Push user message
        this.messages.push({
          sender: 'user',
          text: question
        });

        this.userMessage = '';
        this.loading = true;
        this.scrollToBottom();

        this.mediRagService.askQuestion(question)
          .subscribe({
            next: (res) => {
              console.log('API RESPONSE:', res);
              this.messages.push({
                  sender: 'bot',
                  text: res.answer || '',
                  sources: Array.isArray(res.sources) ? res.sources : []
              });

              this.loading = false;
              this.cd.detectChanges(); 
              this.scrollToBottom();
            },

            error: (err) => {
                console.error(err);
                this.messages.push({
                    sender: 'bot',
                    text: '⚠️ AI service is currently unavailable.',
                    sources: []
                });
            }
        });
    }

    private scrollToBottom() {
      setTimeout(() => {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }, 100);
    }
}