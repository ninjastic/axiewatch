import { ethers } from 'ethers';

export const rpc = new ethers.providers.JsonRpcProvider(
  {
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  },
  { name: 'Ronin', chainId: 2020 }
);
