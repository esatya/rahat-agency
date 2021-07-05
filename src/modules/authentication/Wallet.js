import React, { useCallback, useRef, useEffect, useState, useContext } from 'react';
import { useQRCode } from 'react-qrcodes';
import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';
import { Card, Row, CardTitle, Col, Button, CardText } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppSettingsContext';
import Logo from '../../assets/images/logo-dark.png';
import DataService from '../../services/db';

const NETWORK_URL = process.env.REACT_APP_BLOCKCHAIN_NETWORK;
const API_SERVER = process.env.REACT_APP_API_SERVER;
const WSS_SERVER = API_SERVER.replace('http', 'ws');
const QR_REFRESH_TIME = 30000; // 30

const Wallet = () => {
	const { addToast } = useToasts();

	const ws = useRef(null);
	const [qroptions, setQrOptions] = useState({});
	const [clientId, setclientId] = useState('');
	const [token, setToken] = useState('');
	const [refreshCounter, setRefreshCounter] = useState(0);

	const { loginUsingMetamask } = useContext(UserContext);
	const { setTempIdentity, tempIdentity } = useContext(AppContext);

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
				autoDismiss: true
			});
		}
	};

	const getSigner = async () => {
		let signer;
		if (window.ethereum) {
			window.ethereum.enable();
			signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
		} else {
			signer = new ethers.providers.JsonRpcProvider(NETWORK_URL).getSigner();
		}
		return signer;
	};
	function getRandomString(length) {
		let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
	}

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
			width: 250
		}
	});

	const generateQR = useCallback(
		(id, token) => {
			const randomChars = getRandomString(128);
			const entropy = Buffer.from(randomChars, 'utf-8');
			const tempIdentity = EthCrypto.createIdentity(entropy);
			setTempIdentity(tempIdentity);
			const data = {
				name: 'Rumsan Office',
				action: 'login',
				id: id,
				token: token,
				callbackUrl: `${API_SERVER}/api/v1/auth/wallet`,
				encryptionKey: tempIdentity.publicKey
			};
			setQrOptions(data);
		},
		[setTempIdentity]
	);

	useEffect(() => {
		ws.current = new WebSocket(WSS_SERVER);
		return () => {
			ws.current.close();
		};
	}, [refreshCounter]);

	useEffect(() => {
		if (!ws.current) return;

		ws.current.onopen = () => {
			ws.current.send(JSON.stringify({ action: 'get_token' }));
		};

		ws.current.onmessage = async e => {
			const data = JSON.parse(e.data);
			if (data.data && data.data.token) {
				const { id, token } = data.data;
				setclientId(id.toString());
				setToken(token.toString());
				generateQR(id, token);
			}
			if (data.action === 'welcome') {
				let clientId = data.id.toString();
				setclientId(clientId);
			}
			if (data.encryptedWallet) {
				const encWalletData = EthCrypto.cipher.parse(data.encryptedWallet);
				const decrypted = await EthCrypto.decryptWithPrivateKey(
					tempIdentity.privateKey, // privateKey
					encWalletData // encrypted-data
				);
				const address = JSON.parse(decrypted).address;
				await DataService.saveWallet(decrypted);
				await DataService.saveAddress(address);
			}

			if (data.action === 'access-granted') {
				window.location.replace(`/passport-control?token=${data.accessToken}`);
			}
		};

		let timer = setTimeout(() => {
			setclientId('');
		}, QR_REFRESH_TIME);

		return () => clearTimeout(timer);
	}, [generateQR, tempIdentity.privateKey, refreshCounter]);

	const handleRefreshQrCode = () => setRefreshCounter(refreshCounter + 1);

	return (
		<>
			<div className="error-box">
				<div className="error-body text-center">
					<img src={Logo} height="auto" alt="rahat logo"></img>
					<h4 className="text-grey font-24">Rahat Authentication</h4>
					<div className="mt-4">
						{clientId ? <span>Scan QR Code to Login</span> : ''}
						<div style={{ padding: 15 }}>
							<canvas ref={inputRef} style={{ display: clientId ? '' : 'none' }} />
						</div>

						<Row>
							<Col xs="12" md="4" lg="5"></Col>
							<Col xs="12" md="4" lg="2">
								{clientId ? (
									''
								) : (
									<Card body inverse color="secondary">
										<CardTitle>QR Code Expired</CardTitle>
										<CardText>Generated qrcode will expire in {QR_REFRESH_TIME / 1000} seconds.</CardText>
										<Button type="button" onClick={handleRefreshQrCode} className="bg-white text-dark">
											<i className="fas fa-redo"></i> Refresh Now
										</Button>
									</Card>
								)}
							</Col>
							<Col xs="12" md="4" lg="5"></Col>
						</Row>

						<p style={{ color: '#fff' }}>------------OR------------</p>
						<button onClick={handleMetamaskLogin} className="btn btn-warning">
							<i className="fab fa-ethereum"></i> Login Using Metamask
						</button>
					</div>
					<div className="text-center" style={{ marginTop: 10 }}>
						<p className="text-white">New Agency?</p>
						<a href="/setup" className="btn btn-secondary setup-link ml-1">
							<b>Setup New</b>
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Wallet;
