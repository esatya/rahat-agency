import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardTitle } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import VendorInfo from './vendorInfo';
import ProjectInvovled from '../../ui_components/projects';
import TransactionHistory from './transactionHistory';
import { VendorContext } from '../../../contexts/VendorContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import displayPic from '../../../assets/images/users/user_avatar.svg';
// import Loading from '../../global/Loading';
import BreadCrumb from '../../ui_components/breadcrumb';
import PasscodeModal from '../../global/PasscodeModal';
import { TOAST } from '../../../constants';
import { History } from '../../../utils/History';
import Balance from '../../ui_components/balance';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

const Index = ({ params }) => {
	const { addToast } = useToasts();
	const { id } = params;

	const { getVendorDetails, getVendorTransactions, getVendorBalance, approveVendor } = useContext(VendorContext);
	const { isVerified, wallet, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [transactionList, setTransactionList] = useState([]);
	const [loading, setLoading] = useState(false);

	const [fetchingBlockchain, setFetchingBlockChain] = useState(false);
	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [vendorBalance, setVendorBalance] = useState(null);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [vendorStatus, setVendorStatus] = useState('');

	const togglePasscodeModal = () => setPasscodeModal(!passcodeModal);

	const handleApproveVendor = useCallback(async () => {
		setPasscodeModal(false);
		const { wallet_address } = basicInfo;
		try {
			const payload = {
				status: 'active',
				wallet_address: wallet_address,
				vendorId: id
			};
			setLoading(true);
			const approved = await approveVendor(payload);
			if (approved) {
				setLoading(false);
				addToast('Vendor approved successfully', TOAST.SUCCESS);
				History.push('/vendors');
			}
		} catch (err) {
			setLoading(false);
			addToast(err.message, TOAST.ERROR);
		}
	}, [addToast, approveVendor, basicInfo, id]);

	const fetchVendorBalance = useCallback(
		async wallet_address => {
			setFetchingBalance(true);
			const { rahat_erc20 } = appSettings.agency.contracts;
			const balance = await getVendorBalance(rahat_erc20, wallet_address);
			setVendorBalance(balance);
			setFetchingBalance(false);
		},
		[appSettings, getVendorBalance]
	);

	const fetchVendorDetails = useCallback(async () => {
		const details = await getVendorDetails(id);
		console.log('Details===>', details);
		if (details) {
			setVendorStatus(details.agencies[0].status);
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
		fetchVendorTransactions();
	}, [fetchVendorTransactions]);

	useEffect(() => {
		if (isVerified && wallet) {
			handleApproveVendor();
		}
	}, [handleApproveVendor, isVerified, wallet]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

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
										<img
											src={
												basicInfo.photo && basicInfo.photo.length
													? `${IPFS_GATEWAY}/ipfs/${basicInfo.photo[0]}`
													: displayPic
											}
											alt="user"
											className="rounded-circle"
											width="45"
											height="45"
										/>
										<div style={{ marginLeft: '20px' }}>
											<p className="card-font-medium">{basicInfo.name}</p>
											<div className="sub-title">Name</div>
										</div>
									</div>
								</Col>
								<Col md="4" sm="4">
									{loading ? (
										<button
											type="button"
											disabled={true}
											className="btn btn-secondary"
											style={{ borderRadius: '8px', float: 'right' }}
										>
											Approving, please wait...
										</button>
									) : vendorStatus === 'active' ? (
										<button
											type="button"
											disabled={true}
											className="btn btn-success"
											style={{ borderRadius: '8px', float: 'right' }}
										>
											<i className="fas fa-check-circle"></i> Approved
										</button>
									) : (
										<button
											type="button"
											onClick={togglePasscodeModal}
											className="btn waves-effect waves-light btn-outline-info"
											style={{ borderRadius: '8px', float: 'right' }}
										>
											Approve
										</button>
									)}
								</Col>
							</Row>
						</div>
					</Card>
				</Col>
				<Col md="5">
					<Balance
						action=""
						title="Balance"
						button_name=""
						token_data={vendorBalance}
						package_data=""
						fetching={fetchingBalance}
						loading={loading}
						handleIssueToken=""
					/>
				</Col>
			</Row>

			<VendorInfo information={basicInfo} />
			<ProjectInvovled projects={projectList} />
			<TransactionHistory fetching={fetchingBlockchain} transactions={transactionList} />
		</>
	);
};

export default Index;
