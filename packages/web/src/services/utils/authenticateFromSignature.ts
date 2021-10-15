import { ethers } from 'ethers';
import { gql } from 'graphql-request';

import { axieInfinityGraphQl } from '../api';

interface AuthenticateFromSignatureParams {
  address: string;
  privateKey: string;
}

interface AuthenticateFromSignatureResponse {
  result: boolean;
  accessToken: string;
}

export async function authenticateFromSignature({
  address,
  privateKey,
}: AuthenticateFromSignatureParams): Promise<AuthenticateFromSignatureResponse> {
  const createRandomMessageQuery = gql`
    mutation CreateRandomMessage {
      createRandomMessage
    }
  `;

  const createAccessTokenQuery = gql`
    mutation CreateAccessTokenWithSignature($input: SignatureInput!) {
      createAccessTokenWithSignature(input: $input) {
        result
        accessToken
      }
    }
  `;

  const { createRandomMessage } = await axieInfinityGraphQl.request(createRandomMessageQuery);

  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(createRandomMessage);

  const { createAccessTokenWithSignature } = await axieInfinityGraphQl.request(createAccessTokenQuery, {
    input: {
      mainnet: 'ronin',
      message: createRandomMessage,
      owner: address,
      signature,
    },
  });

  return createAccessTokenWithSignature;
}
