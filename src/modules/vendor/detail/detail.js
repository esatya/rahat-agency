import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardTitle, FormGroup, Label } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import VendorInfo from './vendorInfo';
import ProjectInvovled from '../../ui_components/projects';
import TransactionHistory from './transactions';
import { VendorContext } from '../../../contexts/VendorContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import displayPic from '../../../assets/images/users/user_avatar.svg';
import BreadCrumb from '../../ui_components/breadcrumb';
import PasscodeModal from '../../global/PasscodeModal';
import { TOAST } from '../../../constants';
import { History } from '../../../utils/History';
import { formatErrorMsg } from '../../../utils';
import Balance from '../../ui_components/balance';
import { VENDOR_STATUS, STATUS_ACTIONS } from '../../../constants';
import ModalWrapper from '../../global/CustomModal';
import SelectWrapper from '../../global/SelectWrapper';
import StatusBox from './statusBox';
import {getBalance} from '../../../blockchain/abi';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

const Index = ({ params }) => {
	const { addToast } = useToasts();
	const { id } = params;
	const history = useHistory();

	const {
		getVendorDetails,
		getVendorTransactions,
		getVendorBalance,
		approveVendor,
		getVendorPackageBalance,
		getTokenIdsByProjects,
		listProjects,
		addVendorToProject,
		changeVendorStatus
	} = useContext(VendorContext);
	const { isVerified, wallet, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [transactionList, setTransactionList] = useState([]);
	const [loading, setLoading] = useState(false);

	const [fetchingTokenTransaction, setFetchingTokenTransaction] = useState(false);
	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [vendorBalance, setVendorBalance] = useState(null);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [vendorStatus, setVendorStatus] = useState('');
	const [vendorPackageBalance, setVendorPackageBalance] = useState(null);
	const [addProjectModal, setAddProjectModal] = useState(false);
	const [allProjects, setAllProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState('');

	// WIP
	const [vendorApproveModal, setVendorApproveModal] = useState(false);
	const [inputStatus, setInputStatus] = useState('');
	const [vendorEtherBalance, setVendorEtherBalance] = useState(null);


	const toggleVendorApproveModal = () => setVendorApproveModal(!vendorApproveModal);
	// END WIP

	const toggleAddProjectModal = () => {
		if (!addProjectModal) setSelectedProject('');
		setAddProjectModal(!addProjectModal);
	};

	const togglePasscodeModal = () => setPasscodeModal(!passcodeModal);

	const handleSwitchChange = flag => {
		const _status = flag === true ? VENDOR_STATUS.ACTIVE : VENDOR_STATUS.SUSPENDED;
		setInputStatus(_status);
		togglePasscodeModal();
	};

	const handleAddBtnClick = e => {
		e.preventDefault();
		toggleAddProjectModal();
	};

	const handleAddprojectSubmit = async e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		try {
			await addVendorToProject(id, selectedProject);
			addToast('Vendor added to the project', TOAST.SUCCESS);
			history.push('/vendors');
		} catch (err) {
			const errMsg = err.message ? err.message : 'Internal server error';
			addToast(errMsg, TOAST.ERROR);
		}
	};

	const handleProjectChange = d => setSelectedProject(d.value);

	const submitApproveProject = e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		toggleVendorApproveModal();
		togglePasscodeModal();
	};

	const handleApproveVendor = useCallback(async () => {
		setPasscodeModal(false);
		const { wallet_address } = basicInfo;
		try {
			if (!inputStatus) return addToast('No status supplied', TOAST.ERROR);
			const payload = {
				status: inputStatus,
				wallet_address: wallet_address,
				vendorId: id
			};
			setLoading(true);
			const approved = await approveVendor(payload);
			if (selectedProject) await addVendorToProject(id, selectedProject);
			if (approved) {
				setLoading(false);
				addToast('Vendor status updated successfully', TOAST.SUCCESS);
				History.push('/vendors');
			}
		} catch (err) {
			setLoading(false);
			addToast(err.message, TOAST.ERROR);
		}
	}, [addToast, addVendorToProject, approveVendor, basicInfo, id, inputStatus, selectedProject]);

	const openApprovalModal = () => {
		setInputStatus(VENDOR_STATUS.ACTIVE);
		toggleVendorApproveModal();
	};

	const rejectVendor = async status => {
		try {
			setLoading(true);
			await changeVendorStatus(id, status);
			setLoading(false);
			addToast('Vendor status updated successfully', TOAST.SUCCESS);
			History.push('/vendors');
		} catch (err) {
			setLoading(false);
			const errMessage = formatErrorMsg(err);
			addToast(errMessage, TOAST.ERROR);
		}
	};

	const handleApproveRejectClick = actionName => {
		if (actionName === STATUS_ACTIONS.APPROVE) return openApprovalModal(STATUS_ACTIONS.APPROVE);
		if (actionName === STATUS_ACTIONS.REJECT) return rejectVendor(VENDOR_STATUS.SUSPENDED);
	};

	const fetchVendorBalance = useCallback(
		async wallet_address => {
			setFetchingBalance(true);
			const { rahat_erc20 } = appSettings.agency.contracts;
			const balance = await getVendorBalance(rahat_erc20, wallet_address);
			setVendorBalance(balance);
			const etherBalance = await getBalance(wallet_address);
			setVendorEtherBalance(etherBalance);
			setFetchingBalance(false);
		},
		[appSettings, getVendorBalance]
	);

	const fetchTokenIdsByProjects = useCallback(
		async projects => {
			const projectIds = projects.map(p => p._id);
			const res = await getTokenIdsByProjects(projectIds);
			return res;
		},
		[getTokenIdsByProjects]
	);

	const fetchVendorPackageBalance = useCallback(
		async (wallet_address, tokenIds) => {
			if(!appSettings) return;
			const {agency} = appSettings;
			const { rahat_erc1155 } = agency.contracts;
			const wallet_addresses = Array(tokenIds.length).fill(wallet_address);
			const package_balance = await getVendorPackageBalance(rahat_erc1155, wallet_addresses, tokenIds);
			setVendorPackageBalance(package_balance);
		},
		[appSettings, getVendorPackageBalance]
	);

	const sanitizeSelectOptions = useCallback(projects => {
		const select_options = projects.map(d => {
			return { label: d.name, value: d._id };
		});
		setAllProjects(select_options);
	}, []);

	const fetchVendorDetails = useCallback(async () => {
		try {
			const details = await getVendorDetails(id);
			const projects = await listProjects();
			if (projects.length) sanitizeSelectOptions(projects);
			if (details) {
				setVendorStatus(details.agencies[0].status);
				setBasicInfo(details);
			}

			if (details && details.projects && details.projects.length) {
				const tokenIds = await await fetchTokenIdsByProjects(details.projects);
				const projects = details.projects.map(d => {
					return { id: d._id, name: d.name };
				});
				setProjectList(projects);
				await fetchVendorPackageBalance(details.wallet_address, tokenIds);
			}
			await fetchVendorBalance(details.wallet_address);
		} catch (err) {
			setFetchingBalance(false);
			setVendorPackageBalance(0);
			setVendorBalance(0);
		}
	}, [
		fetchTokenIdsByProjects,
		fetchVendorBalance,
		fetchVendorPackageBalance,
		getVendorDetails,
		id,
		listProjects,
		sanitizeSelectOptions
	]);

	const fetchVendorTokenTransactions = useCallback(async () => {
		try {
			setFetchingTokenTransaction(true);
			const transactions = await getVendorTransactions(id);
			if (transactions) setTransactionList(transactions);
			setFetchingTokenTransaction(false);
		} catch (err) {
			setFetchingTokenTransaction(false);
		}
	}, [getVendorTransactions, id]);

	// const fetchVendorPackageTransactions = useCallback(async () => {
	// 	try {
	// 		setFetchingBlockChain(true);
	// 		const transactions = await getVendorTransactions(id);
	// 		if (transactions) setTransactionList(transactions);
	// 		setFetchingBlockChain(false);
	// 	} catch (err) {
	// 		setFetchingBlockChain(false);
	// 	}
	// }, [getVendorTransactions, id]);


	useEffect(() => {
		fetchVendorDetails();
	}, [fetchVendorDetails]);

	useEffect(() => {
		fetchVendorTokenTransactions();
	}, [fetchVendorTokenTransactions]);

	useEffect(() => {
		if (isVerified && wallet) {
			handleApproveVendor();
		}
	}, [handleApproveVendor, isVerified, wallet]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			{/* Add to project modal */}
			<ModalWrapper
				title="Add to project"
				open={addProjectModal}
				toggle={toggleAddProjectModal}
				handleSubmit={handleAddprojectSubmit}
			>
				<FormGroup>
					<Label>Project *</Label>
					<SelectWrapper
						onChange={handleProjectChange}
						maxMenuHeight={150}
						data={allProjects}
						placeholder="--Select Project--"
					/>{' '}
				</FormGroup>
			</ModalWrapper>
			{/* End Add to project modal */}

			{/* Assign to vendor and approve modal */}
			<ModalWrapper
				title="Add to project"
				open={vendorApproveModal}
				toggle={toggleVendorApproveModal}
				handleSubmit={submitApproveProject}
			>
				<FormGroup>
					<Label>Project *</Label>
					<SelectWrapper
						onChange={handleProjectChange}
						maxMenuHeight={150}
						data={allProjects}
						placeholder="--Select Project--"
					/>{' '}
				</FormGroup>
			</ModalWrapper>
			{/* End Add to project modal */}

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
									{vendorStatus && (
										<StatusBox
											vendorStatus={vendorStatus}
											handleApproveRejectClick={handleApproveRejectClick}
											handleSwitchChange={handleSwitchChange}
											loading={loading}
										/>
									)}
									{/* {loading ? (
										<button
											type="button"
											disabled={true}
											className="btn btn-secondary"
											style={{ borderRadius: '8px', float: 'right' }}
										>
											Changing status, please wait...
										</button>
									) : (
										<BootstrapSwitchButton
											checked={vendorStatus === VENDOR_STATUS.ACTIVE ? true : false}
											onlabel="Suspend"
											offlabel="Activate"
											width={140}
											height={30}
											onstyle="success"
											onChange={handleSwitchChange}
										/>
									)} */}
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
						package_data={vendorPackageBalance}
						fetching={fetchingBalance}
						handleIssueToken=""
					/>
				</Col>
			</Row>

			<VendorInfo information={basicInfo} etherBalance={vendorEtherBalance} />
			<ProjectInvovled projects={projectList} handleAddBtnClick={handleAddBtnClick} showAddBtn={true} />
			<TransactionHistory fetching={fetchingTokenTransaction} transactions={transactionList} vendorId={id} />
		</>
	);
};

export default Index;
