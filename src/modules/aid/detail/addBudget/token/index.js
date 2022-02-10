import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../../../../contexts/AppSettingsContext';
import { AidContext } from '../../../../../contexts/AidContext';

import PasscodeModal from '../../../../global/PasscodeModal';
import MaskLoader from '../../../../global/MaskLoader';

import { TOAST } from '../../../../../constants';
import { formatBalanceAndCurrency } from '../../../../../utils';

const Token = ({ projectId }) => {
	const { addToast } = useToasts();
	const history = useHistory();

	const { total_tokens, available_tokens, addProjectBudget } = useContext(AidContext);

	const { wallet, isVerified, appSettings } = useContext(AppContext);
	const [inputTokens, setInputToken] = useState('');

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [masking, setMasking] = useState(false);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleTokenSubmit = e => {
		e.preventDefault();
		togglePasscodeModal();
	};

	const submitProjectBudget = useCallback(async () => {
		if (isVerified && wallet) {
			try {
				setPasscodeModal(false);
				setMasking(true);
				const { rahat_admin } = appSettings.agency.contracts;
				const res = await addProjectBudget(wallet, projectId, inputTokens, rahat_admin);
				if (res) {
					setInputToken('');
					setMasking(false);
					addToast(`${inputTokens} tokens added to the project`, TOAST.SUCCESS);
					history.push(`/projects/${projectId}`);
				}
			} catch (err) {
				setPasscodeModal(false);
				let err_msg = err.message ? err.message : 'Could not add token!';
				// if (err.code === 4001) err_msg = err.message;
				setMasking(false);
				addToast(err_msg, TOAST.ERROR);
			}
		}
	}, [addProjectBudget, addToast, appSettings.agency, inputTokens, isVerified, projectId, wallet, history]);

	useEffect(() => {
		submitProjectBudget();
	}, [isVerified, submitProjectBudget]);

	return (
		<>
			<MaskLoader message="Adding token, please wait..." isOpen={masking} />
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<div className="spacing-budget">
				<Row>
					<Col md="6" sm="12">
						<p className="card-font-bold">{formatBalanceAndCurrency(total_tokens)}</p>
						<div className="sub-title">Project Token</div>
					</Col>
					<Col md="6" sm="12">
						<p className="card-font-bold">{formatBalanceAndCurrency(available_tokens)}</p>
						<div className="sub-title">Available Token</div>
					</Col>
				</Row>
			</div>
			<div className="spacing-budget">
				<CardTitle className="title">Add Token</CardTitle>
				<Form onSubmit={handleTokenSubmit}>
					<FormGroup>
						<InputGroup>
							<Input
								type="number"
								name="input_tokens"
								value={inputTokens || ''}
								onChange={handleInputChange}
								placeholder="Enter number of token balance to be added"
								required
							/>
							<InputGroupAddon addonType="append">
								<Button color="info">Add Token</Button>
							</InputGroupAddon>
						</InputGroup>
					</FormGroup>
				</Form>
			</div>
		</>
	);
};

export default Token;
