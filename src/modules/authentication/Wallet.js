import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useQRCode } from 'react-qrcodes';
import { ethers } from 'ethers';
import { useToasts } from 'react-toast-notifications';

import { UserContext } from '../../contexts/UserContext';
import Logo from '../../assets/images/logo-dark.png';

const API_SERVER = process.env.REACT_APP_API_SERVER;
const WSS_SERVER = API_SERVER.replace('http', 'ws');

const Wallet = () => {
  const { addToast } = useToasts();

  const ws = useRef(null);
  const [qroptions, setQrOptions] = useState({});
  const [clientId, setclientId] = useState('');
  const [token, setToken] = useState('');

  const { loginUsingMetamask } = useContext(UserContext);

  const handleMetamaskLogin = async () => {
    try {
      let _sign = await signMessage();
      const payload = { id: clientId, signature: _sign };
      await loginUsingMetamask(payload);
    } catch (e) {
      let error_msg = 'Something went wrong on server!';
      if (e.code === 4001) error_msg = e.message;
      addToast(error_msg, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const getSigner = async () => {
    window.ethereum.enable();
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    return signer;
  };

  const signMessage = async () => {
    const wallet = await getSigner();
    return wallet.signMessage(token);
  };

  const [inputRef] = useQRCode({
    text: JSON.stringify(qroptions),
    options: {
      level: 'M',
      margin: 7,
      scale: 1,
      width: 250,
    },
  });

  const generateQR = useCallback((id, token) => {
    const data = {
      name: 'Rumsan Office',
      action: 'login',
      id: id,
      token: token,
      callbackUrl: `${API_SERVER}/api/v1/auth/wallet`,
    };
    setQrOptions(data);
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(WSS_SERVER);
    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ action: 'get_token' }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.data && data.data.token) {
        console.log('Listening==>', data);
        const { id, token } = data.data;
        setclientId(id.toString());
        setToken(token.toString());
        generateQR(id, token);
      }
      if (data.action === 'welcome') {
        let clientId = data.id.toString();
        setclientId(clientId);
      }

      if (data.action === 'access-granted') {
        window.location.replace(`/passport-control?token=${data.accessToken}`);
      }
    };
  }, [generateQR]);

  return (
    <>
      <div className="error-box">
        <div className="error-body text-center">
          <img src={Logo} height="auto" alt="rahat logo"></img>
          <h4 className="text-grey font-24">Rahat Authentication</h4>
          <div className="mt-4">
            <span>Scan QR Code to Login</span>
            <div style={{ padding: 15 }}>
              <canvas ref={inputRef} />
            </div>
            <p style={{ color: '#fff' }}>----------OR---------- </p>
            {clientId ? (
              <button onClick={handleMetamaskLogin} className="btn btn-warning">
                <i className="fab fa-ethereum"></i> Login Using Metamask
              </button>
            ) : (
              'Initializing...'
            )}
          </div>
          <div className="text-center" style={{ marginTop: 10 }}>
            <p className="text-white">New Agency?</p>
            <a href="/setup" className="btn btn-info setup-link ml-1">
              <b>Setup Now</b>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
