export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatHistory {
  id: number;
  title: string;
  timestamp: string;
  isActive: boolean;
}

export interface ChatState {
  isChatVisible: boolean;
  isFullscreenMode: boolean;
  isTyping: boolean;
  isFullscreenTyping: boolean;
  messageHistory: Message[];
}
