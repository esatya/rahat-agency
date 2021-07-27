import React, { useState, useEffect, useContext } from 'react';
import { BeneficiaryContext } from '../../contexts/BeneficiaryContext';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import {
	Card,
	CardBody,
	CardTitle,
	Button,
	Input,
	Pagination,
	PaginationItem,
	PaginationLink,
	CustomInput,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Table,
	Form,
	Row,
	Col
} from 'reactstrap';
import displayPic from '../../assets/images/users/user_avatar.svg';

const searchOptions = { PHONE: 'phone', NAME: 'name', PROJECT: 'project' };

const Beneficiary = () => {
	const { addToast } = useToasts();
	const [model, setModel] = useState(false);

	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});
	const [selectedProject, setSelectedProject] = useState('');

	const { listBeneficiary, list, pagination, listAid, projectList, addBeneficiary } = useContext(BeneficiaryContext);

	const handleFilterChange = e => {
		let { value } = e.target;
		if (value === searchOptions.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: searchOptions.NAME
			});
		}
		if (value === searchOptions.PROJECT) {
			setFilter({
				searchPlaceholder: 'Select project...',
				searchBy: searchOptions.PROJECT
			});
		}
		if (value === searchOptions.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: searchOptions.PHONE
			});
		}
		setSelectedProject('');
		fetchList({ start: 0, limit: pagination.limit });
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		if (filter.searchBy === searchOptions.PHONE) {
			return fetchList({ start: 0, limit: pagination.limit, phone: value });
		}
		if (filter.searchBy === searchOptions.NAME) {
			return fetchList({ start: 0, limit: pagination.limit, name: value });
		}
		if (filter.searchBy === searchOptions.PROJECT) {
			setSelectedProject(value);
			return fetchList({ start: 0, limit: pagination.limit, projectId: value });
		}
		fetchList({ start: 0, limit: pagination.limit });
	};

	const toggle = () => setModel(!model);

	const fetchList = query => {
		let params = { ...pagination, ...query };
		listBeneficiary(params)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const fetchProjectList = () => {
		listAid()
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(fetchList, []);
	useEffect(fetchProjectList, []);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		const query = { start: _start, limit: pagination.limit };
		if (selectedProject) query.projectId = selectedProject;
		return fetchList(query);
	};

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="4">Beneficiaries</Col>
							<Col md="6">
								<div
									style={{
										float: 'right',
										display: 'flex'
									}}
								>
									<CustomInput
										type="select"
										id="exampleCustomSelect"
										name="customSelect"
										defaultValue=""
										style={{ width: 'auto' }}
										onChange={handleFilterChange}
									>
										<option value="phone">Search By Phone</option>
										<option value="name">By Name</option>
										<option value="project">By Project</option>
									</CustomInput>
									<div style={{ display: 'inline-flex' }}>
										{filter.searchBy === searchOptions.PROJECT ? (
											<CustomInput
												type="select"
												id="aid"
												name="aid"
												defaultValue=""
												className="form-field"
												onChange={handleSearchInputChange}
												required
											>
												<option value="" disabled>
													--Select Project--
												</option>
												{projectList.map(e => (
													<option key={e._id} value={e._id}>
														{e.name}
													</option>
												))}
											</CustomInput>
										) : (
											<Input
												placeholder={filter.searchPlaceholder}
												onChange={handleSearchInputChange}
												style={{ width: '100%' }}
											/>
										)}
									</div>
								</div>
							</Col>
							<Col md="2">
								<div>
									<Button onClick={() => toggle()} className="btn" color="info">
										Add New
									</Button>
								</div>
							</Col>
						</Row>
					</CardTitle>
					<CardBody>
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">Name</th>
									<th className="border-0">Phone</th>
									<th className="border-0">Address</th>
									<th className="border-0">Govt. ID</th>
									<th className="border-0">Action</th>
								</tr>
							</thead>
							<tbody>
								{list.length ? (
									list.map(d => {
										return (
											<tr key={d._id}>
												<td>
													<div className="d-flex no-block align-items-center">
														<div className="mr-2">
															<img src={displayPic} alt="user" className="rounded-circle" width="45" />
														</div>
														<div className="">
															<h5 className="mb-0 font-16 font-medium">{d.name}</h5>
															<span>{d.email ? d.email : '-'}</span>
														</div>
													</div>
												</td>
												<td>{d.phone}</td>
												<td>{d.address}</td>
												<td>{d.govt_id ? d.govt_id : '-'}</td>
												<td>
													<Link to={`/beneficiaries/${d._id}`}>
														<i class="fas fa-eye fa-lg"></i>
													</Link>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={2}></td>
										<td>No data available.</td>
									</tr>
								)}
							</tbody>
						</Table>

						{pagination.totalPages > 1 ? (
							<Pagination
								style={{
									display: 'flex',
									justifyContent: 'center',
									marginTop: '50px'
								}}
							>
								<PaginationItem>
									<PaginationLink first href="#first_page" onClick={() => handlePagination(1)} />
								</PaginationItem>
								{[...Array(pagination.totalPages)].map((p, i) => (
									<PaginationItem
										key={i}
										active={pagination.currentPage === i + 1 ? true : false}
										onClick={() => handlePagination(i + 1)}
									>
										<PaginationLink href={`#page=${i + 1}`}>{i + 1}</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationLink last href="#last_page" onClick={() => handlePagination(pagination.totalPages)} />
								</PaginationItem>
							</Pagination>
						) : (
							''
						)}
					</CardBody>
				</Card>
			</div>

			<Modal isOpen={model} toggle={toggle}>
				<Form
					onSubmit={e => {
						e.preventDefault();
						addBeneficiary(e)
							.then(d => {
								addToast('Beneficiary Added successfully', {
									appearance: 'success',
									autoDismiss: true
								});
								fetchList();
								toggle();
							})
							.catch(err =>
								addToast(err.message, {
									appearance: 'error',
									autoDismiss: true
								})
							);
					}}
				>
					<ModalHeader toggle={toggle}>
						<div>
							<h3>Add Beneficiary</h3>
						</div>
					</ModalHeader>
					<ModalBody>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="aid">Project</label>
								<br />

								<CustomInput type="select" id="aid" name="aid" defaultValue="" className="form-field" required>
									<option value="" disabled>
										All
									</option>
									{projectList.map(e => (
										<option key={e._id} value={e._id}>
											{e.name}
										</option>
									))}
								</CustomInput>
							</div>
							<div className="form-item">
								<label htmlFor="name">Name</label>
								<br />
								<Input name="name" type="text" placeholder="Full Name" className="form-field" required />
							</div>
						</div>
						<br />
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="email">Email</label>
								<br />
								<Input name="email" type="email" placeholder="Email Address" className="form-field" required />
							</div>
							<div className="form-item">
								<label htmlFor="phone">Phone</label>
								<br />
								<Input name="phone" type="number" placeholder="Phone no" className="form-field" required />
							</div>
						</div>
						<br />
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="wallet_address">Wallet Address</label>
								<br />
								<Input name="wallet_address" type="text" placeholder="Wallet Address" className="form-field" required />
							</div>

							<div className="form-item">
								<label htmlFor="govt_id">Government Id</label>
								<br />
								<Input name="govt_id" type="text" placeholder="Govt Id" className="form-field" required />
							</div>
						</div>
						<br />

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="address">Address</label>
								<br />
								<Input name="address" type="text" placeholder="Your Address" className="form-field" required />
							</div>
							<div className="form-item">
								<label htmlFor="address_temporary">Temporary Address</label>
								<br />
								<Input
									name="address_temporary"
									type="text"
									placeholder="Your temp Address"
									className="form-field"
									required
								/>
							</div>
						</div>
						<br />
					</ModalBody>
					<ModalFooter>
						<Button color="primary">Submit</Button>

						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Form>
			</Modal>
			<br />
		</div>
	);
};

export default Beneficiary;
