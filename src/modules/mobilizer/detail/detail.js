import React, { useContext, useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import Loading from '../../global/Loading';
import ProjectInvovled from '../../ui_components/projects';

import {
	Card,
	CardBody,
	Row,
	Col,
	// Input,
	// ButtonGroup,
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
// import Swal from 'sweetalert2';

import { MobilizerContext } from '../../../contexts/MobilizerContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import profilePhoto from '../../../assets/images/users/user_avatar.svg';
// import IdPhoto from '../../../assets/images/id-icon-1.png';
// import UnlockWallet from '../../global/walletUnlock';
import PasscodeModal from '../../global/PasscodeModal';
import MobilizerInfo from './mobilizerInfo';
import BreadCrumb from '../../ui_components/breadcrumb';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function DetailsForm(props) {
	const mobilizerId = props.params.id;
	const { addToast } = useToasts();
	const {
		mobilizer,
		getMobilizerDetails,
		approveMobilizer,
		// changeMobilizerStatus,
		getMobilizerBalance,
		getMobilizerTransactions,
		transactionHistory,
		getAvailableBalance,
		listAid
	} = useContext(MobilizerContext);
	const { appSettings, isVerified, changeIsverified } = useContext(AppContext);
	const [mobilizerBalance, setMobilizerBalance] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const togglePasscodeModal = () => setPasscodeModal(!passcodeModal);
	const [modal, setModal] = useState(false);
	const [projectOptions, setProjectOptions] = useState([]);
	// const [inputTokens, setInputTokens] = useState(null);
	const [selectedProject, setSelectedProject] = useState('');
	const [availableBalance, setAvailableBalance] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [fetchingBalance, setFetchingBalance] = useState(false);
	const [projectList, setProjectList] = useState([]);

	const loadMobilizerDetails = () => {
		getMobilizerDetails(mobilizerId)
			.then(d => {
				getMobilizerTransactions(mobilizerId);
				getBalance(d.wallet_address);

				if (d.projects && d.projects.length) {
					const projects = d.projects.map(d => {
						return { id: d._id, name: d.name };
					});
					setProjectList(projects);
				}
			})
			.catch(() => {
				addToast('Something went wrong on server!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const getBalance = async wallet => {
		if (appSettings && appSettings.agency) {
			try {
				setFetchingBalance(true);

				const { token } = appSettings.agency.contracts;
				let d = await getMobilizerBalance(token, wallet);
				setMobilizerBalance(d);
				setFetchingBalance(false);
			} catch {
				addToast('Invalid Mobilizer wallet address!', {
					appearance: 'error',
					autoDismiss: true
				});
			}
		}
	};

	// const handleChangeStatus = async status => {
	// 	let swal = await Swal.fire({
	// 		title: 'Are you sure?',
	// 		text: `Mobilizer will be marked as ${status}`,
	// 		icon: 'warning',
	// 		showCancelButton: true,
	// 		confirmButtonColor: '#3085d6',
	// 		cancelButtonColor: '#d33',
	// 		confirmButtonText: 'Yes'
	// 	});
	// 	if (swal.isConfirmed) {
	// 		try {
	// 			await changeMobilizerStatus(mobilizerId, status);
	// 			addToast(`Mobilizer marked as ${status}`, {
	// 				appearance: 'success',
	// 				autoDismiss: true
	// 			});
	// 		} catch (e) {
	// 			addToast('Something went wrong on server!', {
	// 				appearance: 'error',
	// 				autoDismiss: true
	// 			});
	// 		}
	// 	}
	// };

	// const handleTokenChange = e => {
	// 	setInputTokens(e.target.value);
	// };

	const handleSelectProject = async e => {
		try {
			setLoading(true);
			setSelectedProject(e.value);
			//const { rahat_admin } = appSettings.agency.contracts;
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

	const submitMobilizerApproval = e => {
		if (!isVerified) return;
		setLoading(true);
		let payload = {
			status: 'active',
			wallet_address: mobilizer.wallet_address,
			projectId: selectedProject
		};
		approveMobilizer(payload)
			.then(() => {
				changeIsverified(false);
				setLoading(false);
				togglePasscodeModal();
				addToast('Mobilizer approved successfully.', {
					appearance: 'success',
					autoDismiss: true
				});
			})
			.catch(() => {
				changeIsverified(false);
				setLoading(false);
				togglePasscodeModal();
				addToast('Invalid mobilizer wallet address!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const toggleModal = () => {
		setModal(prevState => !prevState);
		resetTokenIssueForm();
	};

	const resetTokenIssueForm = () => {
		// setInputTokens(null);
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

	useEffect(loadMobilizerDetails, []);
	useEffect(submitMobilizerApproval, [isVerified]);

	const mobilizer_status = mobilizer && mobilizer.agencies ? mobilizer.agencies[0].status : 'new';

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<p className="page-heading">Mobilizers</p>
			<BreadCrumb redirect_path="mobilizers" root_label="Mobilizers" current_label="Details" />

			{/* <UnlockWallet open={passcodeModal} onClose={e => setPasscodeModal(e)}></UnlockWallet> */}

			<Modal isOpen={modal} toggle={toggleModal.bind(null)}>
				<ModalHeader toggle={toggleModal.bind(null)}>Issue Token</ModalHeader>
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
						<Button onClick={handleMobilizerApprove} type="button" color="primary">
							Submit
						</Button>
						<Button color="secondary" onClick={toggleModal.bind(null)}>
							Cancel
						</Button>
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
					<Card>
						<div className="stat-card-body" style={{ minHeight: 120 }}>
							<CardTitle className="title">Token</CardTitle>
							<Row>
								<Col md="6" sm="12" style={{ marginBottom: '10px' }}>
									{fetchingBalance ? <Loading /> : <p className="card-font-bold">{mobilizerBalance || 0}</p>}

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
			<MobilizerInfo information={mobilizer} />
			<ProjectInvovled projects={projectList} />

			{/* <Row>
				<Col md="12">
					<Card>
						<CardBody>
							<div className="">
								<div className="d-flex align-items-center p-4 border-bottom">
									<div className="mr-3">
										<img
											src={mobilizer.photo ? `${IPFS_GATEWAY}/ipfs/${mobilizer.photo}` : profilePhoto}
											alt="user"
											className="rounded-circle"
											width="50"
										/>
									</div>
									<div>
										<h5 className="message-title mb-0">{mobilizer ? mobilizer.name : ''}</h5>
										<p className="mb-0">Current balance: {mobilizerBalance || 0}</p>
									</div>
									<div className="ml-auto" style={{ padding: 5 }}>
										{mobilizer_status !== 'new' ? (
											<ButtonGroup>
												<Button
													onClick={() => handleChangeStatus('active')}
													disabled={mobilizer_status === 'suspended' ? false : true}
													color="success"
												>
													Activate
												</Button>
												<Button
													onClick={() => handleChangeStatus('suspended')}
													disabled={mobilizer_status === 'active' ? false : true}
													color="danger"
												>
													Suspend
												</Button>
											</ButtonGroup>
										) : loading ? (
											<Loading />
										) : (
											<Button onClick={toggleModal} className="btn" color="info">
												Approve
											</Button>
										)}
									</div>
								</div>
								<div className="details-table px-4">
									<Table responsive borderless size="sm" className="mt-4">
										<tbody>
											<tr className="d-flex">
												<td className="col-3 font-bold">Status</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="status"
														id="status"
														defaultValue={mobilizer && mobilizer.agencies ? mobilizer.agencies[0].status : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold">Phone</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="phone"
														id="phone"
														defaultValue={mobilizer ? mobilizer.phone : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold">Email</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="email"
														id="email"
														defaultValue={mobilizer ? mobilizer.email : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold">Government ID</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="govt_id"
														id="govt_id"
														defaultValue={mobilizer ? mobilizer.govt_id : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold">Wallet Address</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="wallet_address"
														id="wallet_address"
														defaultValue={mobilizer ? mobilizer.wallet_address : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold"> Address</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="address"
														id="address"
														defaultValue={mobilizer && mobilizer.address ? mobilizer.address : ''}
													/>
												</td>
											</tr>
											<tr className="d-flex">
												<td className="col-3 font-bold"> Organization</td>
												<td className="col-9">
													<Input
														readOnly
														type="text"
														name="organization"
														id="organization"
														defaultValue={mobilizer && mobilizer.organization ? mobilizer.organization : ''}
													/>
												</td>
											</tr>
										</tbody>
									</Table>
								</div>

								<div className="text-center">
									<img
										src={mobilizer.govt_id_image ? `${IPFS_GATEWAY}/ipfs/${mobilizer.govt_id_image}` : IdPhoto}
										alt="user"
										className="img-fluid"
										height="auto"
										width="38%"
									/>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row> */}

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
