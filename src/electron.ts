export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
const electron = window?.electronAPI;

export const isElectron = electron != null;

export const openExternalLink = electron?.openWithBrowser;
export const showDbFile = electron?.showDbFile;
