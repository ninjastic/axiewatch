import { useBreakpointValue } from '@chakra-ui/react';

import { ScholarCard } from './Card';
import { ScholarListItem } from './ScholarListItem/ScholarListItem';

interface AxieCardParams {
  address: string;
  isLoading?: boolean;
}

export const Scholar = ({ address, isLoading = false }: AxieCardParams): JSX.Element => {
  const isWideVersion = useBreakpointValue({ xl: true }, 'xl');

  if (isWideVersion) {
    return <ScholarListItem address={address} isLoading={isLoading} />;
  }

  return <ScholarCard address={address} isLoading={isLoading} />;
};
