import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { History } from '../../../utils/History';
import BreadCrumb from '../../ui_components/breadcrumb';
import { GROUPS, TOAST } from '../../../constants';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import SelectWrapper from '../../global/SelectWrapper';

const Edit = ({ beneficiaryId }) => {
	console.log({ beneficiaryId });
	const { addToast } = useToasts();
	const { listAid, addBeneficiary } = useContext(BeneficiaryContext);

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		address_temporary: '',
		govt_id: ''
	});

	const [extras, setExtras] = useState({
		age: '',
		education: '',
		profession: '',
		family_members: '',
		adult: '',
		child: ''
	});

	const [projectList, setProjectList] = useState([]);

	const [selectedGender, setSelectedGender] = useState('');
	const [selectedGroup, setSelectedGroup] = useState('');
	const [selectedProject, setSelectedProject] = useState('');

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleExtraInfoChange = e => {
		setExtras({ ...extras, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);

		if (selectedGroup) extras.group = selectedGroup;
		const payload = { ...formData, extras: { ...extras } };
		payload.project_id = selectedProject;
		if (selectedGender) payload.gender = selectedGender;
		addBeneficiary(payload)
			.then(() => {
				addToast('Beneficiary added successfully', TOAST.SUCCESS);
				History.push('/beneficiaries');
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleGenderChange = e => setSelectedGender(e.target.value);

	const handleGroupChange = e => setSelectedGroup(e.target.value);

	const handleProjectChange = d => setSelectedProject(d.value);

	const handleCancelClick = () => History.push('/beneficiaries');

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
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Edit" />

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<FormGroup>
									<Label>Project</Label>
									<SelectWrapper
										onChange={handleProjectChange}
										maxMenuHeight={130}
										data={projectList}
										placeholder="--Select Project--"
									/>
								</FormGroup>

								<FormGroup>
									<Label>Name</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Phone</Label>
											<Input type="text" value={formData.phone} name="phone" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Email</Label>
											<Input type="text" value={formData.email} name="email" onChange={handleInputChange} />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange}>
												<option value="">--Select Gender--</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
												<option value="O">Other</option>
											</Input>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="age">Age</label>
											<br />
											<Input
												name="age"
												value={extras.age}
												type="number"
												className="form-field"
												onChange={handleExtraInfoChange}
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Permanent Address</Label>
											<Input type="text" value={formData.address} name="address" onChange={handleInputChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Temporary Address</Label>
											<Input
												type="text"
												value={formData.address_temporary}
												name="address_temporary"
												onChange={handleInputChange}
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Education</Label>
											<Input type="text" value={extras.education} name="education" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="profession">Profession</label>
											<br />
											<Input
												name="profession"
												value={extras.profession}
												type="text"
												className="form-field"
												onChange={handleExtraInfoChange}
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="govt_id" value={formData.govt_id}>
												Government ID number
											</label>
											<br />
											<Input
												name="govt_id"
												value={formData.govt_id}
												type="number"
												className="form-field"
												onChange={handleInputChange}
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Group</Label>
											<Input type="select" name="group" onChange={handleGroupChange}>
												<option value="">--Select Group--</option>
												<option value={GROUPS.DIFFERENTLY_ABLED.value}>{GROUPS.DIFFERENTLY_ABLED.label}</option>
												<option value={GROUPS.MATERNITY.value}>{GROUPS.MATERNITY.label}</option>
												<option value={GROUPS.SENIOR_CITIZENS.value}>{GROUPS.SENIOR_CITIZENS.label}</option>
												<option value={GROUPS.COVID_VICTIM.value}>{GROUPS.COVID_VICTIM.label}</option>
												<option value={GROUPS.NATURAL_CLIMATE_VICTIM.value}>
													{GROUPS.NATURAL_CLIMATE_VICTIM.label}
												</option>
												<option value={GROUPS.UNDER_PRIVILAGED.value}>{GROUPS.UNDER_PRIVILAGED.label}</option>
												<option value={GROUPS.SEVERE_HEATH_ISSUES.value}>{GROUPS.SEVERE_HEATH_ISSUES.label}</option>
												<option value={GROUPS.SINGLE_WOMAN.value}>{GROUPS.SINGLE_WOMAN.label}</option>
												<option value={GROUPS.ORPHAN.value}>{GROUPS.ORPHAN.label}</option>
											</Input>
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<label htmlFor="family_members">Number of family members</label>
									<br />
									<Input
										name="family_members"
										value={extras.family_members}
										type="number"
										className="form-field"
										onChange={handleExtraInfoChange}
									/>
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Adult</Label>
											<Input type="number" value={extras.adult} name="adult" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Child</Label>
											<Input type="number" value={extras.child} name="child" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
								</Row>

								<CardBody style={{ paddingLeft: 0 }}>
									{/* {loading ? (
										<GrowSpinner />
									) : ( */}
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
