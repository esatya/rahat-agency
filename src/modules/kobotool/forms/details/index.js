import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { useToasts } from 'react-toast-notifications';
import {
	Card,
	CardBody,
	CardTitle,
	Button,
	Input,
	Pagination,
	PaginationItem,
	PaginationLink,
	Table,
	Row,
	Col
} from 'reactstrap';
import BreadCrumb from '../../../ui_components/breadcrumb';

const KoboFormDetails = props => {
	const { addToast } = useToasts();
	const assetId = props.match.params.id;

	const { getKoboFormsData, pagination } = useContext(AppContext);
	const [info, setInfo] = useState([]);

	const handleSearchInputChange = e => {
		const { value } = e.target;
		fetchList({ start: 0, limit: pagination.limit, name: value });
	};

	const fetchList = () => {
		// let params = { ...pagination, ...query };
		getKoboFormsData(assetId)
			.then(res => {
				setInfo(res.data);
			})
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(fetchList, []);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		const query = { start: _start, limit: pagination.limit };
		return fetchList(query);
	};

	const handleImportClick = () => {};

	return (
		<div className="main">
			<p className="page-heading">Kobo Toolbox</p>
			<BreadCrumb root_label="Kobo Toolbox" current_label="Details" redirect_path="kobo-toolbox" />

			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="10">
								<Input placeholder="Search by name ..." onChange={handleSearchInputChange} style={{ width: '40%' }} />
							</Col>
							<Col md="2">
								<div>
									<Button type="button" onClick={handleImportClick} className="btn" color="info">
										Import
									</Button>
								</div>
							</Col>
						</Row>
					</CardTitle>
					<CardBody>
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">S.N.</th>
									<th className="border-0">Name</th>
									<th className="border-0">Address</th>
									<th className="border-0">Phone</th>
								</tr>
							</thead>
							<tbody>
								{info.length ? (
									info.map((d, i) => {
										return (
											<tr key={d._id}>
												<td>{(pagination.currentPage - 1) * pagination.limit + i + 1}</td>
												<td>{d.name}</td>
												<td>{d.address}</td>
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
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default KoboFormDetails;
