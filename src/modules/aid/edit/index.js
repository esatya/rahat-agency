import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
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

import { TOAST, APP_CONSTANTS, ROLES } from '../../../constants';
import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { UserContext } from '../../../contexts/UserContext';
import { History } from '../../../utils/History';
import SelectWrapper from '../../global/SelectWrapper';
import GrowSpinner from '../../../modules/global/GrowSpinner';

const EditProject = ({ match }) => {
	const { id } = match.params;

	const { addToast } = useToasts();
	const { listFinancialInstitutions, updateAid, getAidDetails, getInstitution } = useContext(AidContext);
	const { loading, setLoading } = useContext(AppContext);
	const { listUsersByRole } = useContext(UserContext);

	const [existingManager, setExistingManager] = useState([]);
	const [existingInstitutions, setExistingInstitutions] = useState([]);

	const [financialInstitutions, setFinancialInstitutions] = useState([]);
	const [projectManagers, setProjectManagers] = useState([]);
	const [benefUploadFile, setBenefUploadFile] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		location: '',
		description: ''
	});
	const [selectedInstitutions, setSelectedInstitutions] = useState([]);
	const [selectedManager, setSelectedManager] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = e => {
		setBenefUploadFile(e.target.files[0]);
	};

	const handleInstitutionChange = data => {
		const institution_values = data.map(d => d.value);
		setSelectedInstitutions(institution_values);
	};

	const handleProjectManagerChange = e => {
		setSelectedManager(e.value);
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		if (!selectedManager) return addToast('Please select project manager', TOAST.ERROR);
		console.log(benefUploadFile);
		// const form_payload = createFormData(formData);
		if (selectedInstitutions.length) formData.financial_institutions = selectedInstitutions.toString();
		formData.project_manager = selectedManager;
		setLoading(true);
		updateAid(id, formData)
			.then(res => {
				setLoading(false);
				addToast(`Project updated successfully`, TOAST.SUCCESS);
				History.push(`/projects/${id}`);
			})
			.catch(err => {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	// const createFormData = payload => {
	// 	const form_data = new FormData();
	// 	for (let property in payload) {
	// 		form_data.append(property, payload[property]);
	// 	}
	// 	if (selectedInstitutions.length) form_data.append('financial_institutions', selectedInstitutions.toString());
	// 	if (benefUploadFile) form_data.append('file', benefUploadFile);
	// 	form_data.append('project_manager', selectedManager);
	// 	return form_data;
	// };

	const handleCancelClick = () => History.push('/projects');

	const setProjectDetails = useCallback(
		async project => {
			const { name, project_manager, location, financial_institutions, description } = project;
			setFormData({ name, location, description });
			if (project_manager) {
				setSelectedManager(project_manager.wallet_address);
				const select_option = [
					{ label: `${project_manager.name.first} ${project_manager.name.last}`, value: project_manager.wallet_address }
				];
				setExistingManager(select_option);
			}
			if (financial_institutions && financial_institutions.length) {
				const select_options = [];
				const selected_values = [];
				for (let i of financial_institutions) {
					const d = await getInstitution(i);
					select_options.push({ label: d.name, value: d._id });
					selected_values.push(d._id);
				}
				setSelectedInstitutions(selected_values);
				setExistingInstitutions(select_options); // Pre-populate selected
			}
		},
		[getInstitution]
	);

	useEffect(() => {
		async function fetchData() {
			try {
				const project = await getAidDetails(id);
				await setProjectDetails(project);
				const users = await listUsersByRole(ROLES.MANAGER);
				const institutions = await listFinancialInstitutions({ limit: APP_CONSTANTS.FETCH_LIMIT });
				if (institutions && institutions.data.length) loadFinancialInstiturions(institutions.data);
				if (users && users.data.length) loadProjectManagers(users.data);
			} catch (err) {
				addToast(err.message, TOAST.ERROR);
			}
		}

		fetchData();
	}, [listUsersByRole, listFinancialInstitutions, getAidDetails, id, addToast, setProjectDetails]);

	const loadFinancialInstiturions = data => {
		const populate_institutions = data.map(d => {
			return { label: d.name, value: d._id };
		});
		setFinancialInstitutions(populate_institutions);
	};

	const loadProjectManagers = users => {
		const populate_managers = users.map(u => {
			return { label: u.fullname, value: u.wallet_address };
		});
		setProjectManagers(populate_managers);
	};

	console.log('=======>', existingInstitutions);

	return (
		<div>
			<p className="page-heading">Projects</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="#projects">Projects</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Edit</BreadcrumbItem>
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
									{existingManager.length < 1 && (
										<SelectWrapper
											id="project_manager"
											onChange={handleProjectManagerChange}
											maxMenuHeight={200}
											currentValue={[]}
											data={projectManagers}
											placeholder="--Select Manager--"
										/>
									)}
									{existingManager.length > 0 && (
										<SelectWrapper
											id="project_manager"
											onChange={handleProjectManagerChange}
											maxMenuHeight={200}
											currentValue={existingManager}
											data={projectManagers}
											placeholder="--Select Manager--"
										/>
									)}
								</FormGroup>

								<FormGroup>
									<Label>Location</Label>
									<Input type="text" value={formData.location} name="location" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Financial Institution</Label>
									{existingInstitutions.length < 1 && (
										<SelectWrapper
											id="financial_institutions"
											multi={true}
											onChange={handleInstitutionChange}
											maxMenuHeight={130}
											currentValue={[]}
											data={financialInstitutions}
											placeholder="--Select Institution--"
										/>
									)}
									{existingInstitutions.length > 0 && (
										<SelectWrapper
											id="financial_institutions"
											multi={true}
											onChange={handleInstitutionChange}
											maxMenuHeight={130}
											currentValue={existingInstitutions}
											data={financialInstitutions}
											placeholder="--Select Institution--"
										/>
									)}
								</FormGroup>
								<FormGroup style={{ display: 'none' }}>
									<Label htmlFor="benefUpload">Beneficiary Upload(.xlxs file)</Label>
									<Input id="benefUpload" type="file" name="file" onChange={handleFileChange} />
								</FormGroup>
								<FormGroup>
									<Label>Description</Label>
									<Input
										type="textarea"
										onChange={handleInputChange}
										value={formData.description}
										name="description"
										rows="4"
									/>
								</FormGroup>

								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Update
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

export default EditProject;
