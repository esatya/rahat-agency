import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { TOAST } from '../../../constants';
import { getUser } from '../../../utils/sessionManager';
import { UserContext } from '../../../contexts/UserContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import WalletUnlock from '../../global/walletUnlock';
import GrowSpinner from '../../global/GrowSpinner';

const current_user = getUser();

const AddUser = () => {
	const { addToast } = useToasts();
	const { addUser } = useContext(UserContext);
	const { wallet, appSettings, isVerified, loading, setLoading, changeIsverified } = useContext(AppContext);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		wallet_address: ''
	});
	const [selectedRole, setSelectedRole] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRoleChange = e => {
		setSelectedRole(e.target.value);
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		if (!selectedRole) return addToast('Please select role', TOAST.ERROR);
		if (!current_user.agency) return addToast('Agency not found', TOAST.ERROR);
		setFormData({ ...formData, roles: [selectedRole], agency: current_user.agency });
		togglePasscodeModal();
		return;
	};

	const handleCancelClick = () => History.push('/users');

	const saveUserDetails = useCallback(() => {
		if (!isVerified) return;
		if (!wallet) return addToast('Wallet not found', TOAST.ERROR);
		setLoading(true);
		const { rahat, rahat_admin } = appSettings.agency.contracts;
		addUser({ payload: formData, rahat, rahat_admin, wallet })
			.then(() => {
				changeIsverified(false);
				togglePasscodeModal();
				setLoading(false);
				History.push('/users');
				addToast('User added successfully', TOAST.SUCCESS);
			})
			.catch(err => {
				changeIsverified(false);
				togglePasscodeModal();
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	}, [
		addToast,
		addUser,
		appSettings.agency.contracts,
		changeIsverified,
		formData,
		isVerified,
		setLoading,
		togglePasscodeModal,
		wallet
	]);

	useEffect(saveUserDetails, [isVerified]);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<CardTitle className="mb-0">Add User</CardTitle>
						</CardBody>
						<CardBody>
							<Form onSubmit={handleFormSubmit}>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Full Name</Label>
											<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6">
										<FormGroup>
											<Label>Email</Label>
											<Input type="email" value={formData.email} name="email" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Phone</Label>
											<Input type="text" value={formData.phone} name="phone" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6">
										<FormGroup>
											<Label>Wallet Address</Label>
											<Input
												type="text"
												value={formData.wallet_address}
												name="wallet_address"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Role</Label>
											<Input type="select" name="roles" onChange={handleRoleChange}>
												<option value="">--Select Role--</option>
												<option value="Admin">Admin</option>
												<option value="Manager">Manager</option>
											</Input>
										</FormGroup>
									</Col>
									<Col md="6"></Col>
								</Row>
								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Save
											</Button>
											<Button
												type="button"
												onClick={handleCancelClick}
												style={{ borderRadius: 8 }}
												className="btn btn-dark ml-2"
											>
												Cancel
											</Button>
										</div>
									)}
								</CardBody>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AddUser;
