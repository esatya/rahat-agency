import React, { useContext, useEffect, useState } from 'react';
import {
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
import { History } from '../../../utils/History';

const List = () => {
	const { aids, pagination, listAid, addAid } = useContext(AidContext);
	const { addToast } = useToasts();
	const [aidModal, setaidModal] = useState(false);
	const [aidPayload, setaidPayload] = useState({ name: '' });

	const [searchName, setSearchName] = useState('');
	const [projectStatus, setProjectStatus] = useState('');

	const toggleModal = () => {
		setaidModal(!aidModal);
	};

	const handleAddProjectClick = () => History.push('/add-project');

	const handleProjectStatusChange = e => setProjectStatus(e.target.value);

	const handleInputChange = e => {
		setaidPayload({ ...aidPayload, [e.target.name]: e.target.value });
	};

	const handleSearchInputChange = e => setSearchName(e.target.value);

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

	const loadAidList = () => {
		let query = {};
		if (searchName) query.name = searchName;
		if (projectStatus) query.status = projectStatus;
		listAid(query)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(loadAidList, [projectStatus, searchName]);

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
				<CardTitle className="mb-0">
					<span style={{ paddingLeft: 26 }}>Projects</span>
				</CardTitle>
				<CardTitle className="mb-0 p-3">
					<div className="toolbar-flex-container">
						<div style={{ flex: 1, padding: 10 }}>
							<input
								style={{ width: '40%' }}
								className="custom-input-box"
								value={searchName || ''}
								onChange={handleSearchInputChange}
								placeholder="Search by name..."
							/>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="flex-item">
								<CustomInput
									onChange={handleProjectStatusChange}
									type="select"
									id="exampleCustomSelect"
									name="customSelect"
									value={projectStatus || ''}
									style={{ width: 'auto' }}
								>
									<option value="">--Select Status--</option>
									<option value="active">Active</option>
									<option value="draft">Draft</option>
								</CustomInput>
							</div>
							<div className="flex-item">
								<Button onClick={handleAddProjectClick} className="btn" color="info">
									Add New
								</Button>
							</div>
						</div>
					</div>
				</CardTitle>
				<CardBody>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">S.N.</th>
								<th className="border-0">Name</th>
								<th className="border-0">Location</th>
								<th className="border-0">Project Manager</th>
								<th className="border-0">Created Date</th>
								<th className="border-0">Status</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{aids.length ? (
								aids.map((d, i) => {
									return (
										<tr key={d._id}>
											<td>{(pagination.currentPage - 1) * pagination.limit + i + 1}</td>
											<td>{d.name}</td>
											<td>{d.location || '-'}</td>
											<td>
												{d.project_manager ? `${d.project_manager.name.first} ${d.project_manager.name.last}` : '-'}
											</td>
											<td>{moment(d.created_at).format('MMM Do YYYY')}</td>
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
