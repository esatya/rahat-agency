import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { VendorContext } from '../../../contexts/VendorContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import WalletUnlock from '../../../modules/global/walletUnlock';
import SelectWrapper from '../../global/SelectWrapper';
import { blobToBase64 } from '../../../utils';
import AvatarIcon from '../../../assets/images/download.png';
import BreadCrumb from '../../ui_components/breadcrumb';

const Add = () => {
	const { addToast } = useToasts();
	const { listAid, addVendor } = useContext(VendorContext);

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		shop_name: '',
		phone: '',
		email: '',
		address: '',
		govt_id: '',
		pan_number: '',
		wallet_address: ''
	});

	const [extras, setExtras] = useState({
		mou_file: ''
	});
	const [loading, setLoading] = useState(false);

	const [govtIdImg, setGovtIdImg] = useState('');
	const [selectedGender, setSelectedGender] = useState('');
	const [selectedProjects, setSelectedProjects] = useState('');
	const [projectList, setProjectList] = useState([]);
	const [profileUpload, setProfileUpload] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleGenderChange = e => {
		setSelectedGender(e.target.value);
	};

	const handleProjectChange = data => {
		const values = data.map(d => d.value);
		setSelectedProjects(values.toString());
	};

	async function handleProfileUpload(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setProfileUpload(base64Url);
	}

	async function handleGovtIdImage(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setGovtIdImg(base64Url);
	}

	async function handleMouUpload(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setExtras({ ...extras, mou_file: base64Url });
	}
	const handleFormSubmit = e => {
		e.preventDefault();
		if (!selectedProjects.length) return addToast('Please select project', TOAST.ERROR);

		const payload = { ...formData, extra_files: { ...extras } };
		payload.projects = selectedProjects;
		if (profileUpload) payload.photo = profileUpload;
		if (selectedGender) payload.gender = selectedGender;
		if (govtIdImg) payload.govt_id_image = govtIdImg;
		setLoading(true);
		addVendor(payload)
			.then(() => {
				setLoading(false);
				addToast('Vendor added successfully', TOAST.SUCCESS);
				History.push('/vendors');
			})
			.catch(err => {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleCancelClick = () => History.push('/users');

	const loadProjects = useCallback(async () => {
		const projects = await listAid();
		if (projects && projects.data.length) {
			const select_options = projects.data.map(p => {
				return {
					label: p.name,
					value: p._id
				};
			});
			setProjectList(select_options);
		}
	}, [listAid]);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Vendor</p>
			<BreadCrumb root_label="Vendor" current_label="Add" redirect_path="vendors" />
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
											<Input name="phone" type="number" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>
								<FormGroup>
									<Label>Project</Label>
									<SelectWrapper
										multi={true}
										onChange={handleProjectChange}
										maxMenuHeight={150}
										data={projectList}
										placeholder="--Select Project--"
									/>
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
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange}>
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
											<Input type="number" value={formData.govt_id} name="govt_id" onChange={handleInputChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="pan_number">PAN number</label>
											<br />
											<Input name="pan_number" type="number" className="form-field" onChange={handleInputChange} />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="identity_photo">Identity picture</label>
											<br />
											{govtIdImg ? (
												<img
													src={govtIdImg}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="identity_photo" type="file" name="file" onChange={handleGovtIdImage} />
										</FormGroup>
									</Col>

									<Col md="6" sm="12">
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
									{loading ? (
										<Button type="button" disabled={true} className="btn btn-secondary">
											Adding, Please wait...
										</Button>
									) : (
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

export default Add;
