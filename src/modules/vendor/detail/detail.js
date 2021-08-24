import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardTitle } from 'reactstrap';
import VendorInfo from './vendorInfo';
import ProjectInvovled from '../../ui_components/projects';
import TransactionHistory from './transactionHistory';
import { VendorContext } from '../../../contexts/VendorContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import displayPic from '../../../assets/images/users/user_avatar.svg';
import Loading from '../../global/Loading';
import BreadCrumb from '../../ui_components/breadcrumb';

const Index = ({ params }) => {
	const { id } = params;
	const { getVendorDetails, getVendorTransactions, getVendorBalance } = useContext(VendorContext);
	const { appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [transactionList, setTransactionList] = useState([]);

	const [fetchingBlockchain, setFetchingBlockChain] = useState(false);
	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [vendorBalance, setVendorBalance] = useState('0');

	const fetchVendorBalance = useCallback(
		async wallet_address => {
			setFetchingBalance(true);
			const { token } = appSettings.agency.contracts;
			const balance = await getVendorBalance(token, wallet_address);
			setVendorBalance(balance);
			setFetchingBalance(false);
		},
		[appSettings, getVendorBalance]
	);

	const fetchVendorDetails = useCallback(async () => {
		const details = await getVendorDetails(id);
		if (details) {
			setBasicInfo(details);
			await fetchVendorBalance(details.wallet_address);
		}
		if (details.projects && details.projects.length) {
			const projects = details.projects.map(d => {
				return { id: d._id, name: d.name };
			});
			setProjectList(projects);
		}
	}, [fetchVendorBalance, getVendorDetails, id]);

	const fetchVendorTransactions = useCallback(async () => {
		try {
			setFetchingBlockChain(true);
			const transactions = await getVendorTransactions(id);
			if (transactions) setTransactionList(transactions);
			setFetchingBlockChain(false);
		} catch (err) {
			setFetchingBlockChain(false);
		}
	}, [getVendorTransactions, id]);

	useEffect(() => {
		fetchVendorDetails();
	}, [fetchVendorDetails]);

	useEffect(() => {
		console.log('VD Effect...');
		fetchVendorTransactions();
	}, [fetchVendorTransactions]);

	return (
		<>
			<p className="page-heading">Vendors</p>
			<BreadCrumb redirect_path="vendors" root_label="Vendors" current_label="Details" />
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
									{fetchingBalance ? <Loading /> : <p className="card-font-bold">{vendorBalance}</p>}

									<div className="sub-title">Total Balance</div>
								</Col>
								<Col md="6" sm="12">
									<p className="card-font-bold">0</p>
									<div className="sub-title">Total Redeemed</div>
								</Col>
							</Row>
						</div>
					</Card>
				</Col>
			</Row>

			<VendorInfo information={basicInfo} />
			<ProjectInvovled projects={projectList} />
			<TransactionHistory fetching={fetchingBlockchain} transactions={transactionList} />
		</>
	);
};

export default Index;
