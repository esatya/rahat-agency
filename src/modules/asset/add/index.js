import React, { useState } from 'react';
import {
	Card,
	CardBody,
	FormGroup,
	Label,
	Input,
	InputGroup,
	InputGroupButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import BreadCrumb from '../../ui_components/breadcrumb';
import { blobToBase64 } from '../../../utils';
import UploadPlaceholder from '../../../assets/images/download.png';
import Select from 'react-select';

const options = [
	{ value: 'foods', label: 'Foods' },
	{ value: 'shelter', label: 'Shelter' },
	{ value: 'maternity', label: 'Maternity' }
];

export default function NewAsset({ match }) {
	const { projectId } = match.params;
	const [formData, setFormData] = useState({
		name: '',
		quantity: '',
		description: '',
		address: '',
		address_temporary: '',
		govt_id: ''
	});
	const [pic, setPic] = useState('');
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const [selectedCurrency, setSelectedCurrency] = useState('');
	// const [loading, setLoading] = useState(false);
	const toggleDropDown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleProfileUpload = async e => {
		const file = e.target.files[0];
		const base64Url = await blobToBase64(file);
		setPic(base64Url);
	};
	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleCurrencyChange = e => setSelectedCurrency(e.target.value);

	// const handleFormSubmit = e => {
	// 	e.preventDefault();

	// 	const payload = { ...formData};
	// 	if (selectedCurrency) payload.gender = selectedCurrency;
	// 	if (pic) payload.photo = pic;
	// 	setLoading(true);
	// 	addAsset(payload)
	// 		.then(() => {
	// 			setLoading(false);
	// 			addToast('Asset added successfully', TOAST.SUCCESS);
	// 		})
	// 		.catch(err => {
	// 			setLoading(false);
	// 			addToast(err.message, TOAST.ERROR);
	// 		});
	// };

	return (
		<>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Add Asset" />

			<Card>
				<CardBody>
					<div>
						<FormGroup>
							<label htmlFor="pic">Upload Image</label>
							<br />
							{pic ? (
								<img
									src={pic}
									alt="Profile"
									width="200px"
									height="200px"
									style={{ borderRadius: '10px', marginBottom: '10px' }}
								/>
							) : (
								<img src={UploadPlaceholder} alt="Profile" width="100px" height="100px" />
							)}
							<Input id="picUpload" type="file" onChange={handleProfileUpload} />
						</FormGroup>

						<FormGroup>
							<Label>Name</Label>
							<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
						</FormGroup>

						<FormGroup>
							<Label>Category</Label>
							<Select
								defaultValue={[options[0]]}
								isMulti
								name="colors"
								options={options}
								className="basic-multi-select"
								classNamePrefix="select"
							/>
						</FormGroup>

						<FormGroup>
							<Label>Quantity</Label>
							<Input type="number" value={formData.quantity} name="quantity" onChange={handleInputChange} required />
						</FormGroup>

						<FormGroup>
							<Label>Description</Label>
							<Input type="text" value={formData.description} name="description" onChange={handleInputChange} />
						</FormGroup>

						<FormGroup>
							<Label>Value in fiat currency</Label>
							<InputGroup>
								<InputGroupButtonDropdown addonType="prepend" isOpen={dropdownOpen} toggle={toggleDropDown}>
									<DropdownToggle caret>Select currency</DropdownToggle>
									<DropdownMenu>
										<DropdownItem>Nepalese</DropdownItem>
										<DropdownItem>Dollar</DropdownItem>
										<DropdownItem>Euro</DropdownItem>
									</DropdownMenu>
								</InputGroupButtonDropdown>
								<Input onChange={handleCurrencyChange} />
							</InputGroup>
						</FormGroup>
						<br />
						<FormGroup>
							<button
								type="button"
								className="btn waves-effect waves-light btn-info"
								style={{ borderRadius: '8px' }}
								onClick=""
							>
								Add package
							</button>
						</FormGroup>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
