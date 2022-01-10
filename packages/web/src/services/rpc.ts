import { ethers } from 'ethers';

export const rpc = new ethers.providers.JsonRpcProvider(
  {
    url: `https://api.roninchain.com/rpc`,
  },
  { name: 'Ronin', chainId: 2020 }
);

export const rpcWrite = new ethers.providers.JsonRpcProvider(
  {
    url: `https://proxy.roninchain.com/free-gas-rpc`,
  },
  { name: 'Ronin', chainId: 2020 }
);

export const proxiedRpc = new ethers.providers.JsonRpcProvider(
  {
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  },
  { name: 'Ronin', chainId: 2020 }
);
