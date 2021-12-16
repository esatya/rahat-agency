import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { Link, useHistory } from 'react-router-dom';

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
		getAvailableBalance,
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
	const [availableBalance, setAvailableBalance] = useState(null);
	const [showAlert, setShowAlert] = useState(false);

	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [totalPackageBalance, setTotalPackageBalance] = useState(null);

	const [mobilizerStatus, setMobilizerStatus] = useState('');
	const [mobilizerProjects, setMobilizerProjects] = useState([]);
	const [statusInput, setStatusInput] = useState('');

	const togglePasscodeModal = useCallback(() => setPasscodeModal(!passcodeModal), [passcodeModal]);

	const fetchTokenAndPackageBalance = useCallback(
		async wallet_address => {
			setFetchingBalance(true);
			const { rahat } = appSettings.agency.contracts;
			const tokenBalance = await getMobilizerBalance(rahat, wallet_address);
			setMobilizerBalance(tokenBalance);
			const packageBalance = await getMobilizerPackageBalance(rahat, wallet_address);
			if (packageBalance && packageBalance.grandTotal > 0) setTotalPackageBalance(packageBalance);
			setFetchingBalance(false);
		},
		[appSettings.agency.contracts, getMobilizerBalance, getMobilizerPackageBalance]
	);

	const showActiveInactiveStatus = useCallback(projects => {
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

	const handleSelectProject = async e => {
		try {
			setLoading(true);
			setSelectedProject(e.value);
			let d = await getAvailableBalance(e.value);
			setAvailableBalance(d);
			setShowAlert(true);
			setLoading(false);
		} catch {
			setShowAlert(false);
			addToast('Failed to fetch availabe balance!', {
				appearance: 'error',
				autoDismiss: true
			});
			setLoading(false);
		}
	};

	const changeMobilizerStatus = async (projectId, status) => {
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
		// const _status = e === true ? MOBIZ_STATUS.ACTIVE : MOBIZ_STATUS.SUSPENDED;
		return changeMobilizerStatus(projectId, status);
		// if (status === MOBIZ_STATUS.ACTIVE)
		// 	setStatusInput(status);
		// 	togglePasscodeModal();
		// } else changeMobilizerStatus(projectId);
	};

	const submitMobilizerApproval = useCallback(async () => {
		if (isVerified && wallet) {
			if (!statusInput) return addToast('Status not supplied', TOAST.ERROR);
			if (!selectedProject) return addToast('Please select proejct', TOAST.ERROR);
			setLoading(true);
			setPasscodeModal(false);
			let payload = {
				status: statusInput,
				wallet_address: mobilizer.wallet_address,
				projectId: selectedProject
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
	}, [addToast, approveMobilizer, history, isVerified, mobilizer.wallet_address, selectedProject, statusInput, wallet]);

	const toggleModal = () => {
		setModal(prevState => !prevState);
		resetTokenIssueForm();
	};

	const resetTokenIssueForm = () => {
		setAvailableBalance('');
		setShowAlert(false);
	};

	const handleMobilizerApprove = async e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select proejct', TOAST.ERROR);
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
		console.log('APPROVAL EFFECT==>');
		submitMobilizerApproval();
	}, [submitMobilizerApproval, isVerified]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

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
					<FormGroup>
						{showAlert && availableBalance > 0 ? (
							<div className="alert alert-success fade show" role="alert">
								Availabe Balance: {availableBalance}
							</div>
						) : showAlert ? (
							<div>
								<div className="alert alert-warning fade show" role="alert">
									<p>
										Project has ZERO balance. <Link to={`/projects/${selectedProject}`}>You can add here.</Link>
									</p>
								</div>
							</div>
						) : (
							''
						)}
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<>
						{loading ? (
							'Please wait...'
						) : (
							<React.Fragment>
								<Button onClick={handleMobilizerApprove} type="button" color="primary">
									Submit
								</Button>
								<Button color="secondary" onClick={toggleModal.bind(null)}>
									Cancel
								</Button>
							</React.Fragment>
						)}
					</>
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
									{mobilizerStatus === MOBIZ_STATUS.ACTIVE ? (
										<div>
											<i className="fa fa-circle text-success"></i>
											&nbsp; Active
										</div>
									) : (
										<div>
											<i className="fa fa-circle text-danger"></i>
											&nbsp; Inactive
										</div>
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
											checked={mobilizer_status === STATUS.ACTIVE ? true : false}
											onlabel="Suspend"
											offlabel="Activate"
											width={140}
											height={30}
											onstyle="success"
											onChange={handleApproveReject}
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
			<MobilizerInfo information={mobilizer} />
			{/* <ProjectInvovled projects={projectList} /> */}

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
