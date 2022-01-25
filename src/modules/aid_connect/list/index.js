import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, CustomInput, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import { History } from '../../../utils/History';
import { APP_CONSTANTS } from '../../../constants';
import { dottedString } from '../../../utils';

const { PAGE_LIMIT } = APP_CONSTANTS;

const beneficiaries = [
	{
		_id: 34567,
		name: 'superman',
		phone: 1234,
		address: 'LA, USA',
		project: 'Wash programme'
	}
];

const List = () => {
	const [searchName, setSearchName] = useState('');
	const currentPage = 1;

	const handleCreateFormClick = () => History.push('/aid-connect/form');

	const handleImportClick = () => {};

	const handleSearchInputChange = e => {
		const query = {};
		const { value } = e.target;
		if (value) query.name = value;
		setSearchName(value);
	};

	return (
		<>
			<Card>
				<CardTitle className="mb-0 pt-3">
					<span style={{ paddingLeft: 26 }}>Aid connect</span>
				</CardTitle>
				<CardTitle className="mb-0 p-3">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<input
							style={{ width: '40%' }}
							className="custom-input-box"
							value={searchName || ''}
							onChange={handleSearchInputChange}
							placeholder="Search by name..."
						/>
						<div style={{ display: 'flex' }}>
							<Button type="button" onClick={handleCreateFormClick} className="btn mr-3" color="info">
								Create form
							</Button>

							<Button
								type="button"
								onClick={handleImportClick}
								className="btn"
								color="success"
								outline={true}
								style={{ borderRadius: '8px' }}
							>
								Import
							</Button>
						</div>
					</div>
				</CardTitle>
				<CardBody>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">
									<CustomInput type="checkbox" id="selectAll" />
								</th>

								<th className="border-0">S.N.</th>
								<th className="border-0">Name</th>
								<th className="border-0">Phone</th>
								<th className="border-0">Address</th>
								<th className="border-0">Project</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{beneficiaries.length ? (
								beneficiaries.map((d, i) => {
									return (
										<tr key={d._id}>
											<th>
												<CustomInput type="checkbox" id={d._id} />
											</th>
											<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
											<td>{dottedString(`${d.name}`)}</td>
											<td>{d.phone || '-'}</td>
											<td>{d.address}</td>
											<td>{d.project}</td>
											<td className="blue-grey-text  text-darken-4 font-medium">
												<Link to={`/${d._id}/users`}>
													<i className="fas fa-eye fa-lg"></i>
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

					{/* {totalRecords > 0 && (
						<AdvancePagination
							totalRecords={totalRecords}
							pageLimit={PAGE_LIMIT}
							pageNeighbours={1}
							onPageChanged={onPageChanged}
						/>
					)} */}
				</CardBody>
			</Card>
		</>
	);
};

export default List;
