import { ethers } from 'ethers';
import { gql } from 'graphql-request';

import { axieInfinityGraphQl } from '../api';

interface Response {
  profileSearch: Array<{
    name: string;
  }>;
}

interface GetAxieNameFromAddressProps {
  address: string;
}

export const getAxieNameFromAddress = async ({ address }: GetAxieNameFromAddressProps): Promise<string | null> => {
  const getProfileSearchQuery = gql`
    query GetProfileSearch($searchString: String!) {
      profileSearch(searchString: $searchString) {
        ...Profile
      }
    }
    fragment Profile on PublicProfile {
      accountId
      name
      addresses {
        ...Addresses
      }
    }
    fragment Addresses on NetAddresses {
      ethereum
    }
  `;

  const addressWithPrefix = address.replace('0x', 'ronin:');
  const addressWithoutPrefix = address.replace('ronin:', '0x');

  const valid = ethers.utils.isAddress(addressWithoutPrefix);

  if (!valid) {
    return null;
  }

  try {
    const response = await axieInfinityGraphQl.request<Response>(getProfileSearchQuery, {
      searchString: addressWithPrefix,
    });

    const { name } = response.profileSearch[0];

    if (!name) {
      return null;
    }

    return name;
  } catch (error: any) {
    return null;
  }
};
