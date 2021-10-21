import { Tr, Td, Text, Link, Tooltip } from '@chakra-ui/react';
import { GoCheck } from 'react-icons/go';
import { BiError } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import { ethers } from 'ethers';

import dayjs from '../../services/dayjs';
import abi from '../../constants/abi/SLP.json';
import { scholarsMap } from '../../recoil/scholars';

interface TransactionTableEntryProps {
  transaction: any;
}

export const TransactionTableEntry = ({ transaction }: TransactionTableEntryProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const scholar = scholars.find(s => s.address === transaction.context);

  const eth = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5';
  const slp = '0xa8754b9fa15fc18bb59458815510e40a12cd2014';
  const axs = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';
  const bridge = '0xe35d62ebe18413d96ca2a2f7cf215bb21a406b4b';
  const marketplace = '0x213073989821f738a7ba3520c3d31a1f9ad31bbd';
  const staking = '0x05b0bb3c1c320b280501b86706c3551995bc8571';

  const explorerBaseUrl = `https://explorer.roninchain.com`;

  const getAction = () => {
    if (transaction.input.startsWith('0xa9059cbb') && transaction.to === eth) return 'Transfer ETH';

    if (transaction.input.startsWith('0xa9059cbb') && transaction.to === slp) return 'Transfer SLP';

    if (transaction.input.startsWith('0xa9059cbb') && transaction.to === axs) return 'Transfer AXS';

    if (transaction.input.startsWith('0xd3392ddf')) return 'Claim SLP';

    if (transaction.input.startsWith('0xbec24050') && transaction.input.includes(eth.replace('0x', '')))
      return 'Withdraw ETH';

    if (transaction.input.startsWith('0xbec24050') && transaction.input.includes(slp.replace('0x', '')))
      return 'Withdraw SLP';

    if (transaction.input.startsWith('0xbec24050') && transaction.input.includes(axs.replace('0x', '')))
      return 'Withdraw AXS';

    if (transaction.input.startsWith('0x0b830218')) return 'Create Axie Sale';

    if (transaction.input.startsWith('0x96b5a755')) return 'Cancel Axie Sale';

    if (transaction.input.startsWith('0x4d51bfc4')) return 'Buy Axie';

    if (transaction.input.startsWith('0x42842e0e')) return 'Transfer Axie';

    if (transaction.input.startsWith('0x8264f2c20')) return 'Breed Axie';

    if (transaction.input.startsWith('0x095ea7b3')) return 'Approve AXS';

    if (transaction.input.startsWith('0xa694fc3a')) return 'Stake AXS';

    if (transaction.input.startsWith('0x2e17de78')) return 'Unstake AXS';

    if (transaction.input.startsWith('0x92bd7b2c')) return 'Claim AXS';

    if (transaction.input.startsWith('0x3d8527ba')) return 'Restake Rewards';

    return '??';
  };

  const getStatusIcon = () => {
    if (transaction.status === 0) return <BiError color="red" />;
    return <GoCheck color="green" />;
  };

  const getFrom = () => {
    const from = scholars.find(s => s.address === transaction.from);

    const shortAddress = `${transaction.from.substr(0, 5)}...${transaction.from.substr(transaction.from.length - 5)}`;

    return from?.name ?? shortAddress;
  };

  const getTo = () => {
    if (transaction.to === bridge) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          Ronin Bridge
        </Link>
      );
    }

    if (transaction.to === marketplace) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          Marketplace
        </Link>
      );
    }

    if (transaction.to === staking) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          Staking Contract
        </Link>
      );
    }

    const { input } = transaction;
    const iface = new ethers.utils.Interface(abi);
    const action = getAction();

    if (action === 'Transfer AXS' || action === 'Transfer ETH' || action === 'Transfer SLP') {
      const data = iface.decodeFunctionData('transfer', input);
      const to = data._to;

      const toScholar = scholars.find(s => to.toLowerCase() === s.address.toLowerCase());

      const shortAddress = `${to.substr(0, 5)}...${to.substr(to.length - 5)}`;

      return (
        <Link href={`${explorerBaseUrl}/address/${to}`} target="_blank">
          {toScholar?.name ?? shortAddress}
        </Link>
      );
    }

    if (action === 'Approve AXS') {
      const approved = ethers.utils.hexlify(transaction.logs[0].topics[2]);

      if (approved === '0x00000000000000000000000005b0bb3c1c320b280501b86706c3551995bc8571') {
        return (
          <Link href={`${explorerBaseUrl}/address/${approved}`} target="_blank">
            Staking Contract
          </Link>
        );
      }

      const shortAddress = `${approved.substr(0, 5)}...${approved.substr(approved.length - 5)}`;

      return (
        <Link href={`${explorerBaseUrl}/address/${approved}`} target="_blank">
          {shortAddress}
        </Link>
      );
    }

    return '-';
  };

  const getValue = () => {
    const { input } = transaction;

    const iface = new ethers.utils.Interface(abi);
    const action = getAction();

    if (action === 'Transfer SLP') {
      const data = iface.decodeFunctionData('transfer', input);
      const value = ethers.utils.formatUnits(data._value, 'wei');
      return value;
    }

    if (action === 'Transfer ETH' || action === 'Transfer AXS') {
      const data = iface.decodeFunctionData('transfer', input);
      const value = Number(ethers.utils.formatEther(data._value));
      return Math.round(value * 10000) / 10000;
    }

    if (action === 'Withdraw SLP') {
      const data = iface.decodeFunctionData('withdrawERC20For', input);
      const value = ethers.utils.formatUnits(data._amount, 'wei');
      return value;
    }

    if (action === 'Withdraw ETH' || action === 'Withdraw AXS') {
      const data = iface.decodeFunctionData('withdrawERC20For', input);
      const value = Number(ethers.utils.formatEther(data._amount));
      return Math.round(value * 10000) / 10000;
    }

    try {
      if (action === 'Claim SLP') {
        const { data } = transaction.logs[0];
        const value = parseInt(data, 16);
        return value;
      }

      if (action === 'Stake AXS') {
        const { data } = transaction.logs.length === 2 ? transaction.logs[0] : transaction.logs[1];
        const value = parseInt(data, 16);
        return Math.round((value / 10 ** 18) * 1000) / 1000;
      }

      if (action === 'Unstake AXS') {
        const { data } = transaction.logs[0];
        const value = parseInt(data, 16);
        return Math.round((value / 10 ** 18) * 1000) / 1000;
      }

      if (action === 'Claim AXS') {
        const { data } = transaction.logs[0];
        const value = parseInt(data, 16);
        return Math.round((value / 10 ** 18) * 1000) / 1000;
      }

      if (action === 'Restake Rewards') {
        const { data } = transaction.logs[4];
        const value = parseInt(data, 16);
        return Math.round((value / 10 ** 18) * 1000) / 1000;
      }
    } catch (error) {
      console.log(transaction, error);
    }

    return '-';
  };

  const transactionDate = dayjs.unix(transaction.timestamp).format('DD MMM YYYY, HH:mm:ss');

  const transactionAgeRelative = dayjs.unix(transaction.timestamp).fromNow();

  return (
    <Tr>
      <Td>
        <Text fontWeight="bold">
          <Link href={`${explorerBaseUrl}/address/${transaction.from}`} target="_blank">
            {scholar?.name}
          </Link>
        </Text>
      </Td>

      <Td>
        <Text>
          <Link href={`${explorerBaseUrl}/tx/${transaction.hash}`} target="_blank">
            {transaction.hash.substr(0, 8)}...
            {transaction.hash.substr(transaction.hash.length - 4)}
          </Link>
        </Text>
      </Td>

      <Td>
        <Tooltip label={transactionDate}>
          <Text>{transactionAgeRelative}</Text>
        </Tooltip>
      </Td>

      <Td>
        <Text>{getAction()}</Text>
      </Td>

      <Td>
        <Text>{getValue()}</Text>
      </Td>

      <Td>
        <Text>
          <Link href={`${explorerBaseUrl}/address/${transaction.from}`} target="_blank">
            {getFrom()}
          </Link>
        </Text>
      </Td>

      <Td>
        <Text>{getTo()}</Text>
      </Td>

      <Td>{getStatusIcon()}</Td>
    </Tr>
  );
};
