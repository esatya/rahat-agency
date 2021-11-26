import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import DetailsCard from '../../global/DetailsCard';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
import Tabs from './tab';
import { TOAST, PROJECT_STATUS } from '../../../constants';
import BreadCrumb from '../../ui_components/breadcrumb';
import Balance from '../../ui_components/balance';

export default function Index(props) {
	const { id } = props.match.params;

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
	const { loading, appSettings } = useContext(AppContext);

	const [projectDetails, setProjectDetails] = useState(null);
	const [fetchingBlockchain, setFetchingBlockchain] = useState(false);
	const [totalFiatBalance, setTotalFiatBalance] = useState(null);

	const handleStatusChange = status => {
		const success_label = status === PROJECT_STATUS.SUSPENDED ? 'Suspended' : 'Activated';
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
		try {
			setFetchingBlockchain(true);
			const { rahat_admin } = appSettings.agency.contracts;
			await getProjectCapital(id, rahat_admin);
			await getAidBalance(id, rahat_admin);
			const res = await getProjectPackageBalance(id, rahat_admin);
			setTotalFiatBalance(res);
		} catch (err) {
			addToast(err.message, TOAST.ERROR);
		} finally {
			setFetchingBlockchain(false);
		}
	}, [addToast, appSettings.agency.contracts, getAidBalance, getProjectCapital, id, getProjectPackageBalance]);

	useEffect(fetchProjectDetails, []);

	useEffect(() => {
		fetchPackageAndTokenBalance();
	}, [fetchPackageAndTokenBalance]);

	return (
		<>
			<p className="page-heading">Projects</p>
			<BreadCrumb redirect_path="projects" root_label="Projects" current_label="Details" />
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
				</Col>
				<Col md="5">
					{projectDetails && (
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
					)}
				</Col>
			</Row>

			<Row>
				<Col md="7">{projectDetails && <ProjectInfo projectDetails={projectDetails} />}</Col>
				<Col md="5">
					<PieChart fetching={fetchingBlockchain} available_tokens={available_tokens} total_tokens={total_tokens} />
				</Col>
			</Row>
			<Tabs projectId={id} />
		</>
	);
}
