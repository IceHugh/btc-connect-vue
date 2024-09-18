<template>
  <div>
    <button @click="handleConnect" v-if="!connected" :class="buttonClass">
      {{ connectText }}
    </button>
    <WalletSelectModal
      v-if="!connected"
      :theme="theme"
      :class="modalClass"
      :zIndex="modalZIndex"
      :title="modalTitle"
      @close="() => setModalVisible(false)"
      :visible="modalVisible"
      :wallets="wallets"
      @click="walletSelect"
    />
    <slot v-else>
      <button @click="handlerDisconnect" :class="disconnectButtonClass">
        <span class="mr-1">{{ hideStr(address, 4, '***') }}</span>
        <!-- <ExitIcon :class="exitIconClass" /> -->
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import WalletSelectModal from './WalletSelectModal.vue';
import { hideStr } from './utils';
import BtcWalletConnect from 'btc-connect';
// import ExitIcon from './ExitIcon.vue';
import { useWalletStore } from './store';
import { BtcWalletConnectOptions, BtcConnectorId } from './type';

// 完成test
//
interface WalletConnectProps {
  config?: BtcWalletConnectOptions;
  theme?: 'light' | 'dark';
  ui?: {
    connectClass?: string;
    disconnectClass?: string;
    modalClass?: string;
    modalZIndex?: number;
  };
  text?: {
    connectText?: string;
    disconnectText?: string;
    modalTitle?: string;
  };
  children?: any;
}

const props = defineProps<WalletConnectProps>();

const emits = defineEmits<{
  (e: 'connect-success', btcWallet: BtcWalletConnect): void;
  (e: 'connect-error', error: any): void;
  (e: 'disconnect-success'): void;
  (e: 'disconnect-error', error: any): void;
}>();
const {
  connect,
  modalVisible,
  setModalVisible,
  connectors,
  connected,
  address,
  init,
  disconnect,
  btcWallet,
  switchConnector,
} = useWalletStore();

const handleConnect = () => {
  setModalVisible(true);
};

const walletSelect = async (id: BtcConnectorId) => {
  switchConnector(id);
  try {
    await connect();
    if (btcWallet) {
      emits('connect-success', btcWallet as any);
      setModalVisible(false);
    }
  } catch (error) {
    console.error(error);
    emits('connect-error', error);
  }
};

const handlerDisconnect = async () => {
  try {
    emits('disconnect-success');
    await disconnect();
  } catch (error) {
    console.error(error);
    emits('disconnect-error', error);
  }
};

const wallets = computed(
  () =>
    connectors.value?.map((c) => ({
      id: c.id,
      name: c.name,
      logo: c.logo,
      installed: c.installed,
    })) || [],
);

const buttonClass = computed(
  () =>
    `bg-clip-text text-transparent border rounded-xl h-10 px-4 leading-none hover:border-yellow-500 ${
      props.theme === 'dark'
        ? 'bg-gradient-to-r from-pink-500 to-violet-500 border-gray-600'
        : 'bg-gradient-to-r from-blue-500 to-green-500 border-gray-300'
    } ${props.ui?.connectClass || ''}`,
);

const disconnectButtonClass = computed(
  () =>
    `bg-clip-text text-transparent border border-gray-300 rounded-xl leading-none h-10 px-4 hover:border-yellow-500 flex justify-center items-center ${
      props.theme === 'dark'
        ? 'bg-gradient-to-r from-pink-500 to-violet-500'
        : 'bg-gradient-to-r from-blue-500 to-green-500'
    } ${props.ui?.disconnectClass || ''}`,
);

// const exitIconClass = computed(
//   () => `${props.theme === 'dark' ? 'text-white' : 'text-black'}`,
// );

const {
  config: { network = 'livenet', defaultConnectorId = 'unisat' } = {},
  theme = 'dark',
  ui: { modalClass = '', modalZIndex = 100 } = {},
  text: { connectText = 'Connect', modalTitle = 'Select Wallet' } = {},
} = props;

onMounted(() => {
  init({ network, defaultConnectorId });
});
</script>

<style scoped>
/* Add your styles here */
</style>
