import React, { useState, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { TOAST } from '../../../constants';
import { getUser } from '../../../utils/sessionManager';
import { UserContext } from '../../../contexts/UserContext';
import { History } from '../../../utils/History';

const current_user = getUser();

const AddUser = () => {
	const { addToast } = useToasts();
	const { addUser } = useContext(UserContext);

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
		formData.roles = [selectedRole];
		formData.agency = current_user.agency;
		addUser(formData)
			.then(() => {
				History.push('/users');
				addToast('User added successfully', TOAST.SUCCESS);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleCancelClick = () => History.push('/users');

	return (
		<div>
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
