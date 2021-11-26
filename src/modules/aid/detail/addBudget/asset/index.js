import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Table } from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';

import { AidContext } from '../../../../../contexts/AidContext';
import AdvancePagination from '../../../../global/AdvancePagination';

import { APP_CONSTANTS } from '../../../../../constants';
const { PAGE_LIMIT } = APP_CONSTANTS;

export default function (props) {
	const history = useHistory();
	const { projectId } = props;

	const { listNftPackages } = useContext(AidContext);

	const [packageList, setPackageList] = useState([]);
	const [totalRecords, setTotalRecords] = useState(null);

	const handleCreateClick = () => {
		history.push(`/add-package/${projectId}/`);
	};

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			const data = await listNftPackages(projectId, query);
			if (data) setPackageList(data.data);
		},
		[listNftPackages, projectId]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await listNftPackages(projectId);
		if (data) setTotalRecords(data.total);
	}, [listNftPackages, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
			<button
				onClick={handleCreateClick}
				type="button"
				className="btn waves-effect waves-light btn-outline-info "
				style={{ borderRadius: '8px', margin: '20px 0px' }}
			>
				Create package
			</button>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Quantity</th>
						<th className="border-0">Created By</th>
						<th className="border-0">Details</th>
					</tr>
				</thead>
				<tbody>
					{packageList.length > 0 ? (
						packageList.map((d, i) => {
							return (
								<tr key={d._id}>
									<td>
										{d.name} ({d.symbol})
									</td>
									<td>{d.totalSupply}</td>
									<td>
										{d.createdBy.name.first} {d.createdBy.name.last || ''}
									</td>
									<td className="blue-grey-text  text-darken-4 font-medium">
										<Link to={`/mint-package/${d._id}/project/${projectId}`}>
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
					)}{' '}
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
}
