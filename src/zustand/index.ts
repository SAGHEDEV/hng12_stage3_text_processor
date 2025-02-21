import { create } from "zustand";

export type messageStore = {
  message: string;
  lang: string;
  translate?: { result: string; lang: string };
  summarry?: string;
  date: Date;
};

type messagesStore = {
  messages: messageStore[];
  addMessage: (message: messageStore) => void;
  updateMessage: (
    messageIndex: number,
    value: { translate?: { result: string; lang: string }; summary?: string }
  ) => void;
  loadMessages: () => void;
  deleteMessage: (index: number) => void;
};

export const useMessagesStore = create<messagesStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => {
      const newMessages = [...state.messages, message];
      sessionStorage.setItem("messages", JSON.stringify(newMessages));
      return { messages: newMessages };
    }),
  deleteMessage: (index) =>
    set((state) => {
      const newMessages = state.messages.filter(
        (message, messIndex) => messIndex !== index
      );
      sessionStorage.setItem("messages", JSON.stringify(newMessages));
      return { messages: newMessages };
    }),
  updateMessage: (messageIndex, value) =>
    set((state) => {
      const newArrayOfMessages = state.messages.map((message, index) =>
        index === messageIndex ? { ...message, ...value } : message
      );
      sessionStorage.setItem("messages", JSON.stringify(newArrayOfMessages));
      return { messages: newArrayOfMessages };
    }),
  loadMessages: () => {
    const storedMessages = JSON.parse(
      sessionStorage.getItem("messages") || "[]"
    );
    set({ messages: storedMessages });
  },
}));
