import { ALGO_CLIENT_CONFIG } from '@/constants/algo-client-config.constant';
import { ClientConfig, NetworkEnvironment } from '@/interface';
import { PROVIDER_ID, ProvidersArray } from '@txnlab/use-wallet';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

export const getAlgoClientConfig = () => {
  const envEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  let environment: NetworkEnvironment = 'TestNet';

  if (envEnvironment === 'local') {
    environment = 'LocalNet';
  }

  if (envEnvironment === 'production') {
    environment = 'MainNet';
  }

  return {
    environment,
    config: ALGO_CLIENT_CONFIG[environment],
  };
};

export const getWalletProviders = (environment: NetworkEnvironment, config: ClientConfig) => {
  let providersArray: ProvidersArray;

  if (environment === 'LocalNet') {
    const kmdConfig = config.kmd;

    providersArray = [
      {
        id: PROVIDER_ID.KMD,
        clientOptions: {
          wallet: kmdConfig.wallet,
          password: kmdConfig.password,
          host: kmdConfig.server,
          token: String(kmdConfig.token),
          port: String(kmdConfig.port),
        },
      },
    ];
  } else {
    providersArray = [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
      { id: PROVIDER_ID.EXODUS },
    ];
  }

  return providersArray;
};

export const getAlgodClient = () => {
  const { config } = getAlgoClientConfig();
  const algodConfig = config.algod;
  const client = new algosdk.Algodv2(algodConfig.token, algodConfig.server, algodConfig.port);
  return client;
};
