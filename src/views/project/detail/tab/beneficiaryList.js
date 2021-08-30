import React, { useContext, useEffect } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../../contexts/AidContext';

const List = () => {
	const { aids, pagination, listAid } = useContext(AidContext);
	const { addToast } = useToasts();

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		return loadAidList({ start: _start, limit: pagination.limit });
	};

	const loadAidList = () => {
		let query = {};
		listAid(query)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(loadAidList);

	return (
		<>
			<div className="toolbar-flex-container">
				<div style={{ flex: 1, padding: 10 }}>
					<button
						type="button"
						class="btn waves-effect waves-light btn-outline-info"
						style={{ borderRadius: '8px', marginRight: '20px' }}
					>
						Bulk Token Issue
					</button>
					<button type="button" class="btn waves-effect waves-light btn-outline-info" style={{ borderRadius: '8px' }}>
						Bulk Generate QR Code
					</button>
				</div>

				<div className="flex-item">
					<button type="button" class="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
						Add Beneficiary
					</button>
				</div>
			</div>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Total Token Issued</th>
						<th className="border-0">Total Token Redeemed</th>
					</tr>
				</thead>
				<tbody>
					{aids.length ? (
						aids.map(d => {
							return (
								<tr key={d._id}>
									<td>XYZ</td>
									<td>Kavre</td>
									<td>9867453212</td>
									<td>1500</td>
									<td>500</td>
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
		</>
	);
};

export default List;
