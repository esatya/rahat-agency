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
import { htmlResponse } from '../../../utils/printSingleBeneficiary';
import { useHistory } from 'react-router-dom';

const BenefDetails = ({ params }) => {
	const { id } = params;
	const { addToast } = useToasts();
	const history = useHistory();

	const {
		getBeneficiaryDetails,
		getBeneficiaryBalance,
		getBenfPackageBalance,
		listProject,
		getTotalIssuedTokens,
		addBenfToProject

	} = useContext(BeneficiaryContext);
	const { loading, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [extras, setExtras] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [currentBalance, setCurrentBalance] = useState('');
	const [allProjects, setAllProjects] = useState([]);
	const [assignTokenAmount, setAssignTokenAmount] = useState('');

	const [fetching, setFetching] = useState(false);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [projectModal, setProjectModal] = useState(false);
	const [assignTokenModal, setAssignTokenModal] = useState(false);

	const [selectedProject, setSelectedProject] = useState('');
	const [totalPackageBalance, setTotalPackageBalance] = useState(null);
	const [totalIssuedTokens, setTotalIssuedTokens] = useState(null);
	const [addProjectModal, setAddProjectModal] = useState(false);


	const toggleAssignTokenModal = () => setAssignTokenModal(!assignTokenModal);
	const toggleAddProjectModal = () => {
		if (!addProjectModal) setSelectedProject('');
		setAddProjectModal(!addProjectModal);
	};

	const toggleProjectModal = () => {
		// If opening modal, reset fields
		if (!projectModal) {
			// setShowAlert(false);
			// setAvailableBalance('');
			// setInputTokens('');
			setSelectedProject('');
		}
		setProjectModal(!projectModal);
	};

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
		console.log({ newWindow });
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};

	const handleAddBtnClick = e => {
		e.preventDefault();
		toggleAddProjectModal();
	};

	const handleAddprojectSubmit = async e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		try {
			await addBenfToProject(id, selectedProject);
			addToast('Beneficiary added to the project', TOAST.SUCCESS);
			history.push('/beneficiaries');
		} catch (err) {
			const errMsg = err.message ? err.message : 'Internal server error';
			addToast(errMsg, TOAST.ERROR);
		}
	};


	const handleProjectChange = d => setSelectedProject(d.value);

	const handleIssueToken = () => toggleProjectModal();

	const handleIssueSubmit = e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		toggleProjectModal();
		history.push(`/issue-budget/${selectedProject}/benf/${id}`);
	};

	const fetchCurrentBalance = useCallback(
		async phone => {
			const {agency} = appSettings
			if(!agency || !agency.contracts) return;
			try {
				const parsed_phone = parseInt(phone);
				const { rahat } = agency.contracts;
				setFetching(true);
				const balance = await getBeneficiaryBalance(parsed_phone, rahat);
				const res = await getBenfPackageBalance(parsed_phone, rahat);
				const issuedTokens = await getTotalIssuedTokens(parsed_phone, rahat);
				setTotalIssuedTokens(issuedTokens);
				setTotalPackageBalance(res);
				setCurrentBalance(balance);
				setFetching(false);
			} catch (err) {
				setCurrentBalance('0');
				setFetching(false);
			}
		},
		[appSettings, getBeneficiaryBalance, getBenfPackageBalance, getTotalIssuedTokens]
	);

	const fetchBeneficiaryDetails = useCallback(async () => {
		const details = await getBeneficiaryDetails(id);
		if (details && details.extras) setExtras(details.extras);
		setBasicInfo(details);
		if (details.projects && details.projects.length) {
			const projects = details.projects.map(d => {
				return { id: d._id, name: d.name };
			});
			setProjectList(projects);
		}
		await fetchCurrentBalance(details.phone);

	}, [fetchCurrentBalance, getBeneficiaryDetails, id]);

	const fetchAllProjects = useCallback(async () => {
		const { data } = await listProject();
		if (data && data.length) {
			const select_options = data.map(d => {
				return { label: d.name, value: d._id };
			});
			setAllProjects(select_options);
		}
	}, [listProject]);

	useEffect(() => {
		fetchBeneficiaryDetails();
	}, [fetchBeneficiaryDetails]);

	useEffect(() => {
		fetchAllProjects();
	}, [fetchAllProjects]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			{/* Add to project modal */}
			<ModalWrapper
				title="Add to project"
				loading={loading}
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
						data={allProjects}
						placeholder="--Select Project--"
					/>{' '}
					{/* <br />
					<Label>Recent projects</Label>
					<br />
					{benfProjects.map(project => (
						<button
							type="button"
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px' }}
							onClick={handleProjectClick}
						>
							{project.label || 'button'}
						</button>
					))} */}
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
						fetching={fetching}
						handleButtonClick={toggleAssignTokenModal}
						title="Beneficiary Details"
						button_name="Generate QR Code"
						name="Name"
						name_value={basicInfo.name ? basicInfo.name : ''}
						imgUrl={basicInfo.photo ? basicInfo.photo : ''}
						total="Issued Tokens"
						total_value={totalIssuedTokens}
					/>
				</Col>
				<Col md="5">
					<Balance
						action="issue_token"
						title="Balance"
						button_name="Issue"
						token_data={currentBalance}
						package_data={totalPackageBalance}
						fetching={fetching}
						loading={loading}
						handleIssueToken={handleIssueToken}
					/>
				</Col>
			</Row>

			{basicInfo && <BeneficiaryInfo basicInfo={basicInfo} extras={extras} />}

			<ProjectInvovled handleAddBtnClick={handleAddBtnClick} showAddBtn={true} projects={projectList} />
		</>
	);
};

export default BenefDetails;
