'use client';

import { useWallet } from '@txnlab/use-wallet';
import { AlgoDidClient } from '@/artifacts/algo-did-client';
import * as nobleEd25519 from '@noble/ed25519';
import algosdk from 'algosdk';
import { useCallback } from 'react';
import { getAlgoClientConfig, getAlgodClient } from '@/utils/get-algo-client-config';
import * as algokit from '@algorandfoundation/algokit-utils';
import {
  CreateDiDDocumentDto,
  DidDocument,
  DidMetadata,
  MassUploadChunksDto,
  UploadDiDDocumentDto,
  UploadDidBoxDto,
} from '@/interface/did.interface';
import {
  calculateTotalCostOfUploadingDidDocument,
  resolveDidIntoComponents,
} from '@/utils/algo-did-utils';
import { BYTES_PER_CALL, MAX_BOX_SIZE } from '@/constants/algo-did.constant';
import { AlgoDIDStatus } from '@/enums/algo-did.enum';
import { useClient } from '@/hooks/use-client';

export const useAlgoDidActions = () => {
  const { activeAddress, signer, signTransactions } = useWallet();
  const { config } = getAlgoClientConfig();
  const client = useClient();
  const algodClient = getAlgodClient();

  const deploySmartContract = useCallback(async () => {
    if (!activeAddress || !signer) {
      throw new Error('No wallet connected');
    }

    const sender = { signer, addr: activeAddress };

    const appClient = new AlgoDidClient(
      {
        resolveBy: 'id',
        id: 0,
        sender,
      },
      algodClient,
    );

    const response = await appClient.create.createApplication({}, {});

    return response;
  }, [activeAddress, signer]);

  const createDidDocument = useCallback(
    async ({ appId }: CreateDiDDocumentDto) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      // Get wallet address public key
      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;
      const publicKeyHex = Buffer.from(publicKey).toString('hex');

      // Generate the base identifier (DID)
      const subject = `${config.algod.network}:app:${appId}:${publicKeyHex}`;
      const did = `did:algo:${subject}`;

      const didDocument: DidDocument = {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/ed25519-2020/v1',
          'https://w3id.org/security/suites/x25519-2020/v1',
        ],
        id: did,
        verificationMethod: [
          {
            id: `${did}#master`,
            type: 'Ed25519VerificationKey2020',
            controller: did,
          },
        ],
        authentication: [`${did}#master`],

        // Add custom metadata like the username or email
        // service: [
        //   {
        //     id: `${did}#username`,
        //     type: 'UserProfile',
        //     serviceEndpoint: { username: 'alice' },
        //   },
        //   {
        //     id: `${did}#email`,
        //     type: 'UserEmail',
        //     serviceEndpoint: { email: 'alice@gmail.org' },
        //   },
        // ],
      };

      return didDocument;
    },
    [activeAddress, signer],
  );

  const startDidDocumentUpload = useCallback(
    async ({ document, appId }: UploadDiDDocumentDto) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const documentBuffer = Buffer.from(JSON.stringify(document));
      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const { totalCost, numberOfBoxes, endBoxSize } =
        calculateTotalCostOfUploadingDidDocument(documentBuffer);
      const appAddress = (await appClient.appClient.getAppReference()).appAddress;
      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;

      const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: appAddress,
        amount: totalCost,
        suggestedParams: await algodClient.getTransactionParams().do(),
      });

      const response = await appClient.startUpload(
        {
          pubKey: activeAddress,
          numBoxes: numberOfBoxes,
          endBoxSize: endBoxSize,
          mbrPayment,
        },
        {
          sendParams: {
            suppressLog: true,
          },
          boxes: [
            {
              appIndex: Number(appId),
              name: publicKey,
            },
          ],
        },
      );

      return response;
    },
    [activeAddress, signer],
  );

  const uploadDidDocument = useCallback(
    async ({ document, appId }: UploadDiDDocumentDto) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const appAddress = (await appClient.appClient.getAppReference()).appAddress;

      const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: appAddress,
        amount: 100_000,
        suggestedParams: await algodClient.getTransactionParams().do(),
      });

      await algokit.sendTransaction(
        {
          transaction: mbrPayment,
          from: sender,
        },
        algodClient,
      );

      const documentBuffer = Buffer.from(JSON.stringify(document));
      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;

      const boxIndices = (await appClient.appClient.getBoxValueFromABIType(
        publicKey,
        algosdk.ABIType.from('(uint64,uint64,uint8,uint64,uint64)'),
      )) as BigInt[];

      const metadata = {
        start: boxIndices[0],
        end: boxIndices[1],
        status: boxIndices[2],
        endSize: boxIndices[3],
      };

      const numOfBoxes = Math.floor(documentBuffer.byteLength / MAX_BOX_SIZE);
      const boxData: Buffer[] = [];

      for (let i = 0; i < numOfBoxes; i++) {
        const box = documentBuffer.subarray(i * MAX_BOX_SIZE, (i + 1) * MAX_BOX_SIZE);
        boxData.push(box);
      }

      const lastBox = documentBuffer.subarray(numOfBoxes * MAX_BOX_SIZE, documentBuffer.byteLength);
      boxData.push(lastBox);

      if (Buffer.concat(boxData).toString('hex') !== documentBuffer.toString('hex')) {
        throw new Error('Box data does not match the document');
      }

      const txIds: string[] = [];

      for (let boxIndexOffset = 0; boxIndexOffset < boxData.length; boxIndexOffset++) {
        const box = boxData[boxIndexOffset];

        const newRes = await uploadDidBox({
          box,
          boxIndexOffset: boxIndexOffset,
          metadata,
          appId: Number(appId),
          algoDidClient: appClient,
          sender,
          publicKey,
        });

        txIds.push(...newRes);
      }

      return { txIds };
    },
    [activeAddress, signer],
  );

  const uploadDidBox = useCallback(async (dto: UploadDidBoxDto) => {
    const { box, boxIndexOffset, metadata, appId, algoDidClient, sender, publicKey } = dto;

    const boxIndex = BigInt(Number(metadata.start) + boxIndexOffset);
    const numOfChunks = Math.ceil(box.byteLength / BYTES_PER_CALL);

    const chunks: Buffer[] = [];

    for (let i = 0; i < numOfChunks; i += 1) {
      chunks.push(box.subarray(i * BYTES_PER_CALL, (i + 1) * BYTES_PER_CALL));
    }

    const boxRef = { appIndex: Number(appId), name: algosdk.encodeUint64(boxIndex) };
    const boxes: algosdk.BoxReference[] = new Array(7).fill(boxRef);
    boxes.push({ appIndex: Number(appId), name: publicKey });

    const firstGroup = chunks.slice(0, 8);
    const secondGroup = chunks.slice(8);

    const res = await massUploadChunks({
      chunks: firstGroup,
      boxIndex: Number(boxIndex),
      boxes,
      appId,
      algoDidClient,
      sender,
      publicKey,
      bytesOffset: 0,
    });

    if (secondGroup.length === 0) return res.txIDs;

    const res2 = await massUploadChunks({
      chunks: secondGroup,
      boxIndex: Number(boxIndex),
      boxes,
      appId,
      algoDidClient,
      sender,
      publicKey,
      bytesOffset: 8,
    });

    return [...res.txIDs, ...res2.txIDs];
  }, []);

  const massUploadChunks = useCallback(async (dto: MassUploadChunksDto) => {
    const { chunks, boxIndex, boxes, appId, algoDidClient, sender, publicKey, bytesOffset } = dto;

    const atc = new algosdk.AtomicTransactionComposer();
    const abiMethod = algoDidClient.appClient.getABIMethod('upload');
    const suggestedParams = await algodClient.getTransactionParams().do();

    chunks.forEach((chunk, index) => {
      atc.addMethodCall({
        method: abiMethod!,
        methodArgs: [publicKey, boxIndex, BYTES_PER_CALL * (index + bytesOffset), chunk],
        boxes,
        suggestedParams,
        sender: sender.addr,
        signer: sender.signer,
        appID: Number(appId),
      });
    });

    return atc.execute(algodClient, 3);
  }, []);

  const getDidMetaData = useCallback(
    async (appId: string, address?: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };
      const publicKey = algosdk.decodeAddress(address || activeAddress).publicKey;

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const boxIndices = (await appClient.appClient.getBoxValueFromABIType(
        publicKey,
        algosdk.ABIType.from('(uint64,uint64,uint8,uint64,uint64)'),
      )) as BigInt[];

      const metadata: DidMetadata = {
        start: boxIndices[0],
        end: boxIndices[1],
        status: boxIndices[2],
        endSize: boxIndices[3],
      };

      return metadata;
    },
    [activeAddress, signer],
  );

  const finishDidDocumentUpload = useCallback(
    async (appId: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;

      const response = await appClient.finishUpload(
        {
          pubKey: activeAddress,
        },
        {
          sendParams: {
            suppressLog: true,
          },
          boxes: [
            {
              appIndex: Number(appId),
              name: publicKey,
            },
          ],
        },
      );

      return response;
    },
    [activeAddress, signer],
  );

  const prepareForDocumentDelete = useCallback(
    async (appId: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;

      const response = await appClient.startDelete(
        {
          pubKey: activeAddress,
        },
        {
          sendParams: {
            suppressLog: true,
          },
          boxes: [
            {
              appIndex: Number(appId),
              name: publicKey,
            },
          ],
        },
      );

      return response;
    },
    [activeAddress, signer],
  );

  const deleteDocument = useCallback(
    async (appId: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const publicKey = algosdk.decodeAddress(activeAddress).publicKey;
      const metadata = await getDidMetaData(appId);

      const suggestedParams = await algodClient.getTransactionParams().do();
      const atomicTxnComposers: algosdk.AtomicTransactionComposer[] = [];

      for (let boxIndex = Number(metadata.start); boxIndex <= Number(metadata.end); boxIndex++) {
        const atomicTxnComposer = new algosdk.AtomicTransactionComposer();
        const boxIndexRef = {
          appIndex: Number(appId),
          name: algosdk.encodeUint64(boxIndex),
        };

        atomicTxnComposer.addMethodCall({
          appID: Number(appId),
          method: appClient.appClient.getABIMethod('deleteData')!,
          methodArgs: [publicKey, BigInt(boxIndex)],
          boxes: [
            { appIndex: Number(appId), name: publicKey },
            ...Array.from({ length: 7 }).map(() => boxIndexRef),
          ],
          suggestedParams: { ...suggestedParams, fee: 2_000, flatFee: true },
          sender: sender.addr,
          signer: sender.signer,
        });

        Array.from({ length: 4 }).forEach((i) => {
          atomicTxnComposer.addMethodCall({
            appID: Number(appId),
            method: appClient.appClient.getABIMethod('dummy')!,
            methodArgs: [],
            boxes: Array.from({ length: 8 }).map(() => boxIndexRef),
            suggestedParams,
            sender: sender.addr,
            signer: sender.signer,
            note: new Uint8Array(Buffer.from(`dummy ${Math.random() * 100000}`)),
          });
        });

        atomicTxnComposers.push(atomicTxnComposer);
      }

      const txIds: string[] = [];
      for await (const atomicTxnComposer of atomicTxnComposers) {
        const res = await atomicTxnComposer.execute(algodClient, 3);
        txIds.push(...res.txIDs);
      }

      return { txIds };
    },
    [activeAddress, signer],
  );

  const resolveDidByAppId = useCallback(
    async (appId: string, address?: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };

      const appClient = new AlgoDidClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender,
        },
        algodClient,
      );

      const res = await algokit.getAppById(Number(appId), algodClient);
      const metadata = await getDidMetaData(appId, address || res.params.creator);

      if (metadata.status === AlgoDIDStatus.DELETING) {
        throw new Error('DID Document is still being deleted');
      }

      if (metadata.status === AlgoDIDStatus.UPLOADING) {
        throw new Error('DID Document is still being uploaded');
      }

      const boxValues: Uint8Array[] = [];

      for (let boxIndex = Number(metadata.start); boxIndex <= Number(metadata.end); boxIndex++) {
        const boxValue = await appClient.appClient.getBoxValue(
          algosdk.encodeUint64(BigInt(boxIndex)),
        );
        boxValues.push(boxValue);
      }

      const documentBuffer = Buffer.concat(boxValues);

      try {
        return JSON.parse(documentBuffer.toString('utf-8')) as DidDocument;
      } catch (error) {
        throw new Error(`Invalid DID Document content: ${documentBuffer.toString('utf-8')}`);
      }
    },
    [activeAddress, signer],
  );

  const resolveDid = useCallback(
    async (did: string) => {
      const { network, appId, publicKey: publicKeyHex } = resolveDidIntoComponents(did);

      const buffer = Buffer.from(publicKeyHex, 'hex');
      const publicKey = new Uint8Array(buffer);
      const address = algosdk.encodeAddress(publicKey);

      if (config.algod.network !== network) {
        throw new Error(`Invalid DID network. Expected ${config.algod.network}, got ${network}`);
      }

      const res = await algokit.getAppById(Number(appId), algodClient);

      if (address !== res.params.creator) {
        const creatorKey = algosdk.decodeAddress(res.params.creator).publicKey;
        const creatorKeyHex = Buffer.from(creatorKey).toString('hex');

        throw new Error(`Invalid DID public key. Expected ${creatorKeyHex}, got ${publicKeyHex}`);
      }

      return resolveDidByAppId(String(appId), address);
    },
    [activeAddress, signer],
  );

  const resolveDidUsingExternalApi = async (did: string) => {
    const response = await client.get(
      `https://dev.uniresolver.io/1.0/identifiers/${encodeURIComponent(did)}`,
      undefined,
      { overrideDefaultBaseUrl: true },
    );

    if (response.data) {
      return response.data as DidDocument;
    }

    throw new Error(response.error);
  };

  const verifyOwnershipOfDid = useCallback(
    async (did: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };
      const didDocument = await resolveDid(did);
      const { publicKey: didPublicHex } = resolveDidIntoComponents(didDocument.id);

      // Encode note for auth txn
      const encoder = new TextEncoder();
      const dataToSign = `text to decode - ${Date.now()}`;
      const encodedData = encoder.encode(dataToSign);

      // create txn
      const suggestedParams = await algodClient.getTransactionParams().do();
      const authTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: sender.addr,
        amount: 0,
        suggestedParams: {
          ...suggestedParams,
          fee: 0,
          flatFee: true,
        },
        note: encodedData,
      });

      // encode and sign auth txn
      const encodedTx = authTxn.toByte();
      const signedTxn = (await signTransactions([encodedTx], [0]))[0];

      // Signed txn can be converted to base64 and sent to a backend for validation
      // refer to commented code
      const signedTxnBase64 = Buffer.from(signedTxn).toString('base64'); // signed txn to base64
      const newRes = new Uint8Array(Buffer.from(signedTxnBase64, 'base64'));
      const decodedSingedTxnFrombase64 = algosdk.decodeSignedTransaction(Buffer.from(newRes));

      // decode signed txn
      const decodedSignedTxn = algosdk.decodeSignedTransaction(Buffer.from(signedTxn));

      // algo sdk verification
      const from = algosdk.encodeAddress(decodedSignedTxn.txn!.from.publicKey);
      const to = algosdk.encodeAddress(decodedSignedTxn.txn!.to.publicKey);
      const noteFromTxn = new TextDecoder().decode(decodedSignedTxn.txn!.note);

      if (from !== to) {
        throw new Error(
          'Signed transaction sender and receiver does not match the provided auth transaction',
        );
      }

      if (noteFromTxn !== dataToSign) {
        throw new Error('Signed transaction note does not match the provided auth transaction');
      }

      const isValid = await nobleEd25519.verifyAsync(
        decodedSignedTxn.sig!,
        decodedSignedTxn.txn!.bytesToSign(),
        new Uint8Array(Buffer.from(didPublicHex, 'hex')),
      );

      return isValid;
    },
    [activeAddress, signer],
  );

  const createdDidVerificationTxn = useCallback(
    async (did: string) => {
      if (!activeAddress || !signer) {
        throw new Error('No wallet connected');
      }

      const sender = { signer, addr: activeAddress };
      const didDocument = await resolveDid(did);
      const { publicKey: didPublicHex } = resolveDidIntoComponents(didDocument.id);

      // Encode note for auth txn
      const encoder = new TextEncoder();
      const dataToSign = process.env.NEXT_PUBLIC_AUTH_TXN_NOTE || 'DiD auth transaction note';
      const encodedData = encoder.encode(dataToSign);

      // create txn
      const suggestedParams = await algodClient.getTransactionParams().do();
      const authTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: sender.addr,
        amount: 0,
        suggestedParams: {
          ...suggestedParams,
          fee: 0,
          flatFee: true,
        },
        note: encodedData,
      });

      // encode and sign auth txn
      const encodedTx = authTxn.toByte();
      const signedTxn = (await signTransactions([encodedTx], [0]))[0];

      // Signed txn can be converted to base64 and sent to a backend for validation
      // refer to commented code
      const signedTxnBase64 = Buffer.from(signedTxn).toString('base64'); // signed txn to base64

      return {
        document: didDocument,
        authTransaction: signedTxnBase64,
      };
    },
    [activeAddress, signer],
  );

  return {
    deploySmartContract,
    createDidDocument,
    startDidDocumentUpload,
    uploadDidDocument,
    getDidMetaData,
    finishDidDocumentUpload,
    prepareForDocumentDelete,
    deleteDocument,
    resolveDidByAppId,
    resolveDid,
    verifyOwnershipOfDid,
    resolveDidUsingExternalApi,
    createdDidVerificationTxn,
  };
};
