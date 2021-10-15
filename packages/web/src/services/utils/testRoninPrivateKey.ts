import { ethers } from 'ethers';

interface TestRoninPrivateKeyParams {
  privateKey: string;
  address: string;
}

export async function testRoninPrivateKey({ privateKey, address }: TestRoninPrivateKeyParams): Promise<boolean> {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const returnedAddress = await wallet.getAddress();

    return address.toLocaleLowerCase() === returnedAddress.toLowerCase();
  } catch (error: any) {
    console.log('ronin privKey error', error);
    return false;
  }
}
