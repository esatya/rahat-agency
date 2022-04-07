import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

import {
	Card,
	CardBody,
	Row,
	Col,
	Button,
	Table,
	CardSubtitle,
	CardTitle,
	Label,
	FormGroup,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter
} from 'reactstrap';

import { MobilizerContext } from '../../../contexts/MobilizerContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import profilePhoto from '../../../assets/images/users/user_avatar.svg';

import PasscodeModal from '../../global/PasscodeModal';
import MobilizerInfo from './mobilizerInfo';
import BreadCrumb from '../../ui_components/breadcrumb';
import Balance from '../../ui_components/balance';
import { TOAST, MOBIZ_STATUS } from '../../../constants';
import ProjectsByStatus from './projectsByStatus';
import { formatErrorMsg } from '../../../utils';
import {getBalance} from '../../../blockchain/abi';
import MaskLoader from '../../global/MaskLoader';
import StatusBox from './statusBox';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function DetailsForm(props) {
	const mobilizerId = props.params.id;
	const { addToast } = useToasts();
	const history = useHistory();
	const {
		mobilizer,
		getMobilizerDetails,
		approveMobilizer,
		getMobilizerBalance,
		getMobilizerTransactions,
		transactionHistory,
		listAid,
		getMobilizerPackageBalance,
		changeMobStatusInProject
	} = useContext(MobilizerContext);

	const { appSettings, isVerified, wallet } = useContext(AppContext);
	const [mobilizerBalance, setMobilizerBalance] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [projectOptions, setProjectOptions] = useState([]);
	const [selectedProject, setSelectedProject] = useState('');

	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [totalPackageBalance, setTotalPackageBalance] = useState(null);
	const [mobilizerEtherBalance, setMobilizerEtherBalance] = useState(null);
	const [mobilizerStatus, setMobilizerStatus] = useState(null);
	const [mobilizerProjects, setMobilizerProjects] = useState([]);
	const [statusInput, setStatusInput] = useState('');
	const [isActivateOnly, setIsActivateOnly] = useState(false); // Diff. Activate withing project or new approval

	const togglePasscodeModal = useCallback(() => setPasscodeModal(!passcodeModal), [passcodeModal]);

	const fetchTokenAndPackageBalance = useCallback(
		async wallet_address => {
			if(!appSettings || !appSettings.agency) return;
			const {agency} = appSettings;
			setFetchingBalance(true);
			const { rahat } = agency.contracts;
			const etherBalance = await getBalance(wallet_address);
			setMobilizerEtherBalance(etherBalance);
			const tokenBalance = await getMobilizerBalance(rahat, wallet_address);
			setMobilizerBalance(tokenBalance);
			const packageBalance = await getMobilizerPackageBalance(rahat, wallet_address);
			if (packageBalance && packageBalance.grandTotal > 0) setTotalPackageBalance(packageBalance);
			setFetchingBalance(false);
		},
		[appSettings, getMobilizerBalance, getMobilizerPackageBalance]
	);

	const showActiveInactiveStatus = useCallback(projects => {
		if (projects.length < 1) return setMobilizerStatus(null);
		const statusOnly = projects.map(p => p.status);
		if (statusOnly.includes(MOBIZ_STATUS.ACTIVE)) setMobilizerStatus(MOBIZ_STATUS.ACTIVE);
		else setMobilizerStatus(MOBIZ_STATUS.SUSPENDED);
	}, []);

	const fetchMobilizerDetails = useCallback(async () => {
		try {
			const mob = await getMobilizerDetails(mobilizerId);
			if (mob.projects && mob.projects.length) {
				showActiveInactiveStatus(mob.projects);
				setMobilizerProjects(mob.projects);
			}
			if (mob.wallet_address) await fetchTokenAndPackageBalance(mob.wallet_address);
			await getMobilizerTransactions(mobilizerId);
		} catch (err) {
			console.log('ERR==>', err);
		}
	}, [
		fetchTokenAndPackageBalance,
		getMobilizerDetails,
		getMobilizerTransactions,
		mobilizerId,
		showActiveInactiveStatus
	]);

	const handleSelectProject = e => setSelectedProject(e.value);

	const suspendMobilizer = async (projectId, status) => {
		const payload = { projectId, status };
		try {
			await changeMobStatusInProject(mobilizerId, payload);
			addToast('Mobilizer status updated successfully', TOAST.SUCCESS);
			history.push('/mobilizers');
		} catch (err) {
			const errMsg = formatErrorMsg(err);
			addToast(errMsg, TOAST.ERROR);
		}
	};

	const handleApproveReject = (projectId, status) => {
		if (status === MOBIZ_STATUS.SUSPENDED) return suspendMobilizer(projectId, status);
		setSelectedProject(projectId);
		setStatusInput(status);
		setIsActivateOnly(true);
		togglePasscodeModal();
	};

	const handleApproveClick = () => {
		setStatusInput(MOBIZ_STATUS.ACTIVE);
		setIsActivateOnly(false);
		toggleModal();
	};

	const submitMobilizerApproval = useCallback(async () => {
		if (isVerified && wallet) {
			if (!statusInput) return addToast('Status not supplied', TOAST.ERROR);
			if (!selectedProject) return addToast('Please select a proejct', TOAST.ERROR);
			setLoading(true);
			setPasscodeModal(false);
			let payload = {
				status: statusInput,
				wallet_address: mobilizer.wallet_address,
				projectId: selectedProject,
				isActivateOnly,
				mobilizerId
			};
			approveMobilizer(payload)
				.then(() => {
					setLoading(false);
					addToast('Mobilizer status updated successfully', TOAST.SUCCESS);
					history.push('/mobilizers');
				})
				.catch(err => {
					setLoading(false);
					const errMsg = formatErrorMsg(err);
					addToast(errMsg, TOAST.ERROR);
				});
		}
	}, [
		addToast,
		approveMobilizer,
		history,
		isActivateOnly,
		isVerified,
		mobilizer.wallet_address,
		mobilizerId,
		selectedProject,
		statusInput,
		wallet
	]);

	const toggleModal = () => {
		setModal(prevState => !prevState);
	};

	const handleMobilizerApprove = async e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select a proejct', TOAST.ERROR);
		toggleModal();
		togglePasscodeModal();
	};

	const fetchProjectList = () => {
		listAid()
			.then(d => {
				sanitizeProjectOptions(d.data);
			})
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const sanitizeProjectOptions = data => {
		let options = [];
		if (data && data.length) {
			for (let d of data) {
				let obj = {};
				obj.value = d._id;
				obj.label = d.name;
				options.push(obj);
			}
			setProjectOptions(options);
			return;
		}
		setProjectOptions(options);
	};

	useEffect(fetchProjectList, []);

	useEffect(() => {
		fetchMobilizerDetails();
	}, [fetchMobilizerDetails]);

	useEffect(() => {
		submitMobilizerApproval();
	}, [submitMobilizerApproval, isVerified]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<MaskLoader message="Approving mobilizer" isOpen={loading} />

			<p className="page-heading">Mobilizers</p>
			<BreadCrumb redirect_path="mobilizers" root_label="Mobilizers" current_label="Details" />

			<Modal isOpen={modal} toggle={toggleModal.bind(null)}>
				<ModalHeader toggle={toggleModal.bind(null)}>Select Project</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label>Project *</Label>
						<Select
							onChange={handleSelectProject}
							closeMenuOnSelect={true}
							defaultValue={[]}
							options={projectOptions}
							placeholder="--Select Project--"
						/>
						<br />
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<React.Fragment>
						<Button onClick={handleMobilizerApprove} type="button" color="primary">
							Submit
						</Button>
						<Button color="secondary" onClick={toggleModal.bind(null)}>
							Cancel
						</Button>
					</React.Fragment>
				</ModalFooter>
			</Modal>

			<Row>
				<Col md="7">
					<Card>
						<div className="stat-card-body" style={{ minHeight: 120 }}>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								Mobilizer Detail
							</CardTitle>

							<Row>
								<Col md="8" sm="8" style={{ marginBottom: '10px' }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<img
											src={mobilizer.photo ? `${IPFS_GATEWAY}/ipfs/${mobilizer.photo}` : profilePhoto}
											alt="user"
											className="rounded-circle"
											width="45"
											height="45"
										/>
										<div style={{ marginLeft: '20px' }}>
											<p className="card-font-medium">{mobilizer ? mobilizer.name : ''}</p>
											<div className="sub-title">Name</div>
										</div>
									</div>
								</Col>
								<Col md="4" sm="4">
									{mobilizerStatus ? (
										<StatusBox mobilizerStatus={mobilizerStatus} />
									) : (
										<Button color="success" type="button" onClick={handleApproveClick}>
											Approve
										</Button>
									)}

									{/* {mobilizerStatus && (
										<StatusBox
											vendorStatus={mobilizerStatus}
											handleApproveRejectClick={handleApproveRejectClick}
											handleSwitchChange={handleSwitchChange}
											loading={loading}
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
						title="Issued"
						button_name=""
						token_data={mobilizerBalance}
						package_data={totalPackageBalance}
						fetching={fetchingBalance}
						handleIssueToken=""
					/>
				</Col>
			</Row>

			<MobilizerInfo information={mobilizer} etherBalance={mobilizerEtherBalance}/>
			<ProjectsByStatus mobilizerProjects={mobilizerProjects} handleApproveReject={handleApproveReject} />

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<CardTitle>Transaction history</CardTitle>
							{transactionHistory.length > 0 && (
								<CardSubtitle>{transactionHistory.length} transactions found.</CardSubtitle>
							)}
							<Table className="no-wrap v-middle" responsive>
								<thead>
									<tr className="border-0">
										<th className="border-0">From</th>
										<th className="border-0">To</th>
										<th className="border-0">Value</th>
										<th className="border-0">Type</th>
										<th className="border-0">Blockchain Tx</th>
									</tr>
								</thead>
								<tbody>
									{transactionHistory && transactionHistory.length ? (
										transactionHistory.map((tx, index) => {
											return (
												<tr key={index}>
													<td>{tx.from || ''}</td>
													<td>{tx.to || '-'}</td>
													<td>{tx.value || '-'}</td>
													<td>
														{(tx.tag === 'sent' && tx.to === appSettings.agency.contracts.rahat_admin
															? 'redeem'
															: tx.tag) || '-'}
													</td>
													<td>
														<a
															href={EXPLORER_URL + '/tx/' + tx.transactionHash}
															target="_blank"
															rel="noopener noreferrer"
														>
															Verify
														</a>
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td colSpan={4}>No data available.</td>
										</tr>
									)}
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}
