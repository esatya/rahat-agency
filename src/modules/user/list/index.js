import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { UserContext } from '../../../contexts/UserContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import AdvancePagination from '../../global/AdvancePagination';
import { APP_CONSTANTS, ROLES } from '../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

const List = () => {
	const { listUsers } = useContext(UserContext);
	const { addToast } = useToasts();

	const [searchName, setSearchName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [users, setUsers] = useState([]);
	const [totalRecords, setTotalRecords] = useState(null);

	const handleAddUserClick = () => History.push('/add_user');

	function renderSingleRole(roles) {
		if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
		if (roles.includes(ROLES.MANAGER)) return ROLES.MANAGER;
		if (roles.includes(ROLES.MOBILIZER)) return ROLES.MOBILIZER;
		return '-';
	}

	const handleSearchInputChange = e => {
		const query = {};
		const { value } = e.target;
		if (value) query.name = value;
		setSearchName(value);
		listUsers(query)
			.then(res => {
				setTotalRecords(res.total);
				setUsers(res.data);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			const d = await listUsers(query);
			setUsers(d.data);
		},
		[listUsers]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await listUsers({ start: 0, limit: PAGE_LIMIT });
		setTotalRecords(data.total);
	}, [listUsers]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
			<Card>
				<CardTitle className="mb-0 pt-3">
					<span style={{ paddingLeft: 26 }}>Users</span>
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
								<Button type="button" onClick={handleAddUserClick} className="btn" color="info">
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
								<th className="border-0">Email</th>
								<th className="border-0">Phone</th>
								<th className="border-0">Role</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{users.length ? (
								users.map((d, i) => {
									return (
										<tr key={d._id}>
											<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
											<td>{`${d.name.first} ${d.name.last}`}</td>
											<td>{d.email}</td>
											<td>{d.phone || '-'}</td>
											<td>{renderSingleRole(d.roles)}</td>
											<td className="blue-grey-text  text-darken-4 font-medium">
												<Link to={`/${d._id}/users`}>
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
		</>
	);
};

export default List;
