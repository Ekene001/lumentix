import { NetworkType, WalletType } from '@/types/wallet';

export const WALLET_STORAGE_KEY = 'lumentix_wallet';
export const NETWORK_STORAGE_KEY = 'lumentix_network';

export interface StoredWalletData {
  walletType: WalletType;
  publicKey: string;
  network: NetworkType;
}

export const saveWalletData = (data: StoredWalletData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data));
  }
};

export const getStoredWalletData = (): StoredWalletData | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearWalletData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }
};

export const getNetworkPassphrase = (network: NetworkType): string => {
  return network === NetworkType.MAINNET
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015';
};

export const isFreighterInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.freighter !== 'undefined';
};

export const waitForFreighter = (timeout = 3000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isFreighterInstalled()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (isFreighterInstalled()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
};
