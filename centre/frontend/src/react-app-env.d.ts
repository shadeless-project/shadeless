export {};

declare global {
  interface Window {
    copyToClipboard: (s: string) => void;
  }
}