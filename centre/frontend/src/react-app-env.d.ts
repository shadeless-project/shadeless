export {};

declare global {
  interface Window {
    copyToClipboard: (s: string) => void;
    formatDate: (s: Date) => string;
    getUserRole: () => string;
    getUser: () => any;
  }
}
