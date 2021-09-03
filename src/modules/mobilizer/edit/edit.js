import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { MobilizerContext } from '../../../contexts/MobilizerContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import WalletUnlock from '../../../modules/global/walletUnlock';
import AvatarIcon from '../../../assets/images/download.png';
import { blobToBase64 } from '../../../utils';
import BreadCrumb from '../../ui_components/breadcrumb';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

const Edit = ({ mobilizerId }) => {
	const { addToast } = useToasts();
	const { updateMobilizer, getMobilizerDetails } = useContext(MobilizerContext);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		wallet_address: '',
		organization: ''
	});

	const [govtIdentity, setGovtIdentity] = useState('');
	const [profileUpload, setProfileUpload] = useState('');
	const [existingProfilePhoto, setExistingProfilePhoto] = useState('');
	const [existingIdentity, setExistingIdentity] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleCancelClick = () => History.push('/mobilizers');

	async function handleProfileUpload(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setProfileUpload(base64Url);
	}

	async function handleGovtIdentity(e) {
		const base64Url = await blobToBase64(e.target.files[0]);
		setGovtIdentity(base64Url);
	}

	const handleFormSubmit = e => {
		e.preventDefault();
		console.log('form data', formData);
		const payload = { ...formData };
		if (profileUpload) payload.photo = profileUpload;
		if (govtIdentity) payload.govt_id_image = govtIdentity;

		setLoading(true);
		updateMobilizer(mobilizerId, payload)
			.then(() => {
				setLoading(false);
				addToast('Mobilizer updated successfully', TOAST.SUCCESS);
				History.push('/mobilizers');
			})
			.catch(err => {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	const loadMobilizersDetails = useCallback(async () => {
		const d = await getMobilizerDetails(mobilizerId);
		const { name, phone, email, address, wallet_address, organization, photo, govt_id_image } = d;

		if (photo && photo.length) setExistingProfilePhoto(photo[0]);
		if (govt_id_image) setExistingIdentity(govt_id_image);
		setFormData({
			name,
			phone,
			email,
			address,
			wallet_address,
			organization
		});
	}, [getMobilizerDetails, mobilizerId]);

	useEffect(() => {
		loadMobilizersDetails();
	}, [loadMobilizersDetails]);

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Mobilizers</p>
			<BreadCrumb redirect_path="mobilizers" root_label="Mobilizers" current_label="Edit" />

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
											) : existingProfilePhoto ? (
												<img
													src={`${IPFS_GATEWAY}/ipfs/${existingProfilePhoto}`}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="profileUpload" type="file" onChange={handleProfileUpload} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Name</Label>
											<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
										</FormGroup>

										<FormGroup>
											<label htmlFor="phone">Phone number</label>
											<br />
											<Input name="phone" type="number" value={formData.phone} onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<Label>Address</Label>
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>Email</Label>
									<Input type="email" value={formData.email} name="email" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>Organization</Label>
									<Input type="text" value={formData.organization} name="organization" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>Wallet Address</Label>
									<Input
										type="text"
										value={formData.wallet_address}
										name="wallet_address"
										onChange={handleInputChange}
										disabled
									/>
								</FormGroup>

								<FormGroup>
									<label htmlFor="govt_id_image">Government ID</label>
									<br />
									{govtIdentity ? (
										<img
											src={govtIdentity}
											alt="Profile"
											width="200px"
											height="200px"
											style={{ borderRadius: '10px', marginBottom: '10px' }}
										/>
									) : existingIdentity ? (
										<img
											src={`${IPFS_GATEWAY}/ipfs/${existingIdentity}`}
											alt="Profile"
											width="200px"
											height="200px"
											style={{ borderRadius: '10px', marginBottom: '10px' }}
										/>
									) : (
										<img src={AvatarIcon} alt="Profile" width="100px" height="100px" />
									)}
									<Input id="govt_id_image" type="file" onChange={handleGovtIdentity} />
								</FormGroup>

								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<Button type="button" disabled={true} className="btn btn-secondary">
											Updating, Please wait...
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

export default Edit;
