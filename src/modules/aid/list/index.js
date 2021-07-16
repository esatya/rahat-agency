import React, { useContext, useEffect, useState } from 'react';
import {
	Row,
	Col,
	Button,
	Card,
	CardBody,
	CardTitle,
	Pagination,
	PaginationItem,
	PaginationLink,
	FormGroup,
	Label,
	Input,
	InputGroup,
	Table,
	CustomInput
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';

import { AidContext } from '../../../contexts/AidContext';
import AidModal from '../../global/CustomModal';

const List = () => {
	const { aids, pagination, listAid, addAid } = useContext(AidContext);
	const { addToast } = useToasts();
	const [aidModal, setaidModal] = useState(false);
	const [aidPayload, setaidPayload] = useState({ name: '' });

	const toggleModal = () => {
		setaidModal(!aidModal);
	};

	const handleInputChange = e => {
		setaidPayload({ ...aidPayload, [e.target.name]: e.target.value });
	};

	const handleAidSubmit = e => {
		e.preventDefault();
		addAid(aidPayload)
			.then(() => {
				toggleModal();
				addToast('Project created successfully.', {
					appearance: 'success',
					autoDismiss: true
				});
				loadAidList();
				setaidPayload({ name: '' });
			})
			.catch(err => {
				addToast(err, {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		return loadAidList({ start: _start, limit: pagination.limit });
	};

	const loadAidList = query => {
		if (!query) query = null;
		listAid(query)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(loadAidList, []);

	return (
		<>
			<AidModal toggle={toggleModal} open={aidModal} title="Add Project" handleSubmit={handleAidSubmit}>
				<FormGroup>
					<Label>Name</Label>
					<InputGroup>
						<Input
							type="text"
							name="name"
							placeholder="Enter project name."
							value={aidPayload.name}
							onChange={handleInputChange}
							required
						/>
					</InputGroup>
				</FormGroup>
			</AidModal>
			<Card>
				<CardTitle className="mb-0 p-3">
					<Row>
						<Col md="4">
							<Input placeholder="Search by name" style={{ width: '100%' }} />
						</Col>
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
								>
									<option value="">Filter by status</option>
									<option value="active">Active</option>
									<option value="draft">Draft</option>
								</CustomInput>
							</div>
						</Col>
						<Col md="2">
							<div style={{ marginLeft: 30 }}>
								<Button onClick={toggleModal} className="btn" color="info">
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
								<th className="border-0">Created At</th>
								<th className="border-0">Status</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{aids.length ? (
								aids.map(d => {
									return (
										<tr key={d._id}>
											<td>{d.name}</td>
											<td>{moment(d.created_at).format('MMM Do YY')}</td>
											<td>{d.status.toUpperCase()}</td>
											<td className="blue-grey-text  text-darken-4 font-medium">
												<Link to={`/projects/${d._id}`}>
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
		</>
	);
};

export default List;
