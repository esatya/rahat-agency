import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ButtonGroup, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import Swal from 'sweetalert2';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { AidContext } from '../../../contexts/AidContext';
import Loading from '../../global/Loading';
import UnlockWallet from '../../global/walletUnlock';

export default function AidDetails(props) {
	const { addToast } = useToasts();
	const { appSettings, isVerified } = useContext(AppContext);
	const [inputTokens, setInputToken] = useState('');
	const [projectDetails, setProjectDetails] = useState(null);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const projectId = props.aidId;

	const togglePasscodeModal = useCallback(() => setPasscodeModal(!passcodeModal), [passcodeModal]);

	const {
		balance,
		getAidDetails,
		loading,
		setLoading,
		resetLoading,
		addProjectBudget,
		getAidBalance,
		changeProjectStatus
	} = useContext(AidContext);

	const loadAidDetails = useCallback(() => {
		getAidDetails(projectId)
			.then(d => {
				setProjectDetails(d);
				getAidBalance(projectId);
			})
			.catch(() => {
				addToast('Internal server error.', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	}, [addToast, getAidBalance, getAidDetails, projectId]);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const addProjectBalance = useCallback(() => {
		if (!isVerified) return;
		const { rahat_admin } = appSettings.agency.contracts;
		setLoading();
		addProjectBudget(projectId, inputTokens, rahat_admin)
			.then(d => {
				setProjectDetails(d);
				setInputToken(null);
				resetLoading();
				addToast('Token balance added to the project.', {
					appearance: 'success',
					autoDismiss: true
				});
				getAidBalance(projectId);
				togglePasscodeModal();
			})
			.catch(err => {
				togglePasscodeModal();
				let err_msg = 'Something went wrong!!';
				if (err.code === 4001) err_msg = err.message;
				resetLoading();
				addToast(err_msg, {
					appearance: 'error',
					autoDismiss: true
				});
			});
	}, [
		addProjectBudget,
		addToast,
		appSettings.agency.contracts,
		getAidBalance,
		inputTokens,
		isVerified,
		projectId,
		resetLoading,
		setLoading,
		togglePasscodeModal
	]);

	const handleTokenSubmit = e => {
		e.preventDefault();
		Swal.fire({
			title: 'Are you sure?',
			text: `${inputTokens} token balance will be added!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then(async result => {
			if (result.isConfirmed) {
				togglePasscodeModal();
			}
		});
	};
	useEffect(addProjectBalance, [isVerified]);

	useEffect(loadAidDetails, []);

	const handleStatusChange = async status => {
		let result = await Swal.fire({
			title: 'Are you sure?',
			text: `Project will be marked as ${status}!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		});
		if (result.isConfirmed) {
			try {
				let d = await changeProjectStatus(projectId, status);
				if (d) {
					setProjectDetails(d);
					addToast(`Project marked as ${status}.`, {
						appearance: 'success',
						autoDismiss: true
					});
				}
			} catch {
				addToast('Something went wrong on server!', {
					appearance: 'error',
					autoDismiss: true
				});
			}
		}
	};

	const { available } = balance;

	return (
		<>
			<UnlockWallet open={passcodeModal} onClose={e => setPasscodeModal(e)}></UnlockWallet>

			<Form onSubmit={handleTokenSubmit}>
				<FormGroup>
					<ButtonGroup>
						<Button
							color="success"
							onClick={() => handleStatusChange('active')}
							disabled={projectDetails && projectDetails.status === 'suspended' ? false : true}
						>
							Activate
						</Button>
						<Button
							disabled={projectDetails && projectDetails.status !== 'suspended' ? false : true}
							color="danger"
							onClick={() => handleStatusChange('suspended')}
						>
							Suspend
						</Button>
					</ButtonGroup>
				</FormGroup>
				<FormGroup>
					<Label>Project Name</Label>
					<InputGroup>
						<Input readOnly type="text" name="name" defaultValue={projectDetails ? projectDetails.name : ''} />
					</InputGroup>
				</FormGroup>

				<FormGroup>
					<Label>Current Balance</Label>
					<InputGroup>
						<Input readOnly type="number" name="token_balance" value={available} />
					</InputGroup>
				</FormGroup>

				<FormGroup>
					<Label>Status</Label>
					<InputGroup>
						<Input readOnly type="text" name="status" defaultValue={projectDetails ? projectDetails.status : ''} />
					</InputGroup>
				</FormGroup>

				{projectDetails && projectDetails.status === 'draft' ? (
					<InputGroup>
						<Input
							type="number"
							name="assign_tokens"
							placeholder="Enter number of token balance to be added."
							value={inputTokens || ''}
							onChange={handleInputChange}
							required
						/>
						<InputGroupAddon addonType="append">
							{loading ? (
								<Loading />
							) : (
								<Button type="submit" color="primary">
									Add Budget
								</Button>
							)}
						</InputGroupAddon>
					</InputGroup>
				) : projectDetails && projectDetails.status === 'active' ? (
					<InputGroup>
						<Input
							type="number"
							name="assign_tokens"
							placeholder="Enter number of token balance to be added."
							value={inputTokens || ''}
							onChange={handleInputChange}
							required
						/>
						<InputGroupAddon addonType="append">
							{loading ? (
								<Loading />
							) : (
								<Button type="submit" color="primary">
									Add Budget
								</Button>
							)}
						</InputGroupAddon>
					</InputGroup>
				) : (
					''
				)}
			</Form>
		</>
	);
}
