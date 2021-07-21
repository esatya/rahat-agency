import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
// import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { UserContext } from '../../../contexts/UserContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';

const List = () => {
	const { listUsers } = useContext(UserContext);
	const { addToast } = useToasts();

	const [searchName, setSearchName] = useState('');
	const [pagination, setPagination] = useState({
		start: 0,
		total_pages: 0,
		current_page: 1
	});
	const [users, setUsers] = useState([]);

	const handleAddUserClick = () => History.push('/add_user');

	const handleSearchInputChange = e => setSearchName(e.target.value);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		return fetchUserList({ start: _start, limit: pagination.limit });
	};

	const fetchUserList = () => {
		let query = {};
		if (searchName) query.name = searchName;
		if (pagination.start) query.start = pagination.start;
		listUsers(query)
			.then(res => {
				const { start, total, limit, data } = res;
				const total_pages = Math.ceil(total / limit);
				setUsers(data);
				setPagination({ ...pagination, start, total_pages });
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	useEffect(fetchUserList, [searchName, pagination.start]);

	return (
		<>
			<Card>
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
								<th className="border-0">Name</th>
								<th className="border-0">Email</th>
								<th className="border-0">Phone</th>
								<th className="border-0">Role</th>
								{/* <th className="border-0">Action</th> */}
							</tr>
						</thead>
						<tbody>
							{users.length ? (
								users.map(d => {
									return (
										<tr key={d._id}>
											<td>{d.full_name}</td>
											<td>{d.email}</td>
											<td>{d.phone || '-'}</td>
											<td>{d.roles.toString()}</td>
											{/* <td className="blue-grey-text  text-darken-4 font-medium">
												<Link to={`/users/${d._id}`}>
													<i class="fas fa-eye fa-lg"></i>
												</Link>
											</td> */}
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

					{pagination.total_pages > 1 ? (
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
							{[...Array(pagination.total_pages)].map((p, i) => (
								<PaginationItem
									key={i}
									active={pagination.currentPage === i + 1 ? true : false}
									onClick={() => handlePagination(i + 1)}
								>
									<PaginationLink href={`#page=${i + 1}`}>{i + 1}</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationLink last href="#last_page" onClick={() => handlePagination(pagination.total_pages)} />
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
