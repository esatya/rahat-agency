async function signTransaction(web3, payload) {
  try {
    const tx = await web3.eth.signTransaction({
      from: payload.from,
      gasPrice: payload.gasPrice,
      gas: payload.gas,
      to: payload.to,
      value: payload.value,
      data: payload.data,
    });
    return tx;
  } catch (e) {
    return e;
  }
}

export { signTransaction };
