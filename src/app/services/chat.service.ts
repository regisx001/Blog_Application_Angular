import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Message,
  ChatHistory,
  ChatState,
} from '../components/chatbot/models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Default welcome message
  private readonly welcomeMessage: Message = {
    text: "Hi there! I'm your assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  };

  // Initial state
  private initialState: ChatState = {
    isChatVisible: false,
    isFullscreenMode: false,
    isTyping: false,
    isFullscreenTyping: false,
    messageHistory: [this.welcomeMessage],
  };

  // Chat histories
  private _chatHistories: ChatHistory[] = [
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

  // Suggestion queries
  private _suggestionQueries: string[] = [
    'How can I help you?',
    'Product information',
    'Track my order',
    'Contact support',
  ];

  // State management
  private state = new BehaviorSubject<ChatState>(this.initialState);
  public state$ = this.state.asObservable();

  constructor() {}

  get chatHistories(): ChatHistory[] {
    return this._chatHistories;
  }

  get suggestionQueries(): string[] {
    return this._suggestionQueries;
  }

  // State manipulation methods
  toggleChat(): void {
    const currentState = this.state.value;
    this.state.next({
      ...currentState,
      isChatVisible: !currentState.isChatVisible,
    });
  }

  closeChat(): void {
    const currentState = this.state.value;
    this.state.next({
      ...currentState,
      isChatVisible: false,
    });
  }

  minimizeChat(): void {
    this.closeChat();
  }

  expandToFullscreen(): void {
    const currentState = this.state.value;
    this.state.next({
      ...currentState,
      isChatVisible: false,
      isFullscreenMode: true,
    });
  }

  closeFullscreen(): void {
    const currentState = this.state.value;
    this.state.next({
      ...currentState,
      isFullscreenMode: false,
    });
  }

  resetChat(): void {
    this.state.next({
      ...this.initialState,
      isFullscreenMode: this.state.value.isFullscreenMode,
    });
  }

  sendMessage(text: string): void {
    if (!text.trim()) return;

    const currentState = this.state.value;

    // Add user message
    const userMessage: Message = {
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedHistory = [...currentState.messageHistory, userMessage];

    // Update state with user message and typing indicator
    this.state.next({
      ...currentState,
      messageHistory: updatedHistory,
      isTyping: true,
      isFullscreenTyping: true,
    });

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = this.generateResponse(text);
      const botMessage: Message = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      this.state.next({
        ...this.state.value,
        messageHistory: [...this.state.value.messageHistory, botMessage],
        isTyping: false,
        isFullscreenTyping: false,
      });
    }, 1500);
  }

  // Helper methods
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
      return "We offer a variety of products. Could you specify which product category you're interested in?";
    } else if (lowerMessage.includes('price')) {
      return 'Our products range in price depending on the model and features.';
    } else if (lowerMessage.includes('shipping')) {
      return 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days).';
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else {
      return 'Thank you for your message. Could you provide more details so I can better assist you?';
    }
  }

  formatMessageText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
