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
	const [itemsData, setItemsData] = useState({
		item_name: '',
		item_quantity: ''
	});
	const [pic, setPic] = useState('');
	const [items, setItems] = useState([]);
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

	const handleItemsInputChange = e => {
		setItemsData({ ...itemsData, [e.target.name]: e.target.value });
	};

	const handleAddItem = () => {
		setItems(items => [...items, itemsData]);
	};

	const handleCurrencyChange = e => setSelectedCurrency({ ...selectedCurrency, [e.target.name]: e.target.value });

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
								<Input value={selectedCurrency} name="selectedCurrency" onChange={handleCurrencyChange} />
							</InputGroup>
						</FormGroup>

						<FormGroup>
							<Label>Items</Label>
							<InputGroup>
								<Input
									type="text"
									name="item_name"
									value={itemsData.item_name}
									placeholder="Enter name"
									onChange={handleItemsInputChange}
								/>
								<Input
									type="number"
									name="item_quantity"
									value={itemsData.item_quantity}
									placeholder="Enter quantity"
									onChange={handleItemsInputChange}
								/>
								<button type="button" className="btn waves-effect waves-light btn-info" onClick={handleAddItem}>
									<i class="fas fa-plus"></i>
								</button>
							</InputGroup>
						</FormGroup>
						<FormGroup>
							{items &&
								items.map(item => (
									<button
										type="button"
										className="btn waves-effect waves-light btn-outline-success"
										style={{ borderRadius: '8px', marginRight: '10px', marginBottom: '10px' }}
									>
										{item.item_name || ''}
										{','}
										{item.item_quantity || '0'}
									</button>
								))}
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
