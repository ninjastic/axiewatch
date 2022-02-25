import {
  Tr,
  Td,
  Text,
  Link,
  Tooltip,
  HStack,
  Image,
  Tag,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { BsArrowRight } from 'react-icons/bs';
import { GoCheck } from 'react-icons/go';
import { BiError } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import dayjs from '../../services/dayjs';
import abi from '../../constants/abi/SLP.json';
import { scholarsMap } from '../../recoil/scholars';
import { preferencesAtom } from 'src/recoil/preferences';
import { AxieTag } from './AxieTag';
import { WalletTransaction } from 'src/services/hooks/useBatchWalletTransactions';

interface TransactionTableEntryProps {
  transaction: WalletTransaction;
}

const TransactionTableEntryComponent = ({ transaction }: TransactionTableEntryProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const scholar = scholars.find(s => s.address?.toLowerCase() === transaction.context?.toLowerCase());
  const preferences = useRecoilValue(preferencesAtom);

  const managerWithoutRonin = preferences?.managerAddress.replace('ronin:', '0x');
  const isManager = transaction.from.toLowerCase() === managerWithoutRonin.toLowerCase();

  const eth = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5';
  const slp = '0xa8754b9fa15fc18bb59458815510e40a12cd2014';
  const axs = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';
  const bridge = '0xe35d62ebe18413d96ca2a2f7cf215bb21a406b4b';
  const marketplace = '0x213073989821f738a7ba3520c3d31a1f9ad31bbd';
  const staking = '0x05b0bb3c1c320b280501b86706c3551995bc8571';
  const axie = '0x32950db2a7164ae833121501c797d79e7b79d74c';

  const explorerBaseUrl = 'https://explorer.roninchain.com';

  const actionType = useMemo(() => {
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
    if (transaction.input.startsWith('0x42842e0e') || transaction.input.startsWith('0x23b872dd'))
      return 'Transfer Axie';
    if (transaction.input.startsWith('0x8264f2c2')) return 'Breed Axie';
    if (transaction.input.startsWith('0x8069cbb6')) return 'Morph Axie';
    if (transaction.input.startsWith('0xef509b6b')) return 'Batch Morph Axies';
    if (transaction.input.startsWith('0xef509b6b')) return 'Morph Axie';
    if (transaction.input.startsWith('0x095ea7b3')) return 'Approve AXS';
    if (transaction.input.startsWith('0xa694fc3a')) return 'Stake AXS';
    if (transaction.input.startsWith('0x2e17de78')) return 'Unstake AXS';
    if (transaction.input.startsWith('0x92bd7b2c')) return 'Claim AXS';
    if (transaction.input.startsWith('0x3d8527ba')) return 'Restake Rewards';
    if (transaction.input.startsWith('0xe8e337')) return 'Add Liquidity';
    if (transaction.input.startsWith('0x38ed1739')) return 'Swap Tokens';
    if (transaction.input.startsWith('0xbaa2abde')) return 'Remove Liquidity';
    return '??';
  }, [transaction]);

  const actionComponent = useMemo(() => {
    return <Text>{actionType}</Text>;
  }, [actionType]);

  const statusIcon = useMemo(() => {
    if (transaction.status === 0) return <BiError color="red" />;
    return <GoCheck color="green" />;
  }, [transaction.status]);

  const fromAddress = useMemo(() => {
    if (isManager) {
      return 'Manager';
    }

    const from = scholars.find(s => s.address.toLowerCase() === transaction.from.toLowerCase());
    const shortAddress = `${transaction.from.substr(0, 5)}...${transaction.from.substr(transaction.from.length - 5)}`;

    return from?.name ?? shortAddress;
  }, [isManager, scholars, transaction.from]);

  const toAddress = useMemo(() => {
    if (transaction.to === bridge) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          <HStack spacing={1}>
            <Image src="https://assets.axieinfinity.com/explorer/images/contract-icon/ron.png" width="16px" alt="slp" />

            <Text>Ronin Bridge</Text>
          </HStack>
        </Link>
      );
    }

    if (transaction.to === marketplace) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          <HStack spacing={1}>
            <Image
              src="https://assets.axieinfinity.com/explorer/images/contract-icon/marketplace.png"
              width="16px"
              alt="slp"
            />

            <Text>Marketplace</Text>
          </HStack>
        </Link>
      );
    }

    if (transaction.to === staking) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          <HStack spacing={1}>
            <Image src="/images/axies/axs.png" width="16px" alt="slp" />

            <Text>Staking Contract</Text>
          </HStack>
        </Link>
      );
    }

    if (transaction.input.startsWith('0xd3392ddf')) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          <HStack spacing={1}>
            <Image src="/images/axies/slp.png" width="16px" alt="slp" />

            <Text>SLP Contract</Text>
          </HStack>
        </Link>
      );
    }

    const { input } = transaction;
    const iface = new ethers.utils.Interface(abi);

    if (
      (actionType === 'Transfer AXS' || actionType === 'Transfer ETH' || actionType === 'Transfer SLP') &&
      transaction.status
    ) {
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

    if (actionType === 'Approve AXS' && transaction.status) {
      const approved = ethers.utils.hexlify(transaction.logs[0]?.topics[2]);

      if (approved === '0x00000000000000000000000005b0bb3c1c320b280501b86706c3551995bc8571') {
        return (
          <Link href={`${explorerBaseUrl}/address/${approved}`} target="_blank">
            <HStack spacing={1}>
              <Image src="/images/axies/axs.png" width="16px" alt="slp" />

              <Text>Staking Contract</Text>
            </HStack>
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

    if (actionType === 'Transfer Axie' && transaction.status) {
      const [, to] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const toScholar = scholars.find(s => to.toLowerCase() === s.address.toLowerCase());
      const shortAddress = `${to.substr(0, 5)}...${to.substr(to.length - 5)}`;

      return (
        <Link href={`${explorerBaseUrl}/address/${to}`} target="_blank">
          {toScholar?.name ?? shortAddress}
        </Link>
      );
    }

    if (transaction.to === axie) {
      return (
        <Link href={`${explorerBaseUrl}/address/${transaction.to}`} target="_blank">
          <HStack spacing={1}>
            <Image
              src="https://assets.axieinfinity.com/explorer/images/contract-icon/axie.png"
              width="16px"
              alt="slp"
            />

            <Text>Axie Contract</Text>
          </HStack>
        </Link>
      );
    }

    const { to } = transaction;

    const toScholar = scholars.find(s => to.toLowerCase() === s.address.toLowerCase());
    const shortAddress = `${to.substr(0, 5)}...${to.substr(to.length - 5)}`;

    return (
      <Link href={`${explorerBaseUrl}/address/${to}`} target="_blank">
        {toScholar?.name ?? shortAddress}
      </Link>
    );
  }, [actionType, explorerBaseUrl, scholars, transaction]);

  const txValue = useMemo(() => {
    const { input } = transaction;
    const iface = new ethers.utils.Interface(abi);

    if (actionType === 'Transfer SLP') {
      const data = iface.decodeFunctionData('transfer', input);
      const value = ethers.utils.formatUnits(data._value, 'wei');
      return (
        <HStack spacing={1}>
          <Image src="/images/axies/slp.png" width="14px" alt="slp" />
          <Text>{value}</Text>
        </HStack>
      );
    }

    if ((actionType === 'Transfer ETH' || actionType === 'Transfer AXS') && transaction.status) {
      const data = iface.decodeFunctionData('transfer', input);
      const value = Math.round(Number(ethers.utils.formatEther(data._value)) * 10000) / 10000;
      const coin = actionType === 'Transfer ETH' ? 'eth' : 'axs';
      return (
        <HStack spacing={1}>
          <Image src={`/images/axies/${coin}.png`} width="16px" alt="slp" />
          <Text>{value}</Text>
        </HStack>
      );
    }

    if (actionType === 'Withdraw SLP') {
      const data = iface.decodeFunctionData('withdrawERC20For', input);
      const value = ethers.utils.formatUnits(data._amount, 'wei');
      return (
        <HStack spacing={1}>
          <Image src="/images/axies/slp.png" width="14px" alt="slp" />
          <Text>{value}</Text>
        </HStack>
      );
    }

    if ((actionType === 'Withdraw ETH' || actionType === 'Withdraw AXS') && transaction.status) {
      const data = iface.decodeFunctionData('withdrawERC20For', input);
      const value = Math.round(Number(ethers.utils.formatEther(data._amount)) * 10000) / 10000;
      const coin = actionType === 'Withdraw ETH' ? 'eth' : 'axs';
      return (
        <HStack spacing={1}>
          <Image src={`/images/axies/${coin}.png`} width="16px" alt="slp" />
          <Text>{value}</Text>
        </HStack>
      );
    }

    if (actionType === 'Transfer Axie' && transaction.status) {
      const [, , hexId] = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const id = parseInt(hexId, 10);

      return <AxieTag id={id} />;
    }

    if (actionType === 'Breed Axie' && transaction.status) {
      const [sireHexId, matronHexId] = ethers.utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const sireId = parseInt(sireHexId, 10);
      const matronId = parseInt(matronHexId, 10);

      return (
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <AxieTag id={sireId} />

          <Text>+</Text>

          <AxieTag id={matronId} />
        </Stack>
      );
    }

    if (actionType === 'Morph Axie' && transaction.status) {
      const [idHex] = ethers.utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const id = parseInt(idHex, 10);

      return <AxieTag id={id} />;
    }

    if (actionType === 'Batch Morph Axies' && transaction.status) {
      const [idsHex] = ethers.utils.defaultAbiCoder.decode(
        ['uint256[]', 'uint256[]'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const ids = idsHex.map(idHex => parseInt(idHex, 10)) as number[];

      return (
        <HStack>
          <AxieTag id={ids[0]} />

          {ids.length > 1 && (
            <Popover isLazy>
              <PopoverTrigger>
                <Tag cursor="pointer">+{ids.length - 1}</Tag>
              </PopoverTrigger>

              <PopoverContent w="100%">
                <PopoverBody>
                  <Stack>
                    {ids.slice(1).map(id => (
                      <AxieTag key={id} id={id} />
                    ))}
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </HStack>
      );
    }

    if (actionType === 'Buy Axie' && transaction.status) {
      const id = parseInt(transaction.logs[0]?.topics[3], 16);
      const { data: dataFee } = transaction.logs[1];
      const { data: dataPay } = transaction.logs[2];

      const pay = parseInt(dataPay, 16);
      const fee = parseInt(dataFee, 16);

      const value = Math.round(((pay + fee) / 10 ** 18) * 10000) / 10000;

      return (
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <HStack spacing={1}>
            <Image src="/images/axies/eth.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>

          <AxieTag id={id} />
        </Stack>
      );
    }

    if (actionType === 'Create Axie Sale' && transaction.status) {
      const [, , hexId, starting, ending] = ethers.utils.defaultAbiCoder.decode(
        ['uint8[]', 'address[]', 'uint256[]', 'uint256[]', 'uint256[]', 'address[]', 'uint256[]'],
        ethers.utils.hexDataSlice(transaction.input, 4)
      );

      const id = parseInt(hexId, 10);
      const [startingValue, endingValue] = [
        Math.round((parseInt(starting, 10) / 10 ** 18) * 1000) / 1000,
        Math.round((parseInt(ending, 10) / 10 ** 18) * 1000) / 1000,
      ];

      const value = `${startingValue} - ${endingValue}`;

      return (
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <HStack spacing={1}>
            <Image src="/images/axies/eth.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>

          <AxieTag id={id} />
        </Stack>
      );
    }

    try {
      if (actionType === 'Claim SLP' && transaction.status) {
        const { data } = transaction.logs[0];
        const value = parseInt(data, 16);
        return (
          <HStack spacing={1}>
            <Image src="/images/axies/slp.png" width="14px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Stake AXS' && transaction.status) {
        const { data } = transaction.logs?.length === 2 ? transaction.logs[0] : transaction.logs[1];
        const value = Math.round((parseInt(data, 16) / 10 ** 18) * 1000) / 1000;
        return (
          <HStack spacing={1}>
            <Image src="/images/axies/axs.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Unstake AXS' && transaction.status) {
        const [amount] = ethers.utils.defaultAbiCoder.decode(
          ['uint256'],
          ethers.utils.hexDataSlice(transaction.input, 4)
        );
        const value = Math.round((amount / 10 ** 18) * 1000) / 1000;

        return (
          <HStack spacing={1}>
            <Image src="/images/axies/axs.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Claim AXS' && transaction.status) {
        const { data } = transaction.logs[transaction.logs.length - 3];
        const value = Math.round((parseInt(data, 16) / 10 ** 18) * 1000) / 1000;
        return (
          <HStack spacing={1}>
            <Image src="/images/axies/axs.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Restake Rewards' && transaction.status) {
        const { data } = transaction.logs[transaction.logs.length - 2];
        const value = Math.round((parseInt(data, 16) / 10 ** 18) * 1000) / 1000;
        return (
          <HStack spacing={1}>
            <Image src="/images/axies/axs.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Buy Axie' && transaction.status) {
        const { data } = transaction.logs[2];
        const value = Math.round((parseInt(data, 16) / 10 ** 18) * 1000) / 1000;
        return (
          <HStack spacing={1}>
            <Image src="/images/axies/eth.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }

      if (actionType === 'Create Axie Sale' && transaction.status) {
        const [, , , starting, ending] = ethers.utils.defaultAbiCoder.decode(
          ['uint8[]', 'address[]', 'uint256[]', 'uint256[]', 'uint256[]', 'address[]', 'uint256[]'],
          ethers.utils.hexDataSlice(transaction.input, 4)
        );

        const [startingValue, endingValue] = [
          Math.round((parseInt(starting, 10) / 10 ** 18) * 1000) / 1000,
          Math.round((parseInt(ending, 10) / 10 ** 18) * 1000) / 1000,
        ];

        const value = `${startingValue} - ${endingValue}`;

        return (
          <HStack spacing={1}>
            <Image src="/images/axies/eth.png" width="16px" alt="slp" />
            <Text>{value}</Text>
          </HStack>
        );
      }
    } catch (error) {
      console.log(transaction, error);
    }

    return '';
  }, [actionType, transaction]);

  const transactionDate = dayjs.unix(transaction.timestamp).format('DD MMM YYYY, HH:mm:ss');
  const transactionAgeRelative = dayjs.unix(transaction.timestamp).fromNow();

  return (
    <Tr>
      <Td>
        <Link href={`${explorerBaseUrl}/address/${transaction.from}`} target="_blank">
          <Text fontWeight="bold">{isManager ? 'Manager' : scholar?.name}</Text>
        </Link>
      </Td>

      <Td>
        <Link href={`${explorerBaseUrl}/tx/${transaction.hash}`} target="_blank">
          <Text>
            {transaction.hash.substr(0, 8)}...
            {transaction.hash.substr(transaction.hash.length - 4)}
          </Text>
        </Link>
      </Td>

      <Td>
        <Tooltip label={transactionDate}>
          <Text>{transactionAgeRelative}</Text>
        </Tooltip>
      </Td>

      <Td>{actionComponent}</Td>

      <Td>{txValue}</Td>

      <Td>
        <HStack spacing={5}>
          <Link href={`${explorerBaseUrl}/address/${transaction.from}`} target="_blank">
            <Text minW="100px">{fromAddress}</Text>
          </Link>

          <BsArrowRight />

          {toAddress}
        </HStack>
      </Td>

      <Td>{statusIcon}</Td>
    </Tr>
  );
};

export const TransactionTableEntry = dynamic(() => Promise.resolve(TransactionTableEntryComponent), { ssr: false });
