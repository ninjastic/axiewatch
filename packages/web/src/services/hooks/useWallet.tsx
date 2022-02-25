import { UseQueryResult, useQuery } from 'react-query';
import { ethers } from 'ethers';

import { rpc } from 'src/services/rpc';
import slpAbi from '../../constants/abi/SLP.json';

interface UseWalletData {
  address: string;
  slp: number;
  axs: number;
  eth: number;
}

interface UseWalletProps {
  address: string;
}

export const useWallet = ({ address }: UseWalletProps): UseQueryResult<UseWalletData> => {
  const slpContract = new ethers.Contract(
    '0xa8754b9fa15fc18bb59458815510e40a12cd2014', // axie SLP contract (ronin)
    slpAbi,
    rpc
  );

  const axsContract = new ethers.Contract(
    '0x97a9107c1793bc407d6f527b77e7fff4d812bece', // axie SLP contract (ronin)
    slpAbi,
    rpc
  );

  const ethContract = new ethers.Contract(
    '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5', // axie SLP contract (ronin)
    slpAbi,
    rpc
  );

  const result = useQuery(
    ['wallet', address],
    async () => {
      const slp = await slpContract.balanceOf(address);
      const axs = await axsContract.balanceOf(address);
      const eth = await ethContract.balanceOf(address);

      return {
        address,
        slp: Number(ethers.utils.formatUnits(slp, 'wei')),
        axs: Number(ethers.utils.formatEther(axs)),
        eth: Number(ethers.utils.formatEther(eth)),
      };
    },
    {
      staleTime: 1000 * 60 * 15,
    }
  );

  return result;
};
