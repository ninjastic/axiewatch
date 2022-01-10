import { AiOutlineCheck } from 'react-icons/ai';
import { Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';
import produce from 'immer';

import abi from '../../constants/abi/SLP.json';
import { skyMavisApi } from '../api';
import { authenticateFromSignature } from '../utils/authenticateFromSignature';
import { proxiedRpc } from '../rpc';

interface ClaimResponse {
  tx: { hash: string };
  amount: number;
}

interface Step {
  name: 'Claim' | 'Manager' | 'Scholar';
  message?: string;
  status?: string;
  icon?: React.ReactElement;
  hash?: string;
  amount?: number;
}

interface Status {
  address: string;
  steps: Step[];
}

interface ClaimTransactionProps {
  privateKey: string;
  statusIndex: number;
  setStatus: (value: React.SetStateAction<Status[]>) => void;
}

export async function ClaimTransaction({
  privateKey,
  statusIndex,
  setStatus,
}: ClaimTransactionProps): Promise<ClaimResponse> {
  const wallet = new ethers.Wallet(privateKey);

  const signer = wallet.connect(proxiedRpc);
  const address = await wallet.getAddress();

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[0].status = 'loading';
      draft[statusIndex].steps[0].message = 'Authenticating...';
      draft[statusIndex].steps[0].icon = <Spinner size="sm" />;
    })
  );

  const { accessToken } = await authenticateFromSignature({
    address,
    privateKey,
  });

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[0].message = 'Preparing claim...';
    })
  );

  const response = await skyMavisApi.post('/claim', null, {
    params: { address },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { total } = response.data;
  const { balance } = response.data.blockchain_related;

  const amountToClaim = Math.abs(total - balance);

  const { signature, amount, timestamp } = response.data.blockchain_related.signature;

  console.log('address', address);
  console.log('amountToClaim', amountToClaim);
  console.log('blockchainAmount', amount);
  console.log('blockchainTimestamp', timestamp);
  console.log('blockchainSignature', signature);

  const contract = new ethers.Contract(
    '0xa8754b9fa15fc18bb59458815510e40a12cd2014', // axie SLP contract (ronin)
    abi,
    signer
  );

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[0].message = 'Claiming...';
    })
  );

  const txPending = await contract.checkpoint(address, amount, timestamp, signature, {
    gasPrice: 0,
    gasLimit: 155000,
    value: 0,
  });

  console.log('sent', txPending.hash);

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[0].message = 'Confirming tx...';
    })
  );

  const tx = await txPending.wait();

  console.log('claimTx', tx);

  const amountClaimed = Number(ethers.utils.formatUnits(tx.logs[0].data, 'wei'));

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[0].status = 'success';
      draft[statusIndex].steps[0].icon = <AiOutlineCheck />;
      draft[statusIndex].steps[0].message = `Claimed (${amountClaimed} SLP)`;
      draft[statusIndex].steps[0].amount = amountClaimed;
      draft[statusIndex].steps[0].hash = txPending.hash;
    })
  );

  return { tx: txPending, amount: amountClaimed };
}
