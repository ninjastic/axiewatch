import { ethers } from 'ethers';

export const rpc = new ethers.providers.JsonRpcProvider(
  {
    url: `https://api.roninchain.com/rpc`,
  },
  { name: 'Ronin', chainId: 2020 }
);
