export {};

declare global {
  interface Window {
    copyToClipboard: (s: string) => void;
    formatDate: (s: Date) => string;
    getUserRole: () => string;
    getUser: () => any;
    escapeHtml: (s: string) => string;
    sleep: (ms: number) => Promise<void>;
    isSetupFfufCorrect: (obj: any) => boolean;
  }
}
