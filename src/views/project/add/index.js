import React, { useState, useEffect } from 'react';
// import { useToasts } from 'react-toast-notifications';
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

// import { TOAST } from '../../../constants';
// import { getUser } from '../../../utils/sessionManager';
// import { UserContext } from '../../../contexts/UserContext';
// import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import WalletUnlock from '../../../modules/global/walletUnlock';
// import GrowSpinner from '../../../modules/global/GrowSpinner';

// const current_user = getUser();

const AddProject = () => {
	// const { addToast } = useToasts();
	// const { addUser } = useContext(UserContext);
	// const { wallet, appSettings, isVerified, loading, setLoading, changeIsverified } = useContext(AppContext);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		wallet_address: ''
	});
	const [selectedInstitution, setSelectedInstitution] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleInstitutionChange = e => {
		setSelectedInstitution(e.target.value);
	};

	const handleFormSubmit = e => {
		console.log(selectedInstitution);
		return;
	};

	const handleCancelClick = () => History.push('/users');

	const saveUserDetails = () => {};

	useEffect(saveUserDetails);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Projects</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Projects</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Add</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<FormGroup>
									<Label>Project Name</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Project Manager</Label>
									<Input type="text" value={formData.manager} name="manager" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Budget</Label>
									<Input type="number" value={formData.budget} name="budget" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Location</Label>
									<Input type="text" value={formData.location} name="location" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Financial Institution</Label>
									<Input type="select" name="institutions" onChange={handleInstitutionChange}>
										<option value="">--Select Institutions--</option>
										<option value="Institution A">Institution A</option>
										<option value="Institution B">Institution B</option>
									</Input>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="exampleFile">Beneficiaries File Upload</Label>
									<Input type="file" placeholder="" />
								</FormGroup>
								<FormGroup>
									<Label>Text area</Label>
									<Input type="textarea" rows="4" />
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

export default AddProject;
