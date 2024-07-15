import { ref } from 'vue';

import {
  type BtcWalletConnectOptions,
  Balance,
  BtcWalletNetwork,
  BtcConnectorId,
} from './type';
import BtcWalletConnect, { Connector } from 'btc-connect';

declare global {
  interface Window {
    btcWallet: any;
  }
}

export function useWalletStore() {
  // State
  const btcWallet = ref<BtcWalletConnect | undefined>();
  const balance = ref<Balance>({ confirmed: 0, unconfirmed: 0, total: 0 });
  const publicKey = ref<string>('');
  const address = ref<string>('');
  const connected = ref<boolean>(false);
  const initStatus = ref<boolean>(false);
  const modalVisible = ref<boolean>(false);
  const network = ref<BtcWalletNetwork>('livenet');
  const connectorId = ref<BtcConnectorId | undefined>();
  const localConnectorId = ref<BtcConnectorId | undefined>();
  const connector = ref<Connector | undefined>();
  const connectors = ref<
    | Array<{
        id: BtcConnectorId;
        name: string;
        logo: string;
        connector: any;
        installed: boolean;
      }>
    | undefined
  >();

  // Actions
  const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
  };

  const init = (config: BtcWalletConnectOptions = {}) => {
    try {
      const {
        network: configNetwork = 'livenet',
        defaultConnectorId = 'unisat',
      } = config;
      const wallet = new BtcWalletConnect(config);
      window.btcWallet = wallet;
      btcWallet.value = wallet;
      network.value = configNetwork;
      connectorId.value = defaultConnectorId;
      connector.value = wallet.connector;
      localConnectorId.value = wallet.localConnectorId;
      connectors.value = wallet.connectors.map((con) => ({
        id: con.id as BtcConnectorId,
        name: con.instance.name,
        logo: con.instance.logo,
        connector: con.instance,
        installed: con.installed,
      }));
      initStatus.value = true;
    } catch (error) {
      console.error('Error initializing Wallet', error);
      initStatus.value = false;
      throw error;
    }
  };

  const switchConnector = (id: BtcConnectorId) => {
    if (!btcWallet.value) {
      throw new Error('Wallet not initialized');
    }
    btcWallet.value.switchConnector(id);
    connectorId.value = id;
    connector.value = btcWallet.value.connector;
    localConnectorId.value = btcWallet.value.localConnectorId;
  };

  const check = async () => {
    try {
      if (!btcWallet.value) {
        throw new Error('Wallet not initialized');
      }
      await btcWallet.value.check();
      if (btcWallet.value?.address) {
        address.value = btcWallet.value.address;
      }
      if (btcWallet.value?.publicKey) {
        publicKey.value = btcWallet.value.publicKey;
      }
      balance.value = btcWallet.value.balance;
      connected.value = btcWallet.value.connected;
      network.value = btcWallet.value.network;
      localConnectorId.value = btcWallet.value.localConnectorId;
    } catch (error) {
      console.error('Error checking Wallet', error);
      throw error;
    }
  };

  const connect = async () => {
    try {
      if (!btcWallet.value) {
        throw new Error('Wallet not initialized');
      }
      await btcWallet.value.connect();
      if (btcWallet.value?.address) {
        address.value = btcWallet.value.address;
      }
      if (btcWallet.value?.publicKey) {
        publicKey.value = btcWallet.value.publicKey;
      }
      balance.value = btcWallet.value.balance;
      connected.value = btcWallet.value.connected;
      network.value = btcWallet.value.network;
      localConnectorId.value = btcWallet.value.localConnectorId;
    } catch (error) {
      console.error('Error connecting Wallet', error);
      throw error;
    }
  };

  const disconnect = async () => {
    if (!btcWallet.value) {
      throw new Error('Wallet not initialized');
    }
    await btcWallet.value.disconnect();
    balance.value = { confirmed: 0, unconfirmed: 0, total: 0 };
    connectorId.value = undefined;
    publicKey.value = '';
    address.value = '';
    initStatus.value = false;
    connected.value = false;
    network.value = 'livenet';
  };

  const switchNetwork = async () => {
    try {
      if (!btcWallet.value) {
        throw new Error('Wallet not initialized');
      }
      const newNetwork = network.value === 'testnet' ? 'livenet' : 'testnet';
      await btcWallet.value.switchNetwork(newNetwork as any);
      network.value = await btcWallet.value.getNetwork();
      if (btcWallet.value?.address) {
        address.value = btcWallet.value.address;
      }
      if (btcWallet.value?.publicKey) {
        publicKey.value = btcWallet.value.publicKey;
      }
      balance.value = btcWallet.value.balance;
      connected.value = btcWallet.value.connected;
      localConnectorId.value = btcWallet.value.localConnectorId;
    } catch (error) {
      console.error('Error switching network', error);
      throw error;
    }
  };

  return {
    btcWallet,
    balance,
    publicKey,
    address,
    connected,
    initStatus,
    modalVisible,
    network,
    connectorId,
    localConnectorId,
    connector,
    connectors,
    setModalVisible,
    init,
    switchConnector,
    check,
    connect,
    disconnect,
    switchNetwork,
  };
}