import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../../../../contexts/AppSettingsContext';
import { AidContext } from '../../../../../contexts/AidContext';
import PasscodeModal from '../../../../global/PasscodeModal';
import { TOAST } from '../../../../../constants';
import Loading from '../../../../global/Loading';
import { BALANCE_TABS } from '../../../../../constants';
import MaskLoader from '../../../../global/MaskLoader';

const WALLET_ACTIONS = {
	DEFAULT: null,
	SUSPEND_TOKEN: 'suspend_token',
	ISSUE_TOKEN: 'issue_token'
}

const Token = ({ benfId, projectId }) => {
	const history = useHistory();
	const { addToast } = useToasts();
	const {
		total_tokens,
		available_tokens,
		issueBenfToken,
		getBeneficiaryById,
		getProjectCapital,
		getAidBalance,
		suspendBeneficiaryToken,
		sendTokenIssuedSms
	} = useContext(AidContext);

	const { wallet, isVerified, appSettings, currentBalanceTab } = useContext(AppContext);
	const [inputTokens, setInputToken] = useState('');
	const [masking, setMasking] = useState(false);

	const [fetchingBlockchain, setFetchingBlockchain] = useState(false);

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [walletActions, setWalletActions] = useState(WALLET_ACTIONS.DEFAULT);


	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleTokenSubmit = e => {
		e.preventDefault();
		setWalletActions(WALLET_ACTIONS.ISSUE_TOKEN);
		if (inputTokens > available_tokens) return addToast(`Only ${available_tokens} tokens are available`, TOAST.ERROR);
		togglePasscodeModal();
	};

	// const handleTokenSuspend  = () => {
	// 	setWalletActions(WALLET_ACTIONS.SUSPEND_TOKEN);
	// 	togglePasscodeModal();
	// };

	const submitTokenSuspend = useCallback(async () => {
		if (isVerified && wallet && currentBalanceTab === BALANCE_TABS.TOKEN) {
			try {
				setPasscodeModal(false);
				setMasking(true);
				const benf = await getBeneficiaryById(benfId);
				if (!benf) return addToast('Beneficiary not found!', TOAST.ERROR);
				const { contracts } = appSettings.agency;
				const payload = {
					phone: Number(benf.phone),
					projectId: projectId
				};
				const res = await suspendBeneficiaryToken(payload, wallet, contracts);
				if (res) {
					setMasking(false);
					addToast(`${inputTokens} tokens assigend successfully`, TOAST.SUCCESS);
					history.push(`/beneficiaries/${benfId}`);
				}
			} catch (err) {
				setMasking(false);
				const errMsg = err.message ? err.message : 'Could not assign tokens to beneficiary';
				addToast(errMsg, TOAST.ERROR);
			}
		}	
	},[isVerified,
		wallet,
		currentBalanceTab,
		getBeneficiaryById,
		benfId,
		addToast,
		appSettings.agency,
		inputTokens,
		projectId,
		history,
		suspendBeneficiaryToken
	])

	const submitTokenRequest = useCallback(async () => {
		if (isVerified && wallet && currentBalanceTab === BALANCE_TABS.TOKEN) {
			try {
				setPasscodeModal(false);
				setMasking(true);
				const benf = await getBeneficiaryById(benfId);
				if (!benf) return addToast('Beneficiary not found!', TOAST.ERROR);
				const { contracts } = appSettings.agency;
				const payload = {
					claimable: Number(inputTokens),
					phone: Number(benf.phone),
					projectId: projectId
				};
				await sendTokenIssuedSms(Number(benf.phone),Number(inputTokens))
				const res = await issueBenfToken(payload, wallet, contracts);
				if (res) {
					setMasking(false);
					addToast(`${inputTokens} tokens assigend successfully`, TOAST.SUCCESS);
					history.push(`/beneficiaries/${benfId}`);
				}
			} catch (err) {
				setMasking(false);
				const errMsg = err.message ? err.message : 'Could not assign tokens to beneficiary';
				addToast(errMsg, TOAST.ERROR);
			}
		}
	}, [
		isVerified,
		wallet,
		currentBalanceTab,
		getBeneficiaryById,
		benfId,
		addToast,
		appSettings.agency,
		inputTokens,
		projectId,
		issueBenfToken,
		history,sendTokenIssuedSms
	]);

	const fetchProjectBalance = useCallback(async () => {
		setFetchingBlockchain(true);
		const { rahat_admin } = appSettings.agency && appSettings.agency.contracts;
		await getProjectCapital(projectId, rahat_admin);
		await getAidBalance(projectId, rahat_admin);
		setFetchingBlockchain(false);
	}, [appSettings.agency, getAidBalance, getProjectCapital, projectId]);

	useEffect(() => {
		fetchProjectBalance();
	}, [fetchProjectBalance]);

	// TODO: Effect called on package issue. Temporarily fixed!
	useEffect(() => {
		if(walletActions === WALLET_ACTIONS.ISSUE_TOKEN)  submitTokenRequest();
		if(walletActions === WALLET_ACTIONS.SUSPEND_TOKEN)  submitTokenSuspend();
	}, [isVerified, submitTokenRequest,walletActions,submitTokenSuspend]);

	return (
		<>
			<MaskLoader message="Assigning tokens, please wait..." isOpen={masking} />
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<div className="spacing-budget">
				<Row>
					<Col md="5" sm="12">
						{fetchingBlockchain ? <Loading /> : <p className="card-font-bold">{total_tokens}</p>}

						<div className="sub-title">Project Token</div>
					</Col>
					<Col md="5" sm="12">
						{fetchingBlockchain ? <Loading /> : <p className="card-font-bold">{available_tokens}</p>}

						<div className="sub-title">Available Token</div>
					</Col>
					{/* <Col md="2" sm="12">
						 <Button onClick={handleTokenSuspend} color="danger" outline > Suspend Tokens </Button>
					</Col> */}
				</Row>
			</div>
			<div className="spacing-budget">
				<CardTitle className="title">Issue Token</CardTitle>
				<Form onSubmit={handleTokenSubmit}>
					<FormGroup>
						<InputGroup>
							<Input
								type="number"
								name="issue_token"
								value={inputTokens || ''}
								onChange={handleInputChange}
								placeholder="Enter number of token balance to be issued"
								required
							/>
							<InputGroupAddon addonType="append">
								<Button color="info">Issue Token</Button>
							</InputGroupAddon>
						</InputGroup>
					</FormGroup>
				</Form>
			</div>
		</>
	);
};

export default Token;
