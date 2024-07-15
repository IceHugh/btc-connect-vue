<template>
  <Teleport to="body" v-if="visible">
    <div class="fixed top-0 left-0 w-screen h-screen" :style="{ zIndex }">
      <div :class="['w-full h-full', theme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-30']"></div>
      <div
        :class="[
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 max-w-[90%] min-h-30 max-h-[full] rounded-xl overflow-hidden',
          theme === 'dark' ? 'text-[#ecedee] bg-[#18181b]' : 'bg-white text-black',
          className
        ]"
      >
        <div :class="['p-4 relative', theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-200']">
          <h2 class="text-xl font-bold text-center ">{{ title }}</h2>
          <button @click="handleClose" class="absolute top-1/2 -translate-y-1/2  right-4 bg-transparent border-none p-0 m-0 text-inherit font-inherit cursor-pointer outline-none">
            <img :src="closeIcon" alt="close" :class="['w-6 h-6', theme === 'dark' ? 'invert' : '']" />
          </button>
        </div>
        <div class="p-4 flex flex-col gap-2">
          <div
            v-for="wallet in wallets"
            :key="wallet.id"
            @click="() => clickHandler(wallet.id, wallet.installed)"
            :class="[
              'h-12 cursor-pointer flex items-center justify-between p-2 gap-2 rounded-lg relative overflow-hidden',
              theme === 'dark' ? 'bg-[#2d2d2d] text-[#ecedee]' : 'bg-gray-100 text-black'
            ]"
          >
            <div v-if="loading" class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
              <img :src="loadingIcon" alt="loading" class="w-6 h-6 animate-spin" />
            </div>
            <div class="flex items-center flex-1">
              <img :src="wallet.logo" :alt="wallet.name" class="w-8 h-8 mr-2" />
              <span class="flex-1">{{ wallet.name }}</span>
            </div>
            <div class="text-xs text-orange-600" v-if="!wallet.installed">
              Not Installed
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { closeIcon, loadingIcon } from './assets/index';

// 定义组件的属性
const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Select Wallet'
  },
  className: String,
  zIndex: {
    type: Number,
    default: 100
  },
  theme: {
    type: String,
    default: 'light'
  },
  wallets: {
    type: Array,
    default: () => []
  }
});

// 定义 emit
const emit = defineEmits(['click', 'close']);

const loading = ref(false);

const handleClose = () => {
  emit('close');
};

const clickHandler = async (id, installed) => {
  if (loading.value || !installed) return;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
  try {
    await emit('click', id);
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

</script>
