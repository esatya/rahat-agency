import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import DetailsCard from '../../global/DetailsCard';
import Balance from '../../ui_components/balance';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
import Tabs from './tab';
import { TOAST, PROJECT_STATUS } from '../../../constants';

export default function Index(props) {
	const { id } = props.match.params;

	const { addToast } = useToasts();
	const { getAidDetails, changeProjectStatus, getProjectCapital, getAidBalance } = useContext(AidContext);
	const { appSettings } = useContext(AppContext);

	const [projectDetails, setProjectDetails] = useState(null);
	const [totalTokens, setTotalTokens] = useState(0);
	const [availableTokens, setAvailableTokens] = useState(0);

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

	const fetchTokenDetails = () => {
		const { rahat_admin } = appSettings.agency.contracts;
		getProjectCapital(id, rahat_admin)
			.then(d => {
				setTotalTokens(d);
			})
			.catch(() => {
				addToast('Failed to fetch project capital.', TOAST.ERROR);
			});
	};

	const fetchProjectBalance = () => {
		const { rahat_admin } = appSettings.agency.contracts;
		getAidBalance(id, rahat_admin)
			.then(d => {
				setAvailableTokens(d);
			})
			.catch(() => {});
	};

	useEffect(fetchProjectDetails, []);
	useEffect(fetchTokenDetails, []);
	useEffect(fetchProjectBalance, []);

	return (
		<>
			<p className="page-heading">Projects</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Projects</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Detail</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="7">
					{projectDetails && (
						<DetailsCard
							title="Project Details"
							button_name="Generate QR Code"
							name="Project Name"
							name_value={projectDetails.name}
							status={projectDetails.status}
							total="Project Budget"
							total_value={totalTokens}
							handleStatusChange={handleStatusChange}
						/>
					)}
				</Col>
				<Col md="5">
					<Balance title="Budget" button_name="Add Budget" data={availableTokens} label="Available Budget" />
				</Col>
			</Row>

			<Row>
				<Col md="7">{projectDetails && <ProjectInfo projectDetails={projectDetails} />}</Col>
				<Col md="5">
					<PieChart available_tokens={availableTokens} total_tokens={totalTokens} />
				</Col>
			</Row>
			<Tabs />
		</>
	);
}
