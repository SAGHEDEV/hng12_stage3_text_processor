export {};

declare global {
  interface Window {
    ai?: {
      translator?: {
        capabilities: () => Promise<any>;
        create: (params: any) => Promise<any>;
      };
      languageDetector?: {
        detect: (
          text: string
        ) => Promise<{ language: string; confidence: number }>;
      };
      summarizer?: {
        summarize: (text: string) => Promise<{ summary: string }>;
      };
    };
  }
}
