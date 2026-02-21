import { NetworkType } from '@/types/wallet';
import { getNetworkPassphrase, isFreighterInstalled, waitForFreighter } from './wallet-utils';

export class FreighterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FreighterError';
  }
}

export const connectFreighter = async (network: NetworkType): Promise<string> => {
  // Wait for Freighter to be available
  const isAvailable = await waitForFreighter();
  
  if (!isAvailable || !window.freighter) {
    throw new FreighterError(
      'Freighter wallet is not installed. Please install it from https://www.freighter.app/'
    );
  }

  try {
    // Check if already connected
    const isConnected = await window.freighter.isConnected();
    
    if (!isConnected) {
      throw new FreighterError('Please unlock your Freighter wallet and try again');
    }

    // Get public key
    const publicKey = await window.freighter.getPublicKey();
    
    if (!publicKey) {
      throw new FreighterError('Failed to retrieve public key from Freighter');
    }

    // Verify network
    const freighterNetwork = await window.freighter.getNetwork();
    const expectedNetwork = network === NetworkType.MAINNET ? 'PUBLIC' : 'TESTNET';
    
    if (freighterNetwork !== expectedNetwork) {
      throw new FreighterError(
        `Please switch Freighter to ${network} network. Current network: ${freighterNetwork}`
      );
    }

    return publicKey;
  } catch (error) {
    if (error instanceof FreighterError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new FreighterError(`Freighter connection failed: ${error.message}`);
    }
    
    throw new FreighterError('An unknown error occurred while connecting to Freighter');
  }
};

export const signTransactionWithFreighter = async (
  xdr: string,
  network: NetworkType
): Promise<string> => {
  if (!isFreighterInstalled() || !window.freighter) {
    throw new FreighterError('Freighter wallet is not available');
  }

  try {
    const networkPassphrase = getNetworkPassphrase(network);
    const signedXdr = await window.freighter.signTransaction(xdr, {
      network: network === NetworkType.MAINNET ? 'PUBLIC' : 'TESTNET',
      networkPassphrase,
    });

    return signedXdr;
  } catch (error) {
    if (error instanceof Error) {
      throw new FreighterError(`Transaction signing failed: ${error.message}`);
    }
    throw new FreighterError('Failed to sign transaction');
  }
};

export const checkFreighterNetwork = async (expectedNetwork: NetworkType): Promise<boolean> => {
  if (!isFreighterInstalled() || !window.freighter) {
    return false;
  }

  try {
    const freighterNetwork = await window.freighter.getNetwork();
    const expected = expectedNetwork === NetworkType.MAINNET ? 'PUBLIC' : 'TESTNET';
    return freighterNetwork === expected;
  } catch {
    return false;
  }
};
