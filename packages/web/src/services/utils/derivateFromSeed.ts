import { ethers } from 'ethers';

interface DerivateFromSeedParams {
  seed: string;
  derivationPath: string;
  maxDepth: number;
}

export interface Address {
  address: string;
  privateKey: string;
}

export function derivateFromSeed({ seed, derivationPath, maxDepth }: DerivateFromSeedParams): Address[] {
  const addresses = [];
  const walletNode = ethers.utils.HDNode.fromMnemonic(seed);

  for (let x = 0; x <= maxDepth - 1; x += 1) {
    const wallet = walletNode.derivePath(`${derivationPath}/${x}`);
    addresses.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  return addresses;
}
