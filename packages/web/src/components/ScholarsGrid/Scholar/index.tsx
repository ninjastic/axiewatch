import { useBreakpointValue } from '@chakra-ui/react';

import { useScholar } from '../../../services/hooks/useScholar';
import { ScholarCard } from './Card';
import { ScholarListItem } from './ScholarListItem/ScholarListItem';

interface AxieCardParams {
  address: string;
}

export const Scholar = ({ address }: AxieCardParams): JSX.Element => {
  const { isLoading, isError, isRefetching, refetch } = useScholar({ address });

  const isWideVersion = useBreakpointValue(
    {
      xl: true,
    },
    'xl'
  );

  if (isWideVersion) {
    return (
      <ScholarListItem address={address} isLoading={isLoading || isRefetching} isError={isError} refetch={refetch} />
    );
  }

  return <ScholarCard address={address} isLoading={isLoading || isRefetching} isError={isError} refetch={refetch} />;
};
