import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { History } from '../../../utils/History';
import BreadCrumb from '../../ui_components/breadcrumb';

const Add = () => {
	const [formData, setFormData] = useState({
		project: '',
		name: '',
		email: '',
		age: '',
		address: '',
		education: '',
		profession: '',
		governmentID: '',
		family_members: '',
		adult: '',
		child: '',

		wallet_address: ''
	});

	const handleInputChange = () => {};

	const handleFormSubmit = () => {};

	const handleGenderChange = () => {};

	const handleGroupChange = () => {};

	const handleCancelClick = () => {};

	return (
		<div>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Add" />

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<FormGroup>
									<Label>Project</Label>
									<Input type="text" value={formData.project} name="project" onChange={handleInputChange} required />
								</FormGroup>

								<FormGroup>
									<Label>Name</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange}>
												<option value="">--Select Gender--</option>
												<option value="Male">Male</option>
												<option value="Female">Female</option>
												<option value="Other">Other</option>
											</Input>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="age">Age</label>
											<br />
											<Input name="age" type="number" className="form-field" required />
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<Label>Address</Label>
									<Input type="text" value={formData.address} name="address" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Education</Label>
											<Input
												type="text"
												value={formData.education}
												name="education"
												onChange={handleInputChange}
												required
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="profession">Profession</label>
											<br />
											<Input name="profession" type="text" className="form-field" required />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="governmentID">Government ID number</label>
											<br />
											<Input name="governmentID" type="number" className="form-field" required />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Group</Label>
											<Input type="select" name="group" onChange={handleGroupChange}>
												<option value="">--Select Group--</option>
												<option value="Differently_Abled">Differently Abled</option>
												<option value="Maternity">Maternity</option>
												<option value="Senior_Citizens">Senior Citizens</option>
												<option value="Covid_Victim">Covid Victim</option>
												<option value="Natural_Calamities_Victim">Natural Calamities Victim</option>
												<option value="Under Privileged">Under Privileged</option>
												<option value="Severe_Health_Issues">Severe Health Issues</option>
												<option value="Single_Women">Single Women</option>
												<option value="Orphan">Orphan</option>
											</Input>
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<label htmlFor="family_members">Number of family members</label>
									<br />
									<Input name="family_members" type="number" className="form-field" required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Adult</Label>
											<Input type="number" value={formData.adult} name="adult" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Child</Label>
											<Input type="number" value={formData.child} name="child" onChange={handleInputChange} required />
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

export default Add;
