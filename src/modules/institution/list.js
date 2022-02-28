import React, { useState, useEffect, useContext, useCallback } from 'react';
import { InstitutionContext } from '../../contexts/InstitutionContext';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';

import {
	Card,
	CardBody,
	CardTitle,
	Button,
	Input,
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

import AdvancePagination from '../global/AdvancePagination';
import { APP_CONSTANTS } from '../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;
const SEARCH_OPTIONS = { PHONE: 'phone', NAME: 'name' };

const Institution = () => {
	const { addToast } = useToasts();
	const [model, setModel] = useState(false);
	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(null);
	const [searchValue, setSearchValue] = useState('');

	const { listInstitution, institution, addInstitution } = useContext(InstitutionContext);

	const toggle = () => setModel(!model);

	const fetchInstitutionList = query => {
		let params = { start: 0, limit: PAGE_LIMIT, ...query };
		listInstitution(params)
			.then(d => {
				setTotalRecords(d.total);
			})
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const loadInstitutionList = query => {
		if (!query) query = null;
		listInstitution(query)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(loadInstitutionList, []);

	const handleFilterChange = e => {
		let { value } = e.target;
		if (value === SEARCH_OPTIONS.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: SEARCH_OPTIONS.NAME
			});
		}
		if (value === SEARCH_OPTIONS.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: SEARCH_OPTIONS.PHONE
			});
		}
		setSearchValue('');
		fetchInstitutionList({});
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (filter.searchBy === SEARCH_OPTIONS.PHONE && value) {
			return fetchInstitutionList({ phone: value });
		}
		if (filter.searchBy === SEARCH_OPTIONS.NAME && value) {
			return fetchInstitutionList({ name: value });
		}
		fetchInstitutionList({});
	};

	const getQueryParams = useCallback(() => {
		const params = {};
		if (filter.searchBy === SEARCH_OPTIONS.PHONE && searchValue) params.phone = searchValue;
		if (filter.searchBy === SEARCH_OPTIONS.NAME && searchValue) params.name = searchValue;
		return params;
	}, [filter.searchBy, searchValue]);

	const onPageChanged = useCallback(
		async paginationData => {
			const params = getQueryParams();
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, ...params };
			listInstitution(query);
		},
		[getQueryParams, listInstitution]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await listInstitution({ start: 0, limit: PAGE_LIMIT });
		setTotalRecords(data.total);
	}, [listInstitution]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="4">Institutions</Col>
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
									<th className="border-0">S.N.</th>
									<th className="border-0">Name</th>
									<th className="border-0">Phone</th>
									<th className="border-0">Address</th>
									<th className="border-0">Action</th>
								</tr>
							</thead>
							<tbody>
								{institution.length ? (
									institution.map((e, i) => (
										<tr key={e._id}>
											<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
											<td>
												<div className="d-flex no-block align-items-center">
													<h5 className="mb-0 font-16 font-medium">{e.name}</h5>
												</div>
											</td>
											<td>{e.phone || 'N/A'}</td>
											<td>{e.address || 'N/A'}</td>
											<td className="blue-grey-text text-darken-4 font-medium">
												<Link to={`/institutions/${e._id}`}>
													<i className="fas fa-eye fa-lg"></i>
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
						{totalRecords > 0 && (
							<AdvancePagination
								totalRecords={totalRecords}
								pageLimit={PAGE_LIMIT}
								pageNeighbours={1}
								onPageChanged={onPageChanged}
							/>
						)}
					</CardBody>
				</Card>
			</div>

			<Modal isOpen={model} toggle={toggle}>
				<Form
					onSubmit={e => {
						e.preventDefault();
						addInstitution(e)
							.then(() => {
								addToast('Institution Added Successfully', {
									appearance: 'success',
									autoDismiss: true
								});
								fetchInstitutionList({});
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
							<h3>Add Institution</h3>
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
							<label htmlFor="phone">Phone</label>
							<br />
							<Input name="phone" type="text" placeholder="Contact Number" className="form-field" required />
						</div>
						<br />
						<div className="form-item">
							<label htmlFor="address">Address</label>
							<br />
							<Input name="address" type="text" placeholder="Address" className="form-field" required />
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

export default Institution;
