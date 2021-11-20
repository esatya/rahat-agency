import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import ProjectInvovled from '../../ui_components/projects';

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

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function DetailsForm(props) {
	const mobilizerId = props.params.id;
	const { addToast } = useToasts();
	const {
		mobilizer,
		getMobilizerDetails,
		approveMobilizer,
		getMobilizerBalance,
		getMobilizerTransactions,
		transactionHistory,
		getAvailableBalance,
		listAid,
		getMobilizerPackageBalance
	} = useContext(MobilizerContext);

	const { appSettings, isVerified, wallet } = useContext(AppContext);
	const [mobilizerBalance, setMobilizerBalance] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const togglePasscodeModal = useCallback(() => setPasscodeModal(!passcodeModal), [passcodeModal]);
	const [modal, setModal] = useState(false);
	const [projectOptions, setProjectOptions] = useState([]);
	const [selectedProject, setSelectedProject] = useState('');
	const [availableBalance, setAvailableBalance] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [projectList, setProjectList] = useState([]);

	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [totalPackageBalance, setTotalPackageBalance] = useState(null);

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

	const fetchMobilizerDetails = useCallback(async () => {
		try {
			const mob = await getMobilizerDetails(mobilizerId);
			if (mob.projects && mob.projects.length) {
				const projects = mob.projects.map(d => {
					return { id: d._id, name: d.name };
				});
				setProjectList(projects);
			}
			if (mob.wallet_address) await fetchTokenAndPackageBalance(mob.wallet_address);
			await getMobilizerTransactions(mobilizerId);
		} catch (err) {
			console.log('ERR==>', err);
		}
	}, [fetchTokenAndPackageBalance, getMobilizerDetails, getMobilizerTransactions, mobilizerId]);

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

	const submitMobilizerApproval = useCallback(async () => {
		if (!isVerified) return;
		setLoading(true);
		setPasscodeModal(false);
		let payload = {
			status: 'active',
			wallet_address: mobilizer.wallet_address,
			projectId: selectedProject
		};
		approveMobilizer(payload)
			.then(() => {
				setLoading(false);
				addToast('Mobilizer approved successfully.', {
					appearance: 'success',
					autoDismiss: true
				});
			})
			.catch(() => {
				setLoading(false);
				addToast('Invalid mobilizer wallet address!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	}, [addToast, approveMobilizer, isVerified, mobilizer.wallet_address, selectedProject]);

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
		// let swal = await Swal.fire({
		// 	title: 'Are you sure?',
		// 	text: `You want to approve this mobilizer!`,
		// 	icon: 'warning',
		// 	showCancelButton: true,
		// 	confirmButtonColor: '#3085d6',
		// 	cancelButtonColor: '#d33',
		// 	confirmButtonText: 'Yes'
		// });
		// if (swal.isConfirmed)
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
		if (isVerified && wallet) {
			submitMobilizerApproval();
		}
	}, [submitMobilizerApproval, isVerified, wallet]);

	const mobilizer_status = mobilizer && mobilizer.agencies ? mobilizer.agencies[0].status : 'new';

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
									{loading ? (
										<button
											type="button"
											disabled={true}
											className="btn btn-secondary"
											style={{ borderRadius: '8px', float: 'right' }}
										>
											Approving, please wait...
										</button>
									) : mobilizer_status === 'active' ? (
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
											onClick={toggleModal}
											// onClick={togglePasscodeModal}
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
						title="Issued"
						button_name=""
						token_data={mobilizerBalance}
						package_data={totalPackageBalance}
						fetching={fetchingBalance}
						loading={loading}
						handleIssueToken=""
					/>
				</Col>
			</Row>
			<MobilizerInfo information={mobilizer} />
			<ProjectInvovled projects={projectList} />

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
