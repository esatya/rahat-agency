import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Card, CardBody, FormGroup, Label, Input, InputGroup, Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import BreadCrumb from '../../ui_components/breadcrumb';
import { blobToBase64, generateUID } from '../../../utils';
import UploadPlaceholder from '../../../assets/images/download.png';
import { TOAST } from '../../../constants';
import Select from 'react-select';
import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import PasscodeModal from '../../global/PasscodeModal';
import BackButton from '../../global/BackButton';
import MaskLoader from '../../global/MaskLoader';

const options = [
	{ value: 'foods', label: 'Foods' },
	{ value: 'shelter', label: 'Shelter' },
	{ value: 'maternity', label: 'Maternity' }
];

export default function NewAsset({ match }) {
	const history = useHistory();
	const { addToast } = useToasts();
	const { projectId } = match.params;

	const { createNft } = useContext(AidContext);
	const { appSettings, isVerified, wallet } = useContext(AppContext);
	const [masking, setMasking] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		symbol: '',
		totalSupply: '',
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
	const [passcodeModal, setPasscodeModal] = useState(false);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

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
		const filteredItems = items.filter(f => f.itemId !== id);
		setItems(filteredItems);
	};

	const handleFiatInputChange = e => setFiatValue(e.target.value);

	const validateNameAndSymbol = (name, symbol) => {
		let errorMsg = '';
		if (name.length > 15) errorMsg = 'Package name must be less than 15 characters';
		if (symbol.length > 5) errorMsg = 'Package symbol must be less than 5 characters';
		return errorMsg;
	};

	const submitNftDetails = useCallback(async () => {
		try {
			if (isVerified && wallet) {
				setPasscodeModal(false);
				setMasking(true);
				const { name, symbol, description } = formData;
				const errorMsg = validateNameAndSymbol(name, symbol);
				if (errorMsg) return addToast(errorMsg, TOAST.ERROR);
				const _meta = { categories: selectedCategories, fiatValue: fiatValue, description: description, items: items };
				const payload = { ...formData, metadata: _meta, project: projectId, packageImg: packageImg };
				delete payload.description;

				const { contracts } = appSettings.agency;
				const created = await createNft(payload, contracts, wallet);
				if (created) {
					setMasking(false);
					addToast('Package created successfully', TOAST.SUCCESS);
					history.push(`/add-budget/${projectId}`);
				}
			}
		} catch (err) {
			setMasking(false);
			return addToast('Internal server error!', TOAST.ERROR);
		}
	}, [
		addToast,
		appSettings.agency,
		createNft,
		fiatValue,
		formData,
		isVerified,
		items,
		packageImg,
		projectId,
		selectedCategories,
		wallet,
		history
	]);

	const handleFormSubmit = e => {
		e.preventDefault();
		return togglePasscodeModal();
	};

	useEffect(() => {
		submitNftDetails();
	}, [isVerified, submitNftDetails]);

	return (
		<>
			<MaskLoader message="Creating package, please wait..." isOpen={masking} />
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Create Package" />

			<Card>
				<CardBody>
					<form onSubmit={handleFormSubmit}>
						<Row>
							<Col md="4">
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
							</Col>
						</Row>

						<FormGroup>
							<Label>
								Enter package <b>Name</b> and <b>Symbol</b>
							</Label>
							<InputGroup>
								<Input
									type="text"
									name="name"
									value={formData.name}
									placeholder="Eg: Vegetables Token"
									onChange={handleInputChange}
									required
								/>
								<Input
									type="text"
									name="symbol"
									value={formData.symbol}
									placeholder="Eg: VGT"
									onChange={handleInputChange}
									required
								/>
							</InputGroup>
						</FormGroup>

						<FormGroup>
							<Label>Quantity</Label>
							<Input
								type="number"
								placeholder="Enter quantity"
								value={formData.totalSupply}
								name="totalSupply"
								onChange={handleInputChange}
								required
							/>
						</FormGroup>

						<FormGroup>
							<Label>Value in fiat currency</Label>
							<InputGroup>
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
								&nbsp;
								<button type="button" className="btn waves-effect waves-light btn-info" onClick={handleAddItem}>
									<i className="fas fa-plus"></i>
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
							&nbsp; <BackButton />
						</FormGroup>
					</form>
				</CardBody>
			</Card>
		</>
	);
}
