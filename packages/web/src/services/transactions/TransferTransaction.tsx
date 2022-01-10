import { AiOutlineCheck } from 'react-icons/ai';
import { Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';
import produce from 'immer';

import abi from '../../constants/abi/SLP.json';
import { proxiedRpc } from '../rpc';

interface TransferResponse {
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

interface TransferTransactionParams {
  privateKey: string;
  amount: number;
  to: string;
  statusIndex: number;
  statusType: 'Manager' | 'Scholar';
  setStatus: (value: React.SetStateAction<Status[]>) => void;
}

export async function TransferTransaction({
  privateKey,
  amount,
  to,
  statusIndex,
  statusType,
  setStatus,
}: TransferTransactionParams): Promise<TransferResponse> {
  const stepIndex = statusType === 'Manager' ? 1 : 2;

  const checksumToAddress = ethers.utils.getAddress(to);

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(proxiedRpc);

  const contract = new ethers.Contract(
    '0xa8754b9fa15fc18bb59458815510e40a12cd2014', // axie SLP contract (ronin)
    abi,
    signer
  );

  console.log('transfer', checksumToAddress, amount);

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[stepIndex].status = 'loading';
      draft[statusIndex].steps[stepIndex].message = `Transfering... (${amount} SLP)`;
      draft[statusIndex].steps[stepIndex].icon = <Spinner size="sm" />;
    })
  );

  const txPending = await contract.transfer(checksumToAddress, amount, {
    gasLimit: 60000,
    gasPrice: 0,
  });

  console.log('sent', txPending.hash);

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[stepIndex].message = `Confirming tx... (${amount} SLP)`;
    })
  );

  const tx = await txPending.wait();

  console.log('transferTx', tx);

  setStatus(oldStatus =>
    produce(oldStatus, draft => {
      draft[statusIndex].steps[stepIndex].status = 'success';
      draft[statusIndex].steps[stepIndex].message = `Transfered (${amount} SLP)`;
      draft[statusIndex].steps[stepIndex].icon = <AiOutlineCheck />;
      draft[statusIndex].steps[stepIndex].amount = amount;
      draft[statusIndex].steps[stepIndex].hash = txPending.hash;
    })
  );

  return { tx: txPending, amount };
}
