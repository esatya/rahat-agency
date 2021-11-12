import React, { useState } from 'react';
import { Card, CardBody, FormGroup, Label, Input, InputGroup } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import BreadCrumb from '../../ui_components/breadcrumb';
import { blobToBase64, generateUID } from '../../../utils';
import UploadPlaceholder from '../../../assets/images/download.png';
import { TOAST } from '../../../constants';
import Select from 'react-select';

const options = [
	{ value: 'foods', label: 'Foods' },
	{ value: 'shelter', label: 'Shelter' },
	{ value: 'maternity', label: 'Maternity' }
];

export default function NewAsset({ match }) {
	const { addToast } = useToasts();
	const { projectId } = match.params;

	const [formData, setFormData] = useState({
		name: '',
		quantity: '',
		description: ''
	});
	const [itemsData, setItemsData] = useState({
		item_name: '',
		item_quantity: ''
	});
	const [packageImg, setPackageImg] = useState('');
	const [items, setItems] = useState([]);
	const [fiatValue, setFiatValue] = useState('');
	const [selectedCategories, setSelectedCategories] = useState([]);

	// const toggleDropDown = () => setDropdownOpen(!dropdownOpen);

	const handleProfileUpload = async e => {
		const file = e.target.files[0];
		const base64Url = await blobToBase64(file);
		setPackageImg(base64Url);
	};

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleItemsInputChange = e => {
		setItemsData({ ...itemsData, [e.target.name]: e.target.value });
	};

	const resetItemFields = () => {
		setItemsData({ item_name: '', item_quantity: '' });
	};

	const handleCategoryChange = d => {
		const categories = d.map(c => c.value);
		setSelectedCategories(categories);
	};

	const handleAddItem = () => {
		const { item_name, item_quantity } = itemsData;
		if (!item_name || !item_quantity) return addToast('Please enter item name and quantity', TOAST.ERROR);
		itemsData.itemId = generateUID();
		setItems(items => [...items, itemsData]);
		resetItemFields();
	};

	const handleRemoveItem = id => {
		console.log({ id });
		const filteredItems = items.filter(f => f.itemId !== id);
		setItems(filteredItems);
	};

	const handleFiatInputChange = e => setFiatValue(e.target.value);

	const handleFormSubmit = e => {
		e.preventDefault();
		// Upload package_img to IPFS
		// Upload metadata to IPFS
		// get CID of package_img and metadata
		// Call Nft smart contract method
	};

	console.log('Categories==>', selectedCategories);

	return (
		<>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Create Package" />

			<Card>
				<CardBody>
					<form onSubmit={handleFormSubmit}>
						<FormGroup>
							<label htmlFor="packageImg">Upload Image</label>
							<br />
							{packageImg ? (
								<img
									src={packageImg}
									alt="Profile"
									width="200px"
									height="200px"
									style={{ borderRadius: '10px', marginBottom: '10px' }}
								/>
							) : (
								<img src={UploadPlaceholder} alt="Profile" width="100px" height="100px" />
							)}
							<Input id="picUpload" name="package_img" type="file" onChange={handleProfileUpload} required />
						</FormGroup>

						<FormGroup>
							<Label>Name</Label>
							<Input
								type="text"
								placeholder="Enter suitable name for your package"
								value={formData.name}
								name="name"
								onChange={handleInputChange}
								required
							/>
						</FormGroup>

						<FormGroup>
							<Label>Category</Label>
							<Select
								defaultValue={[]}
								isMulti
								name="category"
								options={options}
								className="basic-multi-select"
								classNamePrefix="select"
								onChange={handleCategoryChange}
							/>
						</FormGroup>

						<FormGroup>
							<Label>Quantity</Label>
							<Input
								type="number"
								placeholder="Enter quantity"
								value={formData.quantity}
								name="quantity"
								onChange={handleInputChange}
								required
							/>
						</FormGroup>

						<FormGroup>
							<Label>Description</Label>
							<Input
								type="text"
								placeholder="Enter short description"
								value={formData.description}
								name="description"
								onChange={handleInputChange}
							/>
						</FormGroup>

						<FormGroup>
							<Label>Value in fiat currency</Label>
							<InputGroup>
								{/* <InputGroupButtonDropdown addonType="prepend" isOpen={dropdownOpen} toggle={toggleDropDown}>
									<DropdownToggle caret>Select currency</DropdownToggle>
									<DropdownMenu onChange={handleCurrencyChange}>
										<DropdownItem>Nepalese</DropdownItem>
										<DropdownItem>Dollar</DropdownItem>
										<DropdownItem>Euro</DropdownItem>
									</DropdownMenu>
								</InputGroupButtonDropdown> */}
								<Input
									placeholder="Enter total worth of the package"
									value={fiatValue}
									name="fiat_value"
									onChange={handleFiatInputChange}
									required
								/>
							</InputGroup>
						</FormGroup>

						<FormGroup>
							<Label>Items in your package</Label>
							<InputGroup>
								<Input
									type="text"
									name="item_name"
									value={itemsData.item_name}
									placeholder="Eg: Rice"
									onChange={handleItemsInputChange}
								/>
								<Input
									type="text"
									name="item_quantity"
									value={itemsData.item_quantity}
									placeholder="Eg: 1KG"
									onChange={handleItemsInputChange}
								/>
								<button type="button" className="btn waves-effect waves-light btn-info" onClick={handleAddItem}>
									<i class="fas fa-plus"></i>
								</button>
							</InputGroup>
						</FormGroup>
						<FormGroup>
							{items.length > 0 &&
								items.map((item, i) => (
									<button
										key={i + 1}
										type="button"
										className="btn waves-effect waves-light btn-outline-success"
										style={{ borderRadius: '8px', marginRight: '10px', marginBottom: '10px' }}
									>
										{item.item_name || ''}
										{'-'}
										{item.item_quantity || '0'}
										&nbsp; <i onClick={() => handleRemoveItem(item.itemId)} class="fas fa-trash"></i>
									</button>
								))}
						</FormGroup>

						<br />
						<FormGroup>
							<button type="submit" className="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
								Create package
							</button>
						</FormGroup>
					</form>
				</CardBody>
			</Card>
		</>
	);
}
