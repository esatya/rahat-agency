import React, { useState, useEffect, useContext } from 'react';
import { MobilizerContext } from '../../contexts/MobilizerContext';
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
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	Table,
	Row,
	Col,
	CustomInput
} from 'reactstrap';

import displayPic from '../../assets/images/users/user_avatar.svg';

const searchOptions = { PHONE: 'phone', NAME: 'name' };

const Mobilizer = () => {
	const { addToast } = useToasts();
	const [model, setModel] = useState(false);
	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});

	const { listMobilizer, list, pagination, addMobilizer } = useContext(MobilizerContext);

	const toggle = () => setModel(!model);

	const fetchList = query => {
		console.log('LSIISHD');
		let params = { ...pagination, ...query };
		console.log({ params });
		listMobilizer(params)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(fetchList, []);

	const handleFilterChange = e => {
		let { value } = e.target;
		if (value === searchOptions.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: searchOptions.NAME
			});
		}
		if (value === searchOptions.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: searchOptions.PHONE
			});
		}
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
		fetchList({ start: 0, limit: pagination.limit });
	};

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		return fetchList({ start: _start, limit: pagination.limit });
	};

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="4">Mobilizers</Col>
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
										onChange={handleFilterChange}
										style={{ width: 'auto' }}
									>
										<option value="phone">Search By Phone</option>
										<option value="name">By Name</option>
									</CustomInput>
									<div style={{ display: 'inline-flex' }}>
										<Input
											placeholder={filter.searchPlaceholder}
											onChange={handleSearchInputChange}
											style={{ width: '100%' }}
										/>
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
									<th className="border-0">Action</th>
								</tr>
							</thead>
							<tbody>
								{list.length ? (
									list.map((e, i) => (
										<tr key={e._id}>
											<td>{(pagination.currentPage - 1) * pagination.limit + i + 1}</td>
											<td>
												<div className="d-flex no-block align-items-center">
													<div className="mr-2">
														<img src={displayPic} alt="user" className="rounded-circle" width="45" />
													</div>
													<div className="">
														<h5 className="mb-0 font-16 font-medium">{e.name}</h5>
														<span>{e.email ? e.email : '-'}</span>
													</div>
												</div>
											</td>
											<td>{e.phone}</td>
											<td>{e.address}</td>
											<td className="blue-grey-text  text-darken-4 font-medium">
												<Link className="btn btn-secondary" to={`/mobilizers/${e._id}`}>
													Details
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td style={{ textAlign: 'center' }} colSpan={4}>
											No data available
										</td>
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
						addMobilizer(e)
							.then(() => {
								addToast('Mobilizer Added Successfully', {
									appearance: 'success',
									autoDismiss: true
								});
								fetchList({});
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
							<h3>Add Mobilizer</h3>
						</div>
					</ModalHeader>
					<ModalBody>
						<div className="form-item">
							<label htmlFor="name">Name</label>
							<br />
							<Input name="name" type="text" placeholder="Full Name" className="form-field" required />
						</div>
						<br />

						<div className="form-item">
							<label htmlFor="ethaddress">Wallet Address</label>
							<br />
							<Input name="ethaddress" type="text" placeholder="Wallet Address" className="form-field" required />
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
								<label htmlFor="address">Address</label>
								<br />
								<Input name="address" type="text" placeholder="Your Address" className="form-field" required />
							</div>
							<div className="form-item">
								<label htmlFor="govt_id">Government Id</label>
								<br />
								<Input name="govt_id" type="text" placeholder="Govt Id" className="form-field" required />
							</div>
						</div>
						<br />
						<div className="form-item">
							<label htmlFor="ethaddress">Organization</label>
							<br />
							<Input name="organization" type="text" placeholder="Organization" className="form-field" required />
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

export default Mobilizer;
