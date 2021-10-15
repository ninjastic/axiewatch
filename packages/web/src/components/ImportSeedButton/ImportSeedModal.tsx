import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';

import { allScholarsSelector, ScholarSelector } from '../../recoil/scholars';
import { Address, derivateFromSeed } from '../../services/utils/derivateFromSeed';
import { ImportForm } from './ImportForm';
import { ImportPrivateKeyList } from './ImportPrivateKeyList';

interface FormData {
  walletSeed: string;
  derivationPath: string;
  maxDepth: number;
}

interface Match {
  scholar: ScholarSelector;
  wallet: Address;
}

interface ImportSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportSeedModal = ({ isOpen, onClose }: ImportSeedModalProps): JSX.Element => {
  const scholars = useRecoilValue(allScholarsSelector);

  const [matches, setMatches] = useState([] as Match[]);

  useEffect(() => {
    if (!isOpen) {
      setMatches([]);
    }
  }, [isOpen]);

  const handleSubmit = (data: FormData) => {
    try {
      const addresses = derivateFromSeed({
        seed: data.walletSeed,
        derivationPath: data.derivationPath,
        maxDepth: data.maxDepth,
      });

      const results = scholars
        .map(scholar => {
          const foundMatchingWallet = addresses.find(
            address => address.address.toLowerCase() === scholar.address.toLowerCase()
          );

          if (foundMatchingWallet) {
            return {
              scholar,
              wallet: foundMatchingWallet,
            };
          }

          return null;
        })
        .filter(value => value) as Match[];

      if (!results.length) {
        toast('No matching private-keys from this seed.', {
          type: 'info',
        });
      }

      setMatches(results);
    } catch (error: any) {
      toast(error.message, {
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          <Text>Import Seed</Text>
        </ModalHeader>

        <ModalBody>
          <Box py={5} px={2}>
            {matches.length ? (
              <ImportPrivateKeyList data={matches} onClose={onClose} />
            ) : (
              <ImportForm onSubmit={handleSubmit} />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
