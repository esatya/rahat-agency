import React, { useEffect, useCallback, useState } from 'react';
import { Table } from 'reactstrap';
import AdvancePagination from '../../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

const UploadList = ({ data }) => {
	const [totalRecords, setTotalRecords] = useState(null);
	const [records, setRecords] = useState([]);

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			const offset = (currentPage - 1) * pageLimit;
			const sliced_data = data.slice(offset, offset + pageLimit);
			setRecords(sliced_data);
		},
		[data]
	);

	const fetchTotalRecords = useCallback(() => {
		if (data) setTotalRecords(data.length);
	}, [data]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
					</tr>
				</thead>
				<tbody>
					{records && records.length > 0 ? (
						records.map((d,i )=> {
							return (
								<tr key={i}>
									<td>{d.name}</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone}</td>
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
		</>
	);
};

export default UploadList;
