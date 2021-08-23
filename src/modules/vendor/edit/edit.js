import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import AvatarIcon from '../../../assets/images/download.png';
import { blobToBase64 } from '../../../utils';
import SelectWrapper from '../../global/SelectWrapper';

const Edit = ({ vendorId }) => {
	const { addToast } = useToasts();
	const { listAid, updateVendor, getVendorDetails } = useContext(VendorContext);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		shop_name: '',
		phone: '',
		email: '',
		address: '',
		govt_id: '',
		pan_number: '',
		wallet_address: '',
		bank_branch: '',
		bank_name: '',
		bank_account: ''
	});
	const [extras, setExtras] = useState({
		identity_photo: '',
		signature_photo: '',
		mou_file: ''
	});
	const [selectedGender, setSelectedGender] = useState('');
	const [selectedProjects, setSelectedProjects] = useState('');
	const [projectList, setProjectList] = useState([]);
	const [profileUpload, setProfileUpload] = useState('');
	const [existingProjects, setExistingProjects] = useState([]);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleCancelClick = () => History.push('/vendors');

	const handleGenderChange = e => {
		setSelectedGender(e.target.value);
	};

	const handleProjectChange = data => {
		const values = data.map(d => d.value);
		setSelectedProjects(values.toString());
	};

	async function handleProfileUpload(e) {
		const convertImage = await blobToBase64(e.target.files[0]);
		setProfileUpload(convertImage);
	}

	async function handleIdentityUpload(e) {
		const convertImage = await blobToBase64(e.target.files[0]);
		setExtras({ ...extras, identity_photo: convertImage });
	}

	async function handleSignatureUpload(e) {
		const convertImage = await blobToBase64(e.target.files[0]);
		setExtras({ ...extras, signature_photo: convertImage });
	}

	async function handleMouUpload(e) {
		const convertImage = await blobToBase64(e.target.files[0]);
		setExtras({ ...extras, mou_file: convertImage });
	}

	const handleFormSubmit = e => {
		e.preventDefault();
		if (!selectedProjects.length) return addToast('Please select project', TOAST.ERROR);

		const payload = { ...formData, extra_files: { ...extras } };
		payload.projects = selectedProjects;
		if (profileUpload) payload.photo = profileUpload;
		if (selectedGender) payload.gender = selectedGender;
		updateVendor(vendorId, payload)
			.then(() => {
				addToast('Vendor updated successfully', TOAST.SUCCESS);
				History.push('/vendors');
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const createProjectSelectOptions = projects => {
		const select_options = projects.map(p => {
			return {
				label: p.name,
				value: p._id
			};
		});
		return select_options;
	};

	const loadBeneficiaryDetails = useCallback(async () => {
		const d = await getVendorDetails(vendorId);
		console.log('data vendor', d);
		const {
			projects,
			name,
			phone,
			email,
			address,
			wallet_address,
			shop_name,
			pan_number,
			bank_name,
			bank_branch,
			bank_account,
			photo,
			govt_id
		} = d;
		if (projects && projects.length) {
			const project_ids = projects.map(p => p._id);
			setSelectedProjects(project_ids.toString());
			const select_options = createProjectSelectOptions(projects);
			setExistingProjects(select_options);
		}

		setFormData({
			name,
			phone,
			email,
			address,
			wallet_address,
			shop_name,
			pan_number,
			bank_name,
			bank_branch,
			bank_account,
			photo,
			govt_id
		});
		const { gender } = d;
		if (gender !== 'U') setSelectedGender(gender);
	}, [vendorId, getVendorDetails]);

	const loadProjects = useCallback(async () => {
		const projects = await listAid();
		if (projects && projects.data.length) {
			const select_options = createProjectSelectOptions(projects.data);
			setProjectList(select_options);
		}
	}, [listAid]);

	useEffect(() => {
		loadProjects();
		loadBeneficiaryDetails();
	}, [loadBeneficiaryDetails, loadProjects]);

	console.log('data', formData);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Vendor</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Vendor</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Edit</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<Row>
									<Col md="6" sm="12" className="d-flex align-items-center">
										<FormGroup>
											<label htmlFor="Profile pic">Profile picture</label>
											<br />
											{profileUpload ? (
												<img
													src={profileUpload}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="profileUpload" type="file" name="file" onChange={handleProfileUpload} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Name</Label>
											<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
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
											<Input name="phone" type="number" value={formData.phone} onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>
								<FormGroup>
									<Label>Project</Label>
									{existingProjects.length > 0 && (
										<SelectWrapper
											multi={true}
											currentValue={existingProjects}
											onChange={handleProjectChange}
											maxMenuHeight={130}
											data={projectList}
											placeholder="--Select Project--"
										/>
									)}

									{existingProjects.length < 1 && (
										<SelectWrapper
											multi={true}
											onChange={handleProjectChange}
											maxMenuHeight={130}
											data={projectList}
											placeholder="--Select Project--"
										/>
									)}
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
									<Label>Address</Label>
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange} value={selectedGender}>
												<option value="">--Select Gender--</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
												<option value="O">Other</option>
												{/* <option value="U">Undefinded</option> */}
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
											<Label>Government ID</Label>
											<Input
												type="number"
												value={formData.govt_id}
												name="govt_id"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="pan_number">PAN number</label>
											<br />
											<Input
												name="pan_number"
												type="number"
												value={formData.pan_number}
												className="form-field"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="bank_name">Bank name</label>
											<br />
											<Input
												name="bank_name"
												type="text"
												value={formData.bank_name}
												className="form-field"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="bank_branch">Bank branch</label>
											<br />
											<Input
												name="bank_branch"
												type="text"
												value={formData.bank_branch}
												className="form-field"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<FormGroup>
									<label htmlFor="bank_account">Bank account number</label>
									<br />
									<Input
										name="bank_account"
										type="number"
										value={formData.bank_account}
										className="form-field"
										onChange={handleInputChange}
										required
									/>
								</FormGroup>
								<Row>
									<Col md="4" sm="4">
										<FormGroup>
											<label htmlFor="identity_photo">Identity picture</label>
											<br />
											{extras.identity_photo ? (
												<img
													src={extras.identity_photo}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="identity_photo" type="file" name="file" onChange={handleIdentityUpload} />
										</FormGroup>
									</Col>
									<Col md="4" sm="4">
										<FormGroup>
											<label htmlFor="mou_file">Signature upload</label>
											<br />
											{extras.signature_photo ? (
												<img
													src={extras.signature_photo}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input
												id="signature_photo"
												type="file"
												name="Upload signature"
												onChange={handleSignatureUpload}
											/>
										</FormGroup>
									</Col>
									<Col md="4" sm="4">
										<FormGroup>
											<label htmlFor="mou_file">MOU upload</label>
											<br />
											{extras.mou_file ? (
												<img
													src={extras.mou_file}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="mou_file" type="file" name="file" onChange={handleMouUpload} />
										</FormGroup>
									</Col>
								</Row>

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

export default Edit;
