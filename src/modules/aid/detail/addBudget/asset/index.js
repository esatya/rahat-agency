import React from 'react';
import { Table } from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';

export default function (props) {
	const history = useHistory();
	const { projectId } = props;

	const handlePackageClick = () => {
		history.push(`/add-asset/${projectId}`);
	};
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
						<th className="border-0">S.N.</th>
						<th className="border-0">Name</th>
						<th className="border-0">Quantity</th>
						<th className="border-0">Details</th>
					</tr>
				</thead>
				<tbody>
					{/* {aids.length ? (
								aids.map((d, i) => {
									return ( */}
					<tr
					// key={d._id}
					>
						<td>{/* {(pagination.currentPage - 1) * pagination.limit + i + 1} */}1</td>
						<td>John Doe</td>
						<td>
							{/* {d.location || '-'} */}
							1500
						</td>
						<td className="blue-grey-text  text-darken-4 font-medium">
							<Link to={`/mint-asset/${projectId}`}>
								<i class="fas fa-eye fa-lg"></i>
							</Link>
						</td>
					</tr>
					{/* );
								})
							) : (
								<tr>
									<td colSpan={2}></td>
									<td>No data available.</td>
								</tr>
							)} */}
				</tbody>
			</Table>
		</>
	);
}
