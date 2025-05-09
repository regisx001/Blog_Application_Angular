import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

interface ChatHistory {
  id: number;
  title: string;
  timestamp: string;
  isActive: boolean;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('fullscreenMessages') fullscreenMessages!: ElementRef;
  @ViewChild('fullscreenInput') fullscreenInput!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isChatVisible: boolean = false;
  isFullscreenMode: boolean = false;
  isTyping: boolean = false;
  isFullscreenTyping: boolean = false;
  messageHistory: Message[] = [];
  userMessage: string = '';
  fullscreenUserMessage: string = '';

  chatHistories: ChatHistory[] = [
    {
      id: 1,
      title: 'Current Chat',
      timestamp: 'Started just now',
      isActive: true,
    },
    {
      id: 2,
      title: 'Product Support',
      timestamp: 'Yesterday',
      isActive: false,
    },
    {
      id: 3,
      title: 'Shipping Question',
      timestamp: '3 days ago',
      isActive: false,
    },
  ];

  suggestionQueries: string[] = [
    'How can I help you?',
    'Product information',
    'Track my order',
    'Contact support',
  ];

  welcomeMessage: Message = {
    text: "Hi there! I'm your assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  };

  fullscreenWelcomeMessage = {
    text: `Hello! I'm your AI assistant, ready to help with your questions and tasks. You can ask me anything, and I'll do my best to assist you.

Here are some things I can help you with:
- Answer questions about products and services
- Provide information about shipping and returns
- Troubleshoot common issues
- Offer recommendations based on your preferences

What can I help you with today?`,
    sender: 'bot' as 'bot',
    timestamp: new Date(),
  };

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Initialize with welcome message
    this.messageHistory.push(this.welcomeMessage);
  }

  ngAfterViewInit(): void {
    if (this.fullscreenInput && this.fullscreenInput.nativeElement) {
      this.adjustTextareaHeight(this.fullscreenInput.nativeElement);
    }
  }

  toggleChat(): void {
    this.isChatVisible = !this.isChatVisible;
    if (this.isChatVisible) {
      setTimeout(() => {
        if (this.messageInput && this.messageInput.nativeElement) {
          this.messageInput.nativeElement.focus();
        }
      }, 300);
    }
  }

  closeChat(): void {
    this.isChatVisible = false;
  }

  minimizeChat(): void {
    this.isChatVisible = false;
  }

  expandToFullscreen(): void {
    this.isChatVisible = false;
    this.isFullscreenMode = true;
    this.renderer.addClass(document.body, 'overflow-hidden');

    setTimeout(() => {
      if (this.fullscreenInput && this.fullscreenInput.nativeElement) {
        this.fullscreenInput.nativeElement.focus();
      }
    }, 300);
  }

  closeFullscreen(): void {
    this.isFullscreenMode = false;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  sendMessage(fromFullscreen: boolean = false): void {
    const messageText = fromFullscreen
      ? this.fullscreenUserMessage.trim()
      : this.userMessage.trim();

    if (!messageText) return;

    const newMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messageHistory.push(newMessage);

    // Reset input fields
    this.userMessage = '';
    this.fullscreenUserMessage = '';

    if (fromFullscreen) {
      // Reset textarea height
      if (this.fullscreenInput && this.fullscreenInput.nativeElement) {
        this.fullscreenInput.nativeElement.style.height = 'auto';
      }
    }

    // Show typing indicators
    this.isTyping = true;
    this.isFullscreenTyping = true;

    // Scroll to bottom
    this.scrollToBottom();

    // Simulate bot response after delay
    setTimeout(() => {
      this.isTyping = false;
      this.isFullscreenTyping = false;

      const response = this.generateResponse(messageText);
      const botMessage: Message = {
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      this.messageHistory.push(botMessage);
      this.scrollToBottom();
    }, 1500);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }

      if (this.fullscreenMessages && this.fullscreenMessages.nativeElement) {
        this.fullscreenMessages.nativeElement.scrollTop =
          this.fullscreenMessages.nativeElement.scrollHeight;
      }
    }, 100);
  }

  selectSuggestion(query: string): void {
    this.userMessage = query;
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  startNewChat(): void {
    // Keep welcome messages only
    this.messageHistory = [this.welcomeMessage];

    // Focus on input
    setTimeout(() => {
      if (this.fullscreenInput && this.fullscreenInput.nativeElement) {
        this.fullscreenInput.nativeElement.focus();
      }
    }, 300);
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight < 120 ? textarea.scrollHeight : 120;
    textarea.style.height = `${newHeight}px`;
  }

  handleKeydown(event: KeyboardEvent): void {
    // If Enter is pressed without Shift, send the message
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(true);
    }
  }

  generateResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      return 'Hello there! How can I assist you today?';
    } else if (lowerMessage.includes('help')) {
      return "I'd be happy to help! Could you please provide more details about what you need assistance with?";
    } else if (
      lowerMessage.includes('product') ||
      lowerMessage.includes('buy')
    ) {
      return "We offer a variety of products. Could you specify which product category you're interested in, or would you like me to recommend our best sellers?";
    } else if (
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost')
    ) {
      return "Our products range in price depending on the model and features. If you tell me which specific product you're interested in, I can provide pricing information.";
    } else if (
      lowerMessage.includes('shipping') ||
      lowerMessage.includes('delivery')
    ) {
      return 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Orders over $50 qualify for free standard shipping.';
    } else if (
      lowerMessage.includes('return') ||
      lowerMessage.includes('refund')
    ) {
      return 'Our return policy allows returns within 30 days of purchase for a full refund. Items must be in original condition with all packaging.';
    } else if (
      lowerMessage.includes('contact') ||
      lowerMessage.includes('support')
    ) {
      return 'You can reach our customer support team at support@example.com or call us at 1-800-123-4567, Monday through Friday, 9am-6pm ET.';
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else {
      return "Thank you for your message. I'll do my best to assist you. Could you provide more details so I can better understand your needs?";
    }
  }

  formatMessageText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
