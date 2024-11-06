import { ClientConfigRecord } from '@/interface';

export const ALGO_CLIENT_CONFIG: ClientConfigRecord = {
  LocalNet: {
    kmd: {
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      server: 'http://localhost',
      port: '4002',
      wallet: 'unencrypted-default-wallet',
      password: '',
    },
    algod: {
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      server: 'http://localhost',
      port: '4001',
      network: 'localnet',
    },
    indexer: {
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      server: 'http://localhost',
      port: '8980',
    },
  },
  TestNet: {
    kmd: {
      token: '',
      server: '',
      port: '',
      wallet: '',
      password: '',
    },
    algod: {
      token: '',
      server: 'https://testnet-api.algonode.cloud',
      port: '',
      network: 'testnet',
    },
    indexer: {
      token: '',
      server: 'https://testnet-idx.algonode.cloud',
      port: '',
    },
  },
  MainNet: {
    kmd: {
      token: '',
      server: '',
      port: '',
      wallet: '',
      password: '',
    },
    algod: {
      token: '',
      server: 'https://mainnet-api.algonode.cloud',
      port: '',
      network: 'mainnet',
    },
    indexer: {
      token: '',
      server: 'https://mainnet-idx.algonode.cloud',
      port: '',
    },
  },
};
