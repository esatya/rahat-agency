import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../../../../contexts/AppSettingsContext';
import { AidContext } from '../../../../../contexts/AidContext';
import PasscodeModal from '../../../../global/PasscodeModal';
import { TOAST } from '../../../../../constants';
import Loading from '../../../../global/Loading';

const Token = ({ benfId, projectId }) => {
	const history = useHistory();
	const { addToast } = useToasts();
	const {
		total_tokens,
		available_tokens,
		issueBenfToken,
		getBeneficiaryById,
		getProjectCapital,
		getAidBalance
	} = useContext(AidContext);

	const { wallet, isVerified, appSettings } = useContext(AppContext);
	const [inputTokens, setInputToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [fetchingBlockchain, setFetchingBlockchain] = useState(false);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleTokenSubmit = e => {
		e.preventDefault();
		if (inputTokens > available_tokens) return addToast(`Only ${available_tokens} tokens are available`, TOAST.ERROR);
		togglePasscodeModal();
	};

	const submitTokenRequest = useCallback(async () => {
		if (isVerified && wallet) {
			try {
				setPasscodeModal(false);
				setLoading(true);
				const benf = await getBeneficiaryById(benfId);
				if (!benf) return addToast('Beneficiary not found!', TOAST.ERROR);
				const { contracts } = appSettings.agency;
				const payload = {
					claimable: Number(inputTokens),
					phone: Number(benf.phone),
					projectId: projectId
				};
				const res = await issueBenfToken(payload, wallet, contracts);
				if (res) {
					setLoading(false);
					addToast(`${inputTokens} tokens issued successfully`, TOAST.SUCCESS);
					history.push(`/beneficiaries/${benfId}`);
				}
			} catch (err) {
				setLoading(false);
				const errMsg = err.message ? err.message : 'Could not issue tokens to beneficiary';
				addToast(errMsg, TOAST.ERROR);
			}
		}
	}, [
		isVerified,
		wallet,
		getBeneficiaryById,
		benfId,
		addToast,
		appSettings.agency,
		inputTokens,
		projectId,
		issueBenfToken,
		history
	]);

	const fetchProjectBalance = useCallback(async () => {
		setFetchingBlockchain(true);
		const { rahat_admin } = appSettings.agency.contracts;
		await getProjectCapital(projectId, rahat_admin);
		await getAidBalance(projectId, rahat_admin);
		setFetchingBlockchain(false);
	}, [appSettings.agency.contracts, getAidBalance, getProjectCapital, projectId]);

	useEffect(() => {
		fetchProjectBalance();
	}, [fetchProjectBalance]);

	useEffect(() => {
		submitTokenRequest();
	}, [isVerified, submitTokenRequest]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<div className="spacing-budget">
				<Row>
					<Col md="6" sm="12">
						{fetchingBlockchain ? <Loading /> : <p className="card-font-bold">{total_tokens}</p>}

						<div className="sub-title">Project Token</div>
					</Col>
					<Col md="6" sm="12">
						{fetchingBlockchain ? <Loading /> : <p className="card-font-bold">{available_tokens}</p>}

						<div className="sub-title">Available Token</div>
					</Col>
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
								{loading ? (
									<Button disabled={true} color="info">
										Issueing tokens, please wait...
									</Button>
								) : (
									<Button color="info">Issue Token</Button>
								)}
							</InputGroupAddon>
						</InputGroup>
					</FormGroup>
				</Form>
			</div>
		</>
	);
};

export default Token;
