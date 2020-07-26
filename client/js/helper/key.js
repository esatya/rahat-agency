const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

async function key() {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = await hdkey.fromMasterSeed(seed);

  const addrNode = await root.derive("m/44'/60'/0'/0/0"); // line 1

  const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
  let addr = ethUtil.publicToAddress(pubKey).toString('hex');
  addr = `0x${addr}`;
  const pk = `0x${addrNode._privateKey.toString('hex')}`;
  // console.log("mnemonic:", mnemonic);
  // console.log("address:", addr);
  // console.log("private key:", pk);

  return { mnemonic, addr, pk };
}

export { key };
