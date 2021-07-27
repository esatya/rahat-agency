import React, { useContext, useState } from 'react';
import { CardTitle, Card, CardBody, Row, Col, Button, FormGroup, InputGroup, Input } from 'reactstrap';
import QRCode from 'qrcode';
import { useToasts } from 'react-toast-notifications';

import AidDetails from './AidDetails';
import BeneficiaryList from './BeneficiaryList';
import TokenDetails from './TokenDetails';
import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import ModalWrapper from '../../global/CustomModal';
import { TOAST, APP_CONSTANTS } from '../../../constants';
import { APP } from '../../../constants/api';
import Wallet from '../../../utils/blockchain/wallet';
import GrowSpinner from '../../global/GrowSpinner';

export default function Details({ match }) {
	const aidId = match.params.id;
	const { beneficiaryByAid, bulkTokenIssueToBeneficiary } = useContext(AidContext);
	const {
		appSettings,
		setLoading,
		loading,
		setWallet,
		openPasscodeModal,
		setPasscodeModal,
		walletActionMsg,
		setWalletActionMsg
	} = useContext(AppContext);

	const { addToast } = useToasts();

	const [modal, setModal] = useState(false);
	const [amount, setAmount] = useState('');
	const [currentAction, setCurrentAction] = useState('');
	const [beneficiaryPhones, setBeneficiaryPhones] = useState([]); // For bulk issue
	const [beneficiaryTokens, setBeneficiaryTokens] = useState([]); // For bulk issue
	const [walletPasscode, setWalletPasscode] = useState('');

	const toggleModal = action => {
		if (action) setCurrentAction(action);
		setModal(!modal);
	};

	const handleAmountChange = e => setAmount(e.target.value);

	const fetchBeneficiaryByProject = () => {
		beneficiaryByAid(aidId, { limit: APP_CONSTANTS.BULK_BENEFICIARY_LIMIT })
			.then(res => {
				const { data } = res;
				if (data && data.length) return generateBulkQRCodes(data);
				toggleModal();
				addToast('No beneficiary available', {
					appearance: 'error',
					autoDismiss: true
				});
			})
			.catch();
	};

	const bulkTokenIssue = async () => {
		let beneficiary_tokens = [];
		if (!amount) return addToast('Please enter token amount', TOAST.ERROR);

		const { data } = await beneficiaryByAid(aidId, { limit: APP.BULK_BENEFICIARY_LIMIT });
		if (data.length) {
			const beneficiary_phones = data.map(d => d.phone);
			const len = beneficiary_phones.length;
			if (len < 1) return addToast('No phone number found', TOAST.ERROR);
			for (let i = 0; i < len; i++) {
				beneficiary_tokens.push(amount);
			}
			setBeneficiaryTokens(beneficiary_tokens);
			setBeneficiaryPhones(beneficiary_phones);
			toggleModal();
			setPasscodeModal(true);
		}
	};

	const handlePasscodeChange = async e => {
		const { value } = e.target;
		setWalletPasscode(value);
		if (value.length === APP_CONSTANTS.PASSCODE_LENGTH) {
			const _wallet = await verifyPasscodeAndGetWallet(value);
			if (!_wallet) {
				setWalletPasscode('');
				setPasscodeModal(true);
				setWalletActionMsg(<span style={{ color: 'red' }}>Please enter valid passcode</span>);
			} else {
				setWalletPasscode('');
				setPasscodeModal(false);
				setWalletActionMsg(<span style={{ color: 'green' }}>Wallet verified!</span>);
				setWallet(_wallet);
				return submitBeneficiaryTokens({ phones: beneficiaryPhones, amounts: beneficiaryTokens, wallet: _wallet });
			}
		}
	};

	const verifyPasscodeAndGetWallet = async passcodeInput => {
		setWalletActionMsg('Verifying your passcode. Please wait...');
		try {
			let w = await Wallet.loadWallet(passcodeInput);
			return w;
		} catch (e) {
			setWalletPasscode('');
			setPasscodeModal(true);
			setWalletActionMsg(<span style={{ color: 'red' }}>Please enter valid passcode</span>);
		}
	};

	const submitBeneficiaryTokens = async ({ phones, amounts, wallet }) => {
		try {
			setLoading(true);
			const { contracts } = appSettings.agency;
			let res = await bulkTokenIssueToBeneficiary({
				projectId: aidId,
				phone_numbers: phones,
				token_amounts: amounts,
				contract_address: contracts.rahat,
				wallet
			});
			if (res) {
				setWalletActionMsg('');
				setAmount('');
				return addToast(`Each of ${phones.length} beneficiaries has been assigned ${amount} tokens`, TOAST.SUCCESS);
			}
		} catch (err) {
			addToast(err.message, TOAST.ERROR);
		} finally {
			setLoading(false);
		}
	};

	const handleModalFormSubmit = e => {
		e.preventDefault();
		if (currentAction === 'bulk_issue') return bulkTokenIssue();
		if (currentAction === 'bulk_export') return fetchBeneficiaryByProject();
	};

	//   tel:+9779801109670?amount=200
	const convertQrToImg = async data => {
		let result = [];
		for (let d of data) {
			const imgUrl = await QRCode.toDataURL(`phone:+977${d.phone}?amount=${amount ? amount : null}`);
			result.push({ imgUrl, phone: d.phone });
		}
		return result;
	};

	const generateBulkQRCodes = async data => {
		const qrcodeImages = await convertQrToImg(data);

		let html = `<html>
		<head>
		<style>
		*{
		  margin:0;
		  top:0;
		 }
		</style>
		</head>
		<body>
		`;
		// eslint-disable-next-line array-callback-return
		data.map((d, i) => {
			const name = `Name: ${d.name}`;
			const address = `Address: ${d.address}`;
			const govtID = `Govt. ID: ${d.govt_id}`;
			const found = qrcodeImages.find(f => f.phone === d.phone);
			if (i % 2 === 0) {
				html += `
			<div class="row" style="display:flex;">
			  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
				<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
				<div class="col-md-4" style="margin-top:5px;">
				  <label>
					<h3>${name}<h3>
					<h4>${address}<h4>
					<h4>${govtID}<h4>
				  </label>
				  <br><br>
				</div>
			  </div>`;
			} else {
				html += `
			  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
				<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
				<div class="col-md-4" style="margin-top:5px;">
				  <label>
					<h3>${name}<h3>
					<h4>${address}<h4>
					<h4>${govtID}<h4>
				  </label>
				  <br><br>
				</div>
			  </div>
			</div>`;
			}
		});
		if (data.length % 2 !== 0) {
			html += ` 
		  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
		  </div>
		</div>`;
		}
		html += '</body></html>';
		toggleModal();
		setAmount('');
		var newWindow = window.open('', 'Print QR', 'fullscreen=yes'),
			document = newWindow.document.open();
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};

	return (
		<>
			{/* PASSCODE MODAL */}
			<ModalWrapper
				toggle={() => setPasscodeModal(false)}
				open={openPasscodeModal}
				title="Verify Wallet"
				loading={loading}
				hideFooter={true}
			>
				<FormGroup>
					<InputGroup>
						<Input
							disabled={walletPasscode && walletPasscode.length === 6 ? true : false}
							type="text"
							className="verify-input pwd"
							value={walletPasscode || ''}
							placeholder="Enter 6-digit passcode"
							onChange={handlePasscodeChange}
							maxLength="6"
						/>
					</InputGroup>
				</FormGroup>
				<FormGroup>
					<InputGroup>{walletActionMsg ? walletActionMsg : ''}</InputGroup>
				</FormGroup>
			</ModalWrapper>

			{/* BENEFICIARY TOKEN MODAL */}
			<ModalWrapper
				toggle={toggleModal}
				open={modal}
				title="Set Beneficiary Amount"
				handleSubmit={handleModalFormSubmit}
				loading={loading}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="amount"
							placeholder="Please enter amount"
							value={amount || ''}
							onChange={handleAmountChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>
			<Row>
				<Col md="6">
					<Card style={{ minHeight: 484 }}>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">Project Details</CardTitle>
						<CardBody>
							<AidDetails aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
				<Col md="6">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">Token Details</CardTitle>
						<CardBody>
							<TokenDetails aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<div className="bg-light border-bottom p-3 mb-0 card-title">
								{loading ? (
									<GrowSpinner />
								) : (
									<Row>
										<Col md="8">
											<i className="mdi mdi-border-right mr-2"></i>Beneficiary List
										</Col>
										<Col md="2">
											<div>
												<Button
													disabled={loading}
													onClick={() => toggleModal('bulk_issue')}
													type="button"
													className="btn pull-right"
													color="info"
												>
													{loading ? 'Please wait...' : 'Bulk Token Issue'}
												</Button>
											</div>
										</Col>
										<Col md="2">
											<div>
												<Button
													disabled={loading}
													onClick={() => toggleModal('bulk_export')}
													type="button"
													className="btn"
													color="info"
												>
													Bulk QRCode Export{' '}
												</Button>
											</div>
										</Col>
									</Row>
								)}
							</div>
							<BeneficiaryList aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}
