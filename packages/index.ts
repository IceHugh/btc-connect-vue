import WalletConnect from './WalletConnect.vue'
import WalletSelectModal from './WalletSelectModal.vue'

import './style.css'
// 按需引入
export { WalletConnect, WalletSelectModal }

console.log('BtcConnectUI', WalletConnect)
const component = [WalletConnect, WalletSelectModal]

const BtcConnectUI = {
  install(App: any) {
    component.forEach((item) => {
      App.component(item.__name as string, item)
    })
  },
}

export default BtcConnectUI
 