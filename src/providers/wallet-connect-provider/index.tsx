'use client';

import { WalletProvider, useInitializeProviders } from '@txnlab/use-wallet'
import { useRecoilState } from 'recoil';
import algosdk from 'algosdk';
import { ConnectWalletVisibleAtom } from '@/state';
import { WalletConnectModal } from '@/components/wallet-connect-modal';
import { getAlgoClientConfig, getWalletProviders } from '@/utils/get-algo-client-config';

interface Props {
  children: React.ReactNode;    
}

export const WalletConnectProvider = ({ children }: Props) => {
  const [connectWalletVisible, setConnectWalletVisible] = useRecoilState(ConnectWalletVisibleAtom);
  const { config, environment } = getAlgoClientConfig();
  const providers = getWalletProviders(environment, config);
  const algodConfig = config.algod;

  const walletProviders = useInitializeProviders({
    providers,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  return (
    <WalletProvider value={walletProviders}>
      {connectWalletVisible && (
        <WalletConnectModal onClose={() => setConnectWalletVisible(false)} />
      )}
      {children}
    </WalletProvider>
  );
};
