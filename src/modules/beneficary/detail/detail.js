import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col, FormGroup, Label, InputGroup, Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import QRCode from 'qrcode';

import Balance from '../../ui_components/balance';
import DetailsCard from '../../global/DetailsCard';
import BeneficiaryInfo from './beneficiaryInfo';
import ProjectInvovled from '../../ui_components/projects';
import BreadCrumb from '../../ui_components/breadcrumb';
import PasscodeModal from '../../global/PasscodeModal';
import ModalWrapper from '../../global/CustomModal';
import SelectWrapper from '../../global/SelectWrapper';
import { TOAST } from '../../../constants';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import { History } from '../../../utils/History';
import { htmlResponse } from '../../../utils/printSingleBeneficiary';

const BenefDetails = ({ params }) => {
	const { id } = params;
	const { addToast } = useToasts();

	const { getBeneficiaryDetails, getBeneficiaryBalance, getAvailableBalance, issueTokens } = useContext(
		BeneficiaryContext
	);
	const { isVerified, wallet, loading, setLoading, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [extras, setExtras] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [currentBalance, setCurrentBalance] = useState('');
	const [inputTokens, setInputTokens] = useState('');
	const [projectOptions, setProjectOptions] = useState([]);
	const [assignTokenAmount, setAssignTokenAmount] = useState('');

	const [fetching, setFetching] = useState(false);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [projectModal, setProjectModal] = useState(false);
	const [assignTokenModal, setAssignTokenModal] = useState(false);

	const [availableBalance, setAvailableBalance] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [selectedProject, setSelectedProject] = useState('');

	const toggleAssignTokenModal = () => setAssignTokenModal(!assignTokenModal);

	const toggleProjectModal = () => {
		// If opening modal, reset fields
		if (!projectModal) {
			setShowAlert(false);
			setAvailableBalance('');
			setInputTokens('');
			setSelectedProject('');
		}
		setProjectModal(!projectModal);
	};
	const handleInputTokenChange = e => setInputTokens(e.target.value);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleAssignTokenChange = e => setAssignTokenAmount(e.target.value);

	const handleTokenInputSubmit = e => {
		e.preventDefault();
		const { name, address, govt_id, phone } = basicInfo;
		const payload = { name, address, govt_id, phone };
		generateQrAndPrint(payload);
	};

	const generateQrAndPrint = async payload => {
		toggleAssignTokenModal();
		const imgUrl = await QRCode.toDataURL(`phone:+977${payload.phone}?amount=${assignTokenAmount || null}`);
		const html = await htmlResponse(payload, imgUrl);
		setAssignTokenAmount('');
		let newWindow = window.open('', 'Print QR', 'fullscreen=yes'),
			document = newWindow.document.open();
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};

	const handleProjectChange = async d => {
		try {
			setSelectedProject(d.value);
			setLoading(true);
			const balance = await getAvailableBalance(d.value);
			setAvailableBalance(balance);
			setShowAlert(true);
			setLoading(false);
		} catch (err) {
			setLoading(false);
			setShowAlert(false);
			addToast('Failed to fetch project balance', TOAST.ERROR);
		}
	};

	const handleIssueToken = () => toggleProjectModal();

	const handleIssueSubmit = e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		if (inputTokens > availableBalance) return addToast('Input tokens must be less than available', TOAST.ERROR);
		toggleProjectModal();
		togglePasscodeModal();
	};

	const submitRequest = useCallback(
		async (payload, wallet) => {
			try {
				setLoading(true);
				await issueTokens(payload, wallet);
				addToast(`${payload.claimable} tokens issued successfully`, TOAST.SUCCESS);
				setLoading(false);
				History.push('/beneficiaries');
			} catch (err) {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			}
		},
		[addToast, issueTokens, setLoading]
	);

	const issueBeneficiaryToken = useCallback(async () => {
		const payload = {
			claimable: +inputTokens,
			phone: +basicInfo.phone,
			projectId: selectedProject
		};
		if (isVerified && wallet) {
			setPasscodeModal(false);
			return submitRequest(payload, wallet);
		}
	}, [basicInfo.phone, inputTokens, isVerified, selectedProject, submitRequest, wallet]);

	const fetchCurrentBalance = useCallback(
		async phone => {
			try {
				const parsed_phone = parseInt(phone);
				const { rahat } = appSettings.agency.contracts;
				setFetching(true);
				const balance = await getBeneficiaryBalance(parsed_phone, rahat);
				setCurrentBalance(balance);
				setFetching(false);
			} catch (err) {
				setCurrentBalance('0');
				setFetching(false);
			}
		},
		[appSettings.agency.contracts, getBeneficiaryBalance]
	);

	const fetchBeneficiaryDetails = useCallback(async () => {
		const details = await getBeneficiaryDetails(id);
		await fetchCurrentBalance(details.phone);
		if (details && details.extras) setExtras(details.extras);
		setBasicInfo(details);
		if (details.projects && details.projects.length) {
			const projects = details.projects.map(d => {
				return { id: d._id, name: d.name };
			});
			setProjectList(projects);
			// Render select options
			const select_options = details.projects.map(d => {
				return { label: d.name, value: d._id };
			});
			setProjectOptions(select_options);
		}
	}, [fetchCurrentBalance, getBeneficiaryDetails, id]);

	useEffect(() => {
		fetchBeneficiaryDetails();
	}, [fetchBeneficiaryDetails]);

	useEffect(() => {
		issueBeneficiaryToken();
	}, [issueBeneficiaryToken, isVerified]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<ModalWrapper
				title="Issue Tokens"
				loading={loading}
				open={projectModal}
				toggle={toggleProjectModal}
				handleSubmit={handleIssueSubmit}
			>
				<FormGroup>
					<Label>Project *</Label>
					<SelectWrapper
						onChange={handleProjectChange}
						maxMenuHeight={150}
						data={projectOptions}
						placeholder="--Select Project--"
					/>{' '}
					<br />
					<Label>Tokens *</Label>
					<InputGroup>
						<Input
							type="number"
							name="tokens"
							placeholder="Enter number of tokens"
							value={inputTokens}
							onChange={handleInputTokenChange}
							required
						/>
					</InputGroup>
				</FormGroup>
				<FormGroup>
					{showAlert && availableBalance > 0 ? (
						<div className="alert alert-success fade show" role="alert">
							Availabe Balance: {availableBalance}
						</div>
					) : showAlert ? (
						<div>
							<div className="alert alert-warning fade show" role="alert">
								<p>Project has ZERO balance.</p>
							</div>
						</div>
					) : (
						''
					)}
				</FormGroup>
			</ModalWrapper>

			{/* Assign token modal */}
			<ModalWrapper
				title="Set Tokens"
				open={assignTokenModal}
				toggle={toggleAssignTokenModal}
				handleSubmit={handleTokenInputSubmit}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="assignTokenAmount"
							placeholder="Enter number of tokens (optional)"
							value={assignTokenAmount}
							onChange={handleAssignTokenChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>

			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Details" />
			<Row>
				<Col md="7">
					<DetailsCard
						handleButtonClick={toggleAssignTokenModal}
						title="Beneficiary Details"
						button_name="Generate QR Code"
						name="Name"
						name_value={basicInfo.name ? basicInfo.name : ''}
						imgUrl={basicInfo.photo ? basicInfo.photo : ''}
						total="Total Issued"
						total_value="-"
					/>
				</Col>
				<Col md="5">
					<Balance
						action="issue_token"
						title="Balance"
						button_name="Issue Token"
						data={currentBalance}
						fetching={fetching}
						loading={loading}
						label="Current Balance"
						handleIssueToken={handleIssueToken}
					/>
				</Col>
			</Row>

			{basicInfo && <BeneficiaryInfo basicInfo={basicInfo} extras={extras} />}

			<ProjectInvovled projects={projectList} />
		</>
	);
};

export default BenefDetails;
