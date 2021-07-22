import React, { useState, useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { TOAST, ROLES } from '../../../constants';
import { UserContext } from '../../../contexts/UserContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import GrowSpinner from '../../global/GrowSpinner';

const UserDetails = props => {
	const { addToast } = useToasts();
	const { updateUser, getUserById } = useContext(UserContext);
	const { loading, setLoading } = useContext(AppContext);

	const { id } = props.match.params;

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
		const updated_data = { ...formData };
		setFormData(updated_data);
		return updateOnly(updated_data);
	};

	const handleCancelClick = () => History.push('/users');

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
				const current_role = user.roles[0];
				setSelectedRole(current_role);
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

	useEffect(fetchUserDetails, []);

	return (
		<div>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<CardTitle className="mb-0">Edit User</CardTitle>
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
												defaultValue={formData.wallet_address}
												name="wallet_address"
												disabled={true}
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Role</Label>
											<Input disabled={true} type="select" name="roles" onChange={handleRoleChange}>
												<option value="">--Select Role--</option>
												<option value="Admin" selected={selectedRole === ROLES.ADMIN ? true : false}>
													Admin
												</option>
												<option value="Manager" selected={selectedRole === ROLES.MANAGER ? true : false}>
													Manager
												</option>
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
