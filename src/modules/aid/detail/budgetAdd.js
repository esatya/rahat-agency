import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, Card, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import '../../../assets/css/project.css';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import PasscodeModal from '../../global/PasscodeModal';
import { TOAST } from '../../../constants';
import GrowSpinner from '../../global/GrowSpinner';
import BreadCrumb from '../../ui_components/breadcrumb';

export default function BudgetAdd({ match }) {
	const { addToast } = useToasts();
	const history = useHistory();

	const [inputTokens, setInputToken] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);

	const { projectId } = match.params;

	const { total_tokens, available_tokens, addProjectBudget } = useContext(AidContext);
	const { wallet, isVerified, loading, setLoading, appSettings } = useContext(AppContext);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const handleTokenSubmit = e => {
		e.preventDefault();
		togglePasscodeModal();
	};

	const addProjectBalance = useCallback(async () => {
		const { rahat_admin } = appSettings.agency.contracts;
		if (isVerified && wallet) {
			setPasscodeModal(false);
			setLoading(true);
			addProjectBudget({ projectId, supplyToken: inputTokens, rahat_admin, wallet })
				.then(() => {
					setInputToken('');
					setLoading(false);
					addToast(`${inputTokens} tokens added to the project`, TOAST.SUCCESS);
					history.push(`/projects/${projectId}`);
				})
				.catch(err => {
					setLoading(false);
					addToast(err.message, TOAST.ERROR);
				});
		}
	}, [
		addProjectBudget,
		addToast,
		appSettings.agency.contracts,
		history,
		inputTokens,
		isVerified,
		projectId,
		setLoading,
		wallet
	]);

	useEffect(() => {
		addProjectBalance();
	}, [addProjectBalance, isVerified]);

	return (
		<div>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Add Budget" />

			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">Budget</CardTitle>
					<Row>
						<Col md="6" sm="12" style={{ marginBottom: '10px' }}>
							<p className="card-font-bold">{total_tokens}</p>
							<div className="sub-title">Project Budget</div>
						</Col>
						<Col md="6" sm="12">
							<p className="card-font-bold">{available_tokens}</p>
							<div className="sub-title">Available Budget</div>
						</Col>
					</Row>
				</div>
			</Card>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">Add Budget</CardTitle>
					{loading ? (
						<GrowSpinner />
					) : (
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
										<Button color="info">Add Budget</Button>
									</InputGroupAddon>
								</InputGroup>
							</FormGroup>
						</Form>
					)}
				</div>
			</Card>
		</div>
	);
}
