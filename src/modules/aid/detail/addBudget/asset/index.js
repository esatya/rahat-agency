import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Table } from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';

import { AidContext } from '../../../../../contexts/AidContext';

export default function (props) {
	const history = useHistory();
	const { projectId } = props;

	const { listNftPackages } = useContext(AidContext);

	const [packageList, setPackageList] = useState([]);

	const handlePackageClick = () => {
		history.push(`/add-asset/${projectId}/`);
	};

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
			<button
				onClick={handlePackageClick}
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
										<Link to={`/mint-asset/${d._id}`}>
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
