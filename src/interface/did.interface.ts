import { AlgoDidClient } from '@/artifacts/algo-did-client';
import algosdk from 'algosdk';

export interface CreateDiDDocumentDto {
  appId: string;
}

export interface UploadDiDDocumentDto {
  document: DidDocument;
  appId: string;
}

export interface DidDocument {
  '@context': string[];
  id: string;
  verificationMethod: {
    id: string;
    type: string;
    controller: string;
  }[];
  authentication: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: Record<string, string>;
  }[];
}

export interface DidMetadata {
  start: BigInt;
  end: BigInt;
  status: BigInt;
  endSize: BigInt;
}

export interface UploadDidBoxDto {
  box: Buffer;
  boxIndexOffset: number;
  metadata: DidMetadata;
  appId: number;
  algoDidClient: AlgoDidClient;
  sender: {
    signer: algosdk.TransactionSigner;
    addr: string;
  };
  publicKey: Uint8Array;
}

export interface MassUploadChunksDto {
  chunks: Buffer[];
  boxIndex: number;
  boxes: algosdk.BoxReference[];
  bytesOffset: number;
  appId: number;
  algoDidClient: AlgoDidClient;
  sender: {
    signer: algosdk.TransactionSigner;
    addr: string;
  };
  publicKey: Uint8Array;
}
