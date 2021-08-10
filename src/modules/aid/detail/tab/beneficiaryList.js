import React, { useContext } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

import { AidContext } from '../../../../contexts/AidContext';

const List = ({ beneficiaries, projectId }) => {
	const { beneficiary_pagination, beneficiaryByAid } = useContext(AidContext);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * beneficiary_pagination.limit;
		return beneficiaryByAid(projectId, { start: _start });
	};

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
					{/* <button type="button" class="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
						Add Beneficiary
					</button> */}
				</div>
			</div>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Govt. ID</th>
					</tr>
				</thead>
				<tbody>
					{beneficiaries.length > 0 ? (
						beneficiaries.map(d => {
							return (
								<tr key={d._id}>
									<td>{d.name}</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone}</td>
									<td>{d.govt_id || '-'}</td>
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

			{beneficiary_pagination.totalPages > 1 ? (
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
					{[...Array(beneficiary_pagination.totalPages)].map((p, i) => (
						<PaginationItem
							key={i}
							active={beneficiary_pagination.currentPage === i + 1 ? true : false}
							onClick={() => handlePagination(i + 1)}
						>
							<PaginationLink href={`#page=${i + 1}`}>{i + 1}</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationLink
							last
							href="#last_page"
							onClick={() => handlePagination(beneficiary_pagination.totalPages)}
						/>
					</PaginationItem>
				</Pagination>
			) : (
				''
			)}
		</>
	);
};

export default List;
