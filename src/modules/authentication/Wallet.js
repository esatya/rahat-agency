import React, { useCallback, useRef, useEffect, useState, useContext } from 'react';
import { useQRCode } from 'react-qrcodes';
import EthCrypto from 'eth-crypto';
import { Card, Row, CardTitle, Col, Button, CardText } from 'reactstrap';
import { AppContext } from '../../contexts/AppSettingsContext';
import Logo from '../../assets/images/rahat-logo-blue.png';
import DataService from '../../services/db';
import './wallet.css';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../constants';
import { Link } from 'react-router-dom';

const API_SERVER = process.env.REACT_APP_API_SERVER;
const WSS_SERVER = API_SERVER.replace('http', 'ws');
const QR_REFRESH_TIME = 30000; // 30

const Wallet = () => {
	const { addToast } = useToasts();
	const ws = useRef(null);
	const [qroptions, setQrOptions] = useState({});
	const [clientId, setclientId] = useState('');
	const [refreshCounter, setRefreshCounter] = useState(0);
	const { setTempIdentity, tempIdentity } = useContext(AppContext);

	function getRandomString(length) {
		let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
	}

	const [inputRef] = useQRCode({
		text: JSON.stringify(qroptions),
		options: {
			level: 'M',
			margin: 7,
			scale: 1,
			width: 200
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
			if (data.action === 'unauthorized') {
				return addToast('User not authorized!', TOAST.ERROR);
			}
			if (data.data && data.data.token) {
				const { id, token } = data.data;
				setclientId(id.toString());
				// setToken(token.toString());
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
	}, [generateQR, addToast, tempIdentity.privateKey, refreshCounter]);

	const handleRefreshQrCode = () => setRefreshCounter(refreshCounter + 1);

	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col className="left-content">
					<div className="text-center">
						<img src={Logo} height="200" width="460" alt="rahat logo"></img>
						<div style={{ width: '410px' }}>
							<p className="description">
								Supporting vulnerable communities with a simple and efficient relief distribution platform.
							</p>
						</div>
					</div>
				</Col>
				<Col className="right-content">
					<p className="text-signup">
						Haven’t registered?{' '}
						<Link to={`/sign_up`}>
							<span style={{ color: '#3F9EEB' }}>Sign up</span>
						</Link>
					</p>
					<div className=" text-center">
						<p className="text-title">Rahat Agency App</p>
						<div className="mt-4 align-items-center">
							<div style={{ padding: 15 }}>
								<canvas ref={inputRef} style={{ display: clientId ? '' : 'none' }} />
							</div>

							<Row>
								<Col xs="12" md="2" lg="2"></Col>
								<Col xs="12" md="8" lg="8">
									{clientId ? (
										''
									) : (
										<Card body inverse className="qr-card">
											<CardTitle className="qr-card-title">QR Code Expired</CardTitle>
											<CardText>Generated qrcode will expire in {QR_REFRESH_TIME / 1000} seconds.</CardText>
											<Button type="button" onClick={handleRefreshQrCode} className="qr-card-button">
												<i className="fas fa-redo" style={{ marginRight: '10px' }}></i> Refresh QR Code
											</Button>
										</Card>
									)}
								</Col>
								<Col xs="12" md="2" lg="2"></Col>
							</Row>

							<p className="text-instruction">
								<i class="fa fa-qrcode" aria-hidden="true" style={{ marginRight: '10px' }}></i>
								Open Rumsan wallet App and scan the QR code to log in
							</p>

							{/* <a href=""> */}
							<p className="text-tutorial">Click to learn how this works.</p>
							{/* </a> */}
						</div>
					</div>
					<p className="text-copyright">Copyright © 2021 Rumsan Group of Companies | All Rights Reserved.</p>
				</Col>
			</Row>
		</>
	);
};

export default Wallet;
