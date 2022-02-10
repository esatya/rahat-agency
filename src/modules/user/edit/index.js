import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { TOAST, ROLES } from '../../../constants';
import { UserContext } from '../../../contexts/UserContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import GrowSpinner from '../../global/GrowSpinner';
import SelectWrapper from '../../global/SelectWrapper';
import WalletUnlock from '../../global/walletUnlock';
import Loading from '../../global/Loading';
import Swal from 'sweetalert2';

const ROLES_LIST = [
	{ label: ROLES.ADMIN, value: ROLES.ADMIN },
	{ label: ROLES.MANAGER, value: ROLES.MANAGER }
];

const UserDetails = props => {
	const { addToast } = useToasts();
	const { updateUser, getUserById, updateRole, deleteRole } = useContext(UserContext);
	const { wallet, appSettings, isVerified, loading, setLoading, changeIsverified } = useContext(AppContext);

	const { id } = props.match.params;

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		wallet_address: ''
	});
	const [selectedRole, setSelectedRole] = useState('');
	const [existingRoles, setExsitingRoles] = useState([]);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [roleProcess, setRoleProcess] = useState(false);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRoleChange = d => {
		setSelectedRole(d.value);
	};

	const handleSubmitRoles = e => {
		e.preventDefault();
		if (!selectedRole) return addToast('Please selecte role', TOAST.ERROR);
		togglePasscodeModal();
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		const updated_data = { ...formData };
		setFormData(updated_data);
		return updateOnly(updated_data);
	};

	const handleCancelClick = () => History.push('/users');

	const handleDeleteRole = role => {
		if (role)
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, proceed!'
			}).then(async result => {
				if (result.value) {
					await deleteRole(id, role);
					Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
					History.push('/users');
				}
			});
	};

	const updateOnly = data => {
		setLoading(true);
		updateUser(id, data)
			.then(() => {
				setLoading(false);
				History.push('/users');
				addToast('User updated successfully', TOAST.SUCCESS);
			})
			.catch(err => {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	const fetchUserDetails = () => {
		getUserById(id)
			.then(user => {
				sanitizeAndSetRoles(user.roles);
				setFormData({
					...formData,
					name: `${user.name.first} ${user.name.last ? user.name.last : ''}`,
					email: user.email,
					phone: user.phone,
					wallet_address: user.wallet_address
				});
			})
			.catch();
	};

	const sanitizeAndSetRoles = roles => {
		if (!roles) return;
		let data = roles.map(d => {
			return { label: d, value: d };
		});
		//if (data.length > 1) data = data.filter(f => f.value === ROLES.ADMIN);
		setExsitingRoles(data);
	};

	const updateUserRole = useCallback(() => {
		if (!isVerified) return;
		if (!wallet) return addToast('Wallet not found', TOAST.ERROR);
		setRoleProcess(true);
		const { agency } = appSettings;
		if (!agency && !agency.contracts) return;
		const { rahat, rahat_admin } = agency.contracts;
		updateRole({
			userId: id,
			payload: { wallet_address: formData.wallet_address, role: selectedRole },
			rahat,
			rahat_admin,
			wallet
		})
			.then(() => {
				changeIsverified(false);
				togglePasscodeModal();
				setRoleProcess(false);
				History.push('/users');
				addToast('User role updated successfully', TOAST.SUCCESS);
			})
			.catch(err => {
				changeIsverified(false);
				togglePasscodeModal();
				setRoleProcess(false);
				addToast(err.message, TOAST.ERROR);
			});
	}, [
		addToast,
		appSettings,
		changeIsverified,
		formData.wallet_address,
		id,
		isVerified,
		selectedRole,
		togglePasscodeModal,
		updateRole,
		wallet
	]);

	useEffect(fetchUserDetails, []);
	useEffect(updateUserRole, [isVerified]);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<CardTitle className="mb-0">Edit User</CardTitle>
						</CardBody>
						<CardBody>
							<Form onSubmit={handleSubmitRoles}>
								<FormGroup className="mb-5">
									<div>
										<Label className="mr-2">Roles:</Label>
										{existingRoles.length > 0 ? (
											existingRoles.map(roles => {
												return (
													<span className="badge badge-success mr-2 mt-2 mb-3" style={{ fontSize: '0.9em' }}>
														<div className=" d-flex justify-content-between ">
															{roles.label}
															<div
																className="ml-2"
																onClick={() => handleDeleteRole(roles.label)}
																style={{ cursor: 'pointer' }}
															>
																<i className="fa fa-trash"></i>
															</div>
														</div>
													</span>
												);
											})
										) : (
											<span className="badge bg-light text-dark mt-2" style={{ fontSize: '0.9em' }}>
												No role
											</span>
										)}
									</div>
									<Row>
										<Col md="10">
											<SelectWrapper
												onChange={handleRoleChange}
												maxMenuHeight={130}
												currentValue={existingRoles || ''}
												data={ROLES_LIST}
												placeholder="--Select Role--"
											/>
										</Col>

										<Col md="2">
											{roleProcess ? (
												<Loading />
											) : (
												<div>
													<Button type="submit" style={{ borderRadius: '8px' }} outline={true} color="info">
														<i className="fa fa-check"></i> Assign Role
													</Button>
												</div>
											)}
										</Col>
									</Row>
								</FormGroup>
							</Form>
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
												defaultValue={formData.wallet_address}
												name="wallet_address"
												disabled={true}
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Update
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

export default UserDetails;
