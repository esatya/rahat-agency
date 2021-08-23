import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Card, CardTitle } from 'reactstrap';
import VendorInfo from './vendorInfo';
import ProjectInvovled from '../../ui_components/projects';
import TransactionHistory from './transactionHistory';
import { VendorContext } from '../../../contexts/VendorContext';
import displayPic from '../../../assets/images/users/user_avatar.svg';

const Index = ({ params }) => {
	const { id } = params;
	const { getVendorDetails, getVendorTransactions } = useContext(VendorContext);
	const [basicInfo, setBasicInfo] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [transactionList, setTransactionList] = useState([]);

	const fetchVendorDetails = useCallback(async () => {
		const details = await getVendorDetails(id);
		if (details) setBasicInfo(details);
		if (details.projects && details.projects.length) {
			const projects = details.projects.map(d => {
				return { id: d._id, name: d.name };
			});
			setProjectList(projects);
		}
	}, [getVendorDetails, id]);

	const fetchVendorTransactions = useCallback(async () => {
		const transactions = await getVendorTransactions(id);
		console.log('transaction alsdjflkajsdlfj', transactions);
		if (transactions) setTransactionList(transactions);
	}, [getVendorTransactions, id]);

	useEffect(() => {
		fetchVendorDetails();
	}, [fetchVendorDetails]);

	useEffect(() => {
		fetchVendorTransactions();
	}, [fetchVendorTransactions]);

	console.log('BASIC==>', basicInfo);

	return (
		<>
			<p className="page-heading">Vendors</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Vendors</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Detail</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="7">
					<Card>
						<div className="stat-card-body" style={{ minHeight: 120 }}>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								Vendor Detail
							</CardTitle>

							<Row>
								<Col md="8" sm="8" style={{ marginBottom: '10px' }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<img src={displayPic} alt="user" className="rounded-circle" width="45" />
										<div style={{ marginLeft: '20px' }}>
											<p className="card-font-medium">{basicInfo.name}</p>
											<div className="sub-title">Name</div>
										</div>
									</div>
								</Col>
								<Col md="4" sm="4">
									<button
										type="button"
										className="btn waves-effect waves-light btn-outline-info"
										style={{ borderRadius: '8px', float: 'right' }}
									>
										Approve
									</button>
								</Col>
							</Row>
						</div>
					</Card>
				</Col>
				<Col md="5">
					<Card>
						<div className="stat-card-body" style={{ minHeight: 120 }}>
							<CardTitle className="title">Token</CardTitle>
							<Row>
								<Col md="6" sm="12" style={{ marginBottom: '10px' }}>
									<p className="card-font-bold">Balance</p>
									<div className="sub-title">Token Status</div>
								</Col>
								<Col md="6" sm="12">
									<p className="card-font-bold">50,000</p>
									<div className="sub-title">Total Redeemed</div>
								</Col>
							</Row>
						</div>
					</Card>
				</Col>
			</Row>

			<VendorInfo information={basicInfo} />
			<ProjectInvovled projects={projectList} />
			<TransactionHistory transactions={transactionList} />
		</>
	);
};

export default Index;
