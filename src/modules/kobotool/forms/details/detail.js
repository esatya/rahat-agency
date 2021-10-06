import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { BeneficiaryContext } from '../../../../contexts/BeneficiaryContext';

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
import { TOAST } from '../../../../constants';


const KoboFormDetails = ({params}) => {
	const { id } = params;
	const { addToast } = useToasts();
	const { getKoboFormsData, pagination } = useContext(AppContext);
	const {addBeneficiaryInBulk} = useContext(BeneficiaryContext);
	const [koboData, setKoboData] = useState([]);
	const [importing, setImporting] = useState(false);
	const [koboLoading,setKoboLoading] = useState(false);

	const handleSearchInputChange = e => {
		const { value } = e.target;
		fetchList({ start: 0, limit: pagination.limit, name: value });
	};

	const fetchList = () => {
		setKoboLoading(true);
		getKoboFormsData(id)
			.then(res => {
				setKoboLoading(false);
				setKoboData(res.data);
			})
			.catch(() => {
				setKoboLoading(false);
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};


	const handlePagination = current_page => {
		let _start = (current_page - 1) * pagination.limit;
		const query = { start: _start, limit: pagination.limit };
		return fetchList(query);
	};

	const handleImportClick = () => {

		setImporting(true);
		const filteredData = koboData.map((el)=>{
			return {name:el.name,phone:el.phone,email:el.email,address:el.address};
		})
		addBeneficiaryInBulk(filteredData)
		.then((d) => {
		setImporting(false);
		if(d.inserted && d.inserted.total) addToast(`${d.inserted.total} Beneficiary added successfully`, TOAST.SUCCESS);
		if(d.failed && d.failed.total) addToast(`${d.failed.total} Beneficiary Already Exists`, TOAST.WARNING);	
		})
		.catch(e => {
			setImporting(false);
			addToast('Failed to import beneficiaries', TOAST.ERROR);
		}); 
	};
	useEffect(fetchList, []);


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
									{importing ? 	<Button type="button" disabled={true} className="btn" color="info">
										Importing...
									</Button>:
									
									<Button type="button" onClick={handleImportClick} className="btn" color="info">
									Import
								</Button>
									}
								
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
								{koboData.length ? (
									koboData.map((d, i) => {
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
									koboLoading? (
										<tr>
											<td colSpan={2}></td>
											<td>Loading Data from KoBoToolbox...</td>
										</tr>):(

									<tr>
									<td colSpan={2}></td>
									<td>No Data Available</td>
								</tr>
										)


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
