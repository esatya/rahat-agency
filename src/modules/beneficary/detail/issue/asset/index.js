import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import { AidContext } from '../../../../../contexts/AidContext';

export default function (props) {
	const { projectId } = props;

	const { listNftPackages } = useContext(AidContext);

	const [packageList, setPackageList] = useState([]);

	const fetchPackageList = useCallback(async () => {
		const query = {};
		const d = await listNftPackages(projectId, query);
		if (d && d.data) setPackageList(d.data);
	}, [projectId, listNftPackages]);

	useEffect(() => {
		fetchPackageList();
	}, [fetchPackageList]);

	return (
		<>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Select</th>
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
										<input type="checkbox" />
									</td>
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
		</>
	);
}
