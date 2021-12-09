import { ethers } from 'ethers';

export function checkValidAddress(address: string): boolean {
  const withoutPrefix = address?.replace('ronin:', '0x');

  return ethers.utils.isAddress(withoutPrefix);
}
