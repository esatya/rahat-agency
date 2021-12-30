import React, { useState, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { MobilizerContext } from '../../../contexts/MobilizerContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import WalletUnlock from '../../../modules/global/walletUnlock';
import { blobToBase64, formatErrorMsg } from '../../../utils';
import AvatarIcon from '../../../assets/images/download.png';
import BreadCrumb from '../../ui_components/breadcrumb';

const Add = () => {
	const { addToast } = useToasts();
	const { addMobilizer } = useContext(MobilizerContext);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		organization: '',
		wallet_address: ''
	});
	const [loading, setLoading] = useState(false);
	const [govtIdImg, setGovtIdImg] = useState('');
	const [profileUpload, setProfileUpload] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	async function handleProfileUpload(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setProfileUpload(base64Url);
	}

	async function handleGovtIdImage(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setGovtIdImg(base64Url);
	}

	const sanitizePayload = payload => {
		if (!payload.email) delete payload.email;
		if (!payload.address) delete payload.address;
		if (!payload.organization) delete payload.organization;
		return payload;
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		const payload = { ...formData };
		if (profileUpload) payload.photo = profileUpload;
		if (govtIdImg) payload.govt_id_image = govtIdImg;
		const sanitized = sanitizePayload(payload);
		console.log({ sanitized });
		setLoading(true);
		addMobilizer(sanitized)
			.then(() => {
				setLoading(false);
				addToast('Mobilizer added successfully', TOAST.SUCCESS);
				History.push('/mobilizers');
			})
			.catch(err => {
				const errMessage = formatErrorMsg(err);
				setLoading(false);
				addToast(errMessage, TOAST.ERROR);
			});
	};

	const handleCancelClick = () => History.push('/users');

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Mobilizers</p>
			<BreadCrumb root_label="Mobilizers" current_label="Add" redirect_path="mobilizers" />
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<Row>
									<Col md="5" sm="12" className="d-flex align-items-center">
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
									<Col md="7" sm="12">
										<FormGroup>
											<Label>Name</Label>
											<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
										</FormGroup>

										<FormGroup>
											<label htmlFor="phone">Phone number</label>
											<br />
											<Input name="phone" type="number" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>

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
									<Label>Email (optional)</Label>
									<Input type="email" value={formData.email} name="email" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>Address (optional)</Label>
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>Organization (optional)</Label>
									<Input type="text" value={formData.organization} name="organization" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<label htmlFor="govt_id_image">Government ID</label>
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
									<Input id="govt_id_image" type="file" name="file" onChange={handleGovtIdImage} />
								</FormGroup>

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
