import Dexie from 'dexie';

import { DB } from '../constants';
import { getDefaultNetwork } from '../constants/networks';

const db = new Dexie(DB.NAME);
db.version(DB.VERSION).stores({
  data: 'name,data',
});

export default {
  save(name, data) {
    return db.data.put({ name, data });
  },

  async get(name) {
    let obj = await db.data.get(name);
    if (!obj) return null;
    return obj.data;
  },

  remove(name) {
    return db.data.delete(name);
  },

  list() {
    return db.data.toArray();
  },

  async initAppData() {
    let network = await this.getNetwork();
    let address = await this.getAddress();
    let wallet = await this.getWallet();
    return { network, address, wallet };
  },

  async clearAll() {
    await db.data.clear();
  },

  saveNetwork(network) {
    return this.save('network', network);
  },

  async getNetwork() {
    let network = await this.get('network');
    if (!network) return getDefaultNetwork();
    return network;
  },

  saveAddress(address) {
    localStorage.setItem('address', address);
    return this.save('address', address);
  },

  getAddress() {
    return this.get('address');
  },

  getAddressFromLocal() {
    return localStorage.getItem('address');
  },

  async saveWallet(wallet) {
    return this.save('wallet', wallet);
  },

  getWallet() {
    return this.get('wallet');
  },
};
