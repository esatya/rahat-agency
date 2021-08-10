import React, { useContext } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

import { AidContext } from '../../../../contexts/AidContext';

const List = () => {
	const { pagination } = useContext(AidContext);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		console.log({ _start });
	};

	const vendors = [];

	return (
		<>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Balance</th>
						<th className="border-0">Total Token Redeemed</th>
					</tr>
				</thead>
				<tbody>
					{vendors.length ? (
						vendors.map(d => {
							return (
								<tr key={d._id}>
									<td>XYZ</td>
									<td>Kavre</td>
									<td>9867453212</td>
									<td>150000</td>
									<td>50000</td>
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
