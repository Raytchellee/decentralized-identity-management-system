export interface KMDClientConfig {
  token: string;
  server: string;
  port: string;
  wallet: string;
  password: string;
}

export interface AlgodClientConfig {
  token: string;
  server: string;
  port: string;
  network: 'mainnet' | 'testnet' | 'localnet';
}

export interface IndexerClientConfig {
  token: string;
  server: string;
  port: string;
}

export type NetworkEnvironment = 'LocalNet' | 'TestNet' | 'MainNet';

export interface ClientConfig {
  kmd: KMDClientConfig;
  algod: AlgodClientConfig;
  indexer: IndexerClientConfig;
}

export type ClientConfigRecord = Record<NetworkEnvironment, ClientConfig>;
