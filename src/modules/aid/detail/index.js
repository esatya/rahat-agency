import React, { useContext, useEffect, useState, useCallback } from 'react';
import {Row, Col} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import DetailsCard from '../../global/DetailsCard';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
// import BarChart from './barChart';
import Tabs from './tab';
import {TOAST, PROJECT_STATUS, ROLES} from '../../../constants';
import BreadCrumb from '../../ui_components/breadcrumb';
import {getUser} from "../../../utils/sessionManager";
import {useHistory} from "react-router-dom";
import API from "../../../constants/api";
// import Balance from '../../ui_components/balance';


export default function Index(props) {
	const { id } = props.match.params;
	const history = useHistory();
	const { addToast } = useToasts();
	const {
		total_tokens,
		available_tokens,
		getAidDetails,
		changeProjectStatus,
		getProjectCapital,
		getAidBalance,
		getProjectPackageBalance
	} = useContext(AidContext);
	const {
		// loading,
		appSettings
	} = useContext(AppContext);

	const [projectDetails, setProjectDetails] = useState(null);
	const [fetchingBlockchain, setFetchingBlockchain] = useState(false);
	const [totalFiatBalance, setTotalFiatBalance] = useState(0);
	const [totalRemainingFiatBalance,setTotalRemainingFiatBalance] = useState(0)

	const handleStatusChange = status => {
		const success_label = status === PROJECT_STATUS.CLOSED ? 'Closed' : 'Activated';
		changeProjectStatus(id, status)
			.then(d => {
				setProjectDetails(d);
				addToast(`Project has been ${success_label}`, TOAST.SUCCESS);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const fetchProjectDetails = () => {
		getAidDetails(id)
			.then(res => {
				setProjectDetails(res);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const fetchPackageAndTokenBalance = useCallback(async () => {
		if (!appSettings) return;
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		try {
			setFetchingBlockchain(true);
			const { rahat_admin } = agency.contracts;
			await getProjectCapital(id, rahat_admin);
			await getAidBalance(id, rahat_admin);
			const res = await getProjectPackageBalance(id, rahat_admin);
			console.log({ res });
			setTotalFiatBalance(res.projectCapital.grandTotal || 0);
			setTotalRemainingFiatBalance(res.remainingBalance.grandTotal || 0)
		} catch (err) {
			console.log(err);
			addToast(err.message, TOAST.ERROR);
		} finally {
			setFetchingBlockchain(false);
		}
	}, [addToast, appSettings, getAidBalance, getProjectCapital, id, getProjectPackageBalance]);

	useEffect(fetchProjectDetails, []);

	useEffect(() => {
		fetchPackageAndTokenBalance();
	}, [fetchPackageAndTokenBalance]);

	const handleCampaignClick = () => {
		window.open(`${API.FUNDRAISER_FUNDRAISE}/${projectDetails.campaignId}/edit`, '_blank');
		}
	const handleClick = () => {
		const currentUser = getUser();
		const isManager = currentUser && currentUser.roles.includes(ROLES.MANAGER);
		if (isManager || projectDetails.status === PROJECT_STATUS.SUSPENDED)
			return addToast('Access denied for this operation!', TOAST.ERROR);
		history.push(`/add-campaign/${id}`);
	};
	return (
		<>
			<Row>
				<Col md="9">
					<p className="page-heading">Projects</p>
					<BreadCrumb redirect_path="projects" root_label="Projects" current_label="Details"/>
				</Col>

				<Col md="3">
					{projectDetails && projectDetails.campaignId &&
						(
							<button onClick={handleCampaignClick} type="button"
										   className="btn waves-effect waves-light btn-outline-info"
										   style={{borderRadius: '8px', minWidth:'12px'}}>{projectDetails.campaignTitle}
						</button>)}
					{projectDetails && projectDetails.campaignId == null &&
						<button onClick={handleClick} type="button"
								className="btn waves-effect waves-light btn-outline-info"
								style={{borderRadius: '8px'}}> Add Campaign
						</button>
					}
				</Col>
			</Row>
			<Row>
				<Col md="7">
					{projectDetails && (
						<DetailsCard
							fetching={fetchingBlockchain}
							title="Project Details"
							button_name="Generate QR Code"
							name="Project Name"
							name_value={projectDetails.name}
							status={projectDetails.status}
							total="Project Budget"
							total_value={total_tokens}
							handleStatusChange={handleStatusChange}
						/>
					)}
					{projectDetails && <ProjectInfo projectDetails={projectDetails} />}
				</Col>
				<Col md="5">
					{projectDetails && (
						<PieChart
							fetching={fetchingBlockchain}
							available_tokens={available_tokens}
							total_tokens={total_tokens}
							total_package={totalFiatBalance}
							available_package = {totalRemainingFiatBalance}
							projectStatus={projectDetails.status}
							projectId={id}
						/>
					)}

					{/* {projectDetails && (
						<Balance
							action=""
							title="Balance"
							button_name="Add Budget"
							token_data={available_tokens}
							package_data={totalFiatBalance}
							fetching={fetchingBlockchain}
							loading={loading}
							projectStatus={projectDetails.status}
							projectId={id}
						/>
					)} */}
				</Col>
			</Row>

			{/* <Row> */}
			{/* <Col md="7">{projectDetails && <ProjectInfo projectDetails={projectDetails} />}</Col> */}
			{/* <Col md="5"> */}
			{/* <PieChart
						fetching={fetchingBlockchain}
						available_tokens={available_tokens}
						total_tokens={total_tokens}
						total_package={totalFiatBalance}
					/> */}

			{/* <BarChart
						fetching={fetchingBlockchain}
						available_tokens={available_tokens}
						total_tokens={total_tokens}
						total_package={totalFiatBalance}
					/> */}
			{/* </Col> */}
			{/* </Row> */}
			<Tabs projectId={id} />
		</>
	);
}
