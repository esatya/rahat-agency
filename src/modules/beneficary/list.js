import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BeneficiaryContext } from '../../contexts/BeneficiaryContext';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Button, Input, CustomInput, Table, Row, Col } from 'reactstrap';
import moment from 'moment';

import displayPic from '../../assets/images/users/user_avatar.svg';
import { History } from '../../utils/History';
import AdvancePagination from '../global/AdvancePagination';
import { APP_CONSTANTS } from '../../constants';
import { dottedString } from '../../utils';

const { PAGE_LIMIT } = APP_CONSTANTS;
const SEARCH_OPTIONS = { PHONE: 'phone', NAME: 'name', PROJECT: 'project' };

const Beneficiary = () => {
	const { addToast } = useToasts();

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(null);
	const [benfList, setBenfList] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});
	const [selectedProject, setSelectedProject] = useState('');

	const { listBeneficiary, listProject, projectList } = useContext(BeneficiaryContext);

	const handleFilterOptionChange = e => {
		let { value } = e.target;
		if (value === SEARCH_OPTIONS.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: SEARCH_OPTIONS.NAME
			});
		}
		if (value === SEARCH_OPTIONS.PROJECT) {
			setFilter({
				searchPlaceholder: 'Select project...',
				searchBy: SEARCH_OPTIONS.PROJECT
			});
		}
		if (value === SEARCH_OPTIONS.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: SEARCH_OPTIONS.PHONE
			});
		}
		setSearchValue('');
		setSelectedProject('');
		fetchList({ start: 0, limit: PAGE_LIMIT });
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (filter.searchBy === SEARCH_OPTIONS.PHONE) {
			return fetchList({ start: 0, limit: PAGE_LIMIT, phone: value });
		}
		if (filter.searchBy === SEARCH_OPTIONS.NAME) {
			return fetchList({ start: 0, limit: PAGE_LIMIT, name: value });
		}
		if (filter.searchBy === SEARCH_OPTIONS.PROJECT) {
			setSelectedProject(value);
			return fetchList({ start: 0, limit: PAGE_LIMIT, projectId: value });
		}
		fetchList({ start: 0, limit: PAGE_LIMIT });
	};

	const fetchList = async params => {
		let query = { start: 0, limit: PAGE_LIMIT, ...params };
		const data = await listBeneficiary(query);
		setBenfList(data.data);
		setTotalRecords(data.total);
	};

	const fetchTotalRecords = useCallback(async () => {
		try {
			const data = await listBeneficiary({ start: 0, limit: PAGE_LIMIT });
			setTotalRecords(data.total);
		} catch (err) {
			addToast('Something went wrong!', {
				appearance: 'error',
				autoDismiss: true
			});
		}
	}, [addToast, listBeneficiary]);

	const fetchProjectList = () => {
		listProject()
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	useEffect(fetchProjectList, []);

	const getQueryParams = useCallback(() => {
		const params = {};
		if (filter.searchBy === SEARCH_OPTIONS.PHONE) params.phone = searchValue;
		if (filter.searchBy === SEARCH_OPTIONS.NAME) params.name = searchValue;
		if (filter.searchBy === SEARCH_OPTIONS.PROJECT) params.projectId = selectedProject;
		return params;
	}, [filter.searchBy, searchValue, selectedProject]);

	const onPageChanged = useCallback(
		async paginationData => {
			const params = getQueryParams();
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, ...params };
			const data = await listBeneficiary(query);
			setBenfList(data.data);
		},
		[getQueryParams, listBeneficiary]
	);

	const handleAddClick = () => History.push('/add-beneficiary');

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
										onChange={handleFilterOptionChange}
									>
										<option value="phone">Search By Phone</option>
										<option value="name">By Name</option>
										<option value="project">By Project</option>
									</CustomInput>
									<div style={{ display: 'inline-flex' }}>
										{filter.searchBy === SEARCH_OPTIONS.PROJECT ? (
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
									<Button type="button" onClick={handleAddClick} className="btn" color="info">
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
									<th className="border-0">Registration Date</th>
									<th className="border-0">Action</th>
								</tr>
							</thead>
							<tbody>
								{benfList.length > 0 ? (
									benfList.map((d, i) => {
										return (
											<tr key={d._id}>
												<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
												<td>
													<div className="d-flex no-block align-items-center">
														<div className="mr-2">
															<img src={displayPic} alt="user" className="rounded-circle" width="45" />
														</div>
														<div className="">
															<h5 className="mb-0 font-16 font-medium">{dottedString(d.name)}</h5>
															<span>{d.email ? d.email : '-'}</span>
														</div>
													</div>
												</td>
												<td>{d.phone}</td>
												<td>{dottedString(d.address)}</td>
												<td>{moment(d.created_at).format('MMM Do YYYY, hh:mm A')}</td>
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
		</div>
	);
};

export default Beneficiary;
