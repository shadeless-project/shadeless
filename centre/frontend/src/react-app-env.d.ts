export { };

declare global {
  interface Window {
    copyToClipboard: (s: string) => void;
    formatDate: (s: Date) => string;
    getUserRole: () => string;
    getUser: () => any;
    escapeHtml: (s: string) => string;
    sleep: (ms: number) => Promise<void>;
    isSetupFfufCorrect: (obj: any) => boolean;
    isString: (s: any) => boolean;
    isObject: (s: any) => boolean;
    isArrayString: (s: any) => boolean;
    isArray: (s: any) => boolean;
    isArrayObject: (s: any) => boolean;
    isBool: (s: any) => boolean;
    isNumber: (s: any) => boolean;
  }
}
