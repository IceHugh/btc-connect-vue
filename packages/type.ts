export interface BtcWalletConnectOptions {
  network?: BtcWalletNetwork;
  defaultConnectorId?: BtcConnectorId;
}
export type BtcWalletNetwork = 'livenet' | 'testnet';
export type BtcConnectorId = 'unisat' | 'okx';
export type Balance = { confirmed: number; unconfirmed: number; total: number };