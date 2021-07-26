import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import TokenByProject from './tokens_by_project';
import BeneficiaryByProject from './beneficiary_by_project';
import { StatsCard } from '../ui_components/cards';

import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
	const { addToast } = useToasts();

	const { getDashboardStats } = useContext(UserContext);
	const [stats, setStats] = useState({
		totalProjects: 0,
		totalVendors: 0,
		totalBeneficiaries: 0,
		totalAllocation: 0,
		redeemedTokens: 0,
		beneficiariesByProject: [],
		tokensByProject: [],
		totalInstitutions: 0
	});

	const fetchDashboardStats = () => {
		getDashboardStats()
			.then(d => {
				setStats(prevState => ({
					...prevState,
					totalProjects: d.projectCount,
					totalVendors: d.vendorCount,
					totalBeneficiaries: d.beneficiary.totalCount,
					totalAllocation: d.tokenAllocation.totalAllocation,
					redeemedTokens: d.tokenRedemption.totalTokenRedemption,
					beneficiariesByProject: d.beneficiary.project,
					tokensByProject: d.tokenAllocation.projectAllocation,
					totalInstitutions: d.institutionCount
				}));
			})
			.catch(() => {
				addToast('Internal server error!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(fetchDashboardStats, []);

	return (
		<>
			<Row>
				<Col md="3">
					<StatsCard
						title="Projects"
						title_color="#2b7ec1"
						icon_color="#2b7ec1"
						icon_name="fas fa-clone"
						data={stats.totalProjects}
					/>
				</Col>
				<Col md="3">
					<StatsCard
						title="Beneficiaries"
						title_color="#80D5AA"
						icon_color="#80D5AA"
						icon_name="fas fa-users"
						data={stats.totalBeneficiaries}
					/>
				</Col>
				<Col md="3">
					<StatsCard
						title="Vendors"
						title_color="#F49786"
						icon_color="#F49786"
						icon_name="fas fa-anchor"
						data={stats.totalVendors}
					/>
				</Col>
				<Col md="3">
					<StatsCard
						title="Institutions"
						title_color="#F7C087"
						icon_color="#F7C087"
						icon_name="fas fa-dollar-sign"
						data={stats.totalInstitutions}
					/>
				</Col>
			</Row>
			<Row>
				<Col md="8">
					<TokenByProject data={stats.tokensByProject} />
				</Col>
				<Col md="4">
					<BeneficiaryByProject
						releasedToken={stats.totalAllocation}
						redeemedTokens={stats.redeemedTokens}
						data={stats.beneficiariesByProject}
					/>
				</Col>
			</Row>
		</>
	);
};

export default Dashboard;
