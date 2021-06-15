import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';

import { GFile, GFolder } from '../../utils/google';
import { AppContext } from '../../contexts/AppSettingsContext';
import { BACKUP } from '../../constants';
import UserImg from '../../assets/images/user.svg';
import Wallet from '../../utils/blockchain/wallet';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleRestore() {
  const history = useHistory();
  let currentWallet = null;

  const Actions = [
    {
      hash: '#choose-account',
      label:
        'Please choose Google account. Please click the switch account button to change account.',
    },
    {
      hash: '#choose-wallet',
      label: 'Please select the wallet you wish to restore.',
    },
    {
      hash: '#enter-passphrase',
      label: 'Please enter backup passphrase.',
    },
  ];

  const { setWallet } = useContext(AppContext);
  const [loading, setLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gUser, setGUser] = useState({
    id: null,
    name: 'Loading Users...',
    email: null,
    image: UserImg,
  });
  const [passphrase, setPassphrase] = useState('');
  const [walletList, setWalletList] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState({});

  const [currentAction, setCurrentAction] = useState({});

  const changeAction = (hash) => {
    setErrorMsg(null);
    let selectedAction = Actions.find((a) => a.hash === hash);
    if (!selectedAction)
      setCurrentAction(Actions.find((a) => a.hash === '#choose-account'));
    else setCurrentAction(selectedAction);
  };

  const loadGapiClient = () => {
    history.listen((location) => {
      changeAction(location.hash);
    });
    changeAction(history.location.hash);
    gapi.load('client:auth2', initClient);
  };

  const initClient = () => {
    gapi.client
      .init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        ux_mode: 'redirect',
        scope: 'profile email https://www.googleapis.com/auth/drive',
        redirect_uri: `${GOOGLE_REDIRECT_URL}/restore`,
      })
      .then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch((e) => {
        alert(
          'Warning',
          'You have blocked third-party cookies for this site or app. You must allow them for Google login to work.',
          'warning'
        ).then((e) => {
          history.push('/');
        });
      });
  };

  const updateSigninStatus = (isSignedIn) => {
    let user = null;
    if (isSignedIn) {
      user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      setGUser({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        image: profile.getImageUrl(),
      });
    } else user = handleUserSignIn();
  };

  const handleUserSignIn = () => {
    return gapi.auth2.getAuthInstance().signIn();
  };

  const fetchWalletList = async () => {
    let existingWallet = null;
    if (existingWallet) {
      alert(
        'Warning',
        'You have already setup a wallet. Please backup and remove it before restoring another wallet from Google Drive.',
        'warning'
      ).then((d) => {
        history.push('/');
      });
      return;
    }
    history.push('#choose-wallet');
    setLoading('Querying Google Drive for wallet backups. Please wait...');
    const gFolder = new GFolder(gapi);
    const gFile = new GFile(gapi);
    const folder = await gFolder.ensureExists(BACKUP.GDRIVE_FOLDERNAME);
    let files = await gFile.listFiles(folder.id);
    setWalletList(files);
    setLoading(null);
  };

  const fetchSelectedWalletData = async () => {
    setErrorMsg(null);
    setLoading('Fetching wallet data. Please wait...');
    try {
      const gFile = new GFile(gapi);
      let walletData = await gFile.downloadFile(selectedWallet.id);
      currentWallet = JSON.parse(walletData);
      if (!currentWallet.name)
        throw Error('Not a valid wallet. Please select another wallet.');
      setSelectedWallet(Object.assign(selectedWallet, { data: currentWallet }));
      history.push('#enter-passphrase');
    } catch (e) {
      setErrorMsg(
        e.message === 'Not a valid wallet. Please select another wallet.'
          ? e.message
          : 'Issue fetching wallet. Are you sure you selected a right wallet? Please check and try again.'
      );
      setSelectedWallet({});
    }
    setLoading(null);
  };

  const restoreWallet = async () => {
    setErrorMsg(null);
    setLoading('Unlocking and restoring wallet.');
    try {
      const passcode = 'temp_passcode';
      const wallet = await Wallet.loadFromJson(
        passphrase,
        selectedWallet.data.wallet
      );
      const passcodeWallet = await wallet.encrypt(passcode);
      //   await DataService.clearAll();
      //   await DataService.saveWallet(passcodeWallet);
      //   await DataService.saveAddress(wallet.address);
      //   await DataService.save('backup_wallet', selectedWallet.data.wallet);

      setWallet(wallet);
      //   await DataService.remove('temp_passcode');
      history.push('/');
    } catch (e) {
      console.log(e);
      setPassphrase('');
      setErrorMsg('Backup passphrase is incorrect. Please try again.');
    }
    setLoading(null);
  };

  const showInfo = (msg) => {
    if (loading) return <div className="text-center p3">Loading...</div>;
    return (
      <div className="text-center p-3">
        {/* {isLoading && (
				<span className="spinner-border spinner-border-sm mr-05" role="status" aria-hidden="true"></span>
			)} */}
        {msg}
      </div>
    );
  };

  const handleBackButton = (e) => {
    if (history.action === 'POP') return history.push('/google/restore');
    history.goBack();
  };

  useEffect(loadGapiClient, []);

  return (
    <>
      <Card style={{ padding: 100 }}>
        <CardBody>
          <div className="error-body text-center">
            <h5 className="text-dark font-24">
              Restore your wallet from google
            </h5>
            <div className="mt-4">
              <Button>Restore Wallet</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
