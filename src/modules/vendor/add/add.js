import React, { useState, useEffect, useContext } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	Card,
	CardBody,
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { VendorContext } from '../../../contexts/VendorContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import WalletUnlock from '../../../modules/global/walletUnlock';

const Add = () => {
	const { addToast } = useToasts();
	const { addVendor } = useContext(VendorContext);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		// shop_name: '',
		phone: '',
		email: '',
		address: '',
		// education: '',
		// pan_number: '',
		governmentID: '',
		wallet_address: '',
		bank_branch: '',
		bank_name: '',
		account_number: ''
	});
	const [selectedGender, setSelectedGender] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleGenderChange = e => {
		setSelectedGender(e.target.value);
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		const payload = { ...formData };
		if (selectedGender) payload.gender = selectedGender;
		console.log('vendor', payload);
		addVendor(payload)
			.then(() => {
				addToast('Vendor added successfully', TOAST.SUCCESS);
				History.push('/vendors');
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleCancelClick = () => History.push('/users');

	const saveUserDetails = () => {};

	useEffect(saveUserDetails);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Vendor</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Vendor</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Add</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<FormGroup>
									<Label>Name</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>
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
								<FormGroup>
									<Label>Shop Name</Label>
									<Input
										type="text"
										value={formData.shop_name}
										name="shop_name"
										onChange={handleInputChange}
										required
									/>
								</FormGroup>
								<FormGroup>
									<label htmlFor="phone">Phone number</label>
									<br />
									<Input name="phone" type="number" onChange={handleInputChange} required />
								</FormGroup>
								<FormGroup>
									<Label>Address</Label>
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange}>
												<option value="">--Select Gender--</option>
												<option value="Male">Male</option>
												<option value="Female">Female</option>
												<option value="Other">Other</option>
											</Input>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Email</Label>
											<Input type="email" value={formData.email} name="email" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Education</Label>
											<Input
												type="text"
												value={formData.education}
												name="education"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="pan_number">PAN number</label>
											<br />
											<Input name="pan_number" type="number" className="form-field" required />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="bank_name">Bank name</label>
											<br />
											<Input name="bank_name" type="text" className="form-field" required />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="bank_branch">Bank branch</label>
											<br />
											<Input name="bank_branch" type="text" className="form-field" required />
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<label htmlFor="account_number">Bank account number</label>
									<br />
									<Input name="account_number" type="number" className="form-field" required />
								</FormGroup>

								<CardBody style={{ paddingLeft: 0 }}>
									{/* {loading ? (
										<GrowSpinner />
									) : ( */}
									<div>
										<Button type="submit" className="btn btn-info">
											<i className="fa fa-check"></i> Submit
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
									{/* )} */}
								</CardBody>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Add;
