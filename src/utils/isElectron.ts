// src/utils/isElectron.ts
interface ElectronProcess {
    type?: string;
}

export const isElectron = (): boolean => {
    return typeof window !== 'undefined' &&
           typeof window.process === 'object' &&
           (window.process as ElectronProcess).type === 'renderer';
};