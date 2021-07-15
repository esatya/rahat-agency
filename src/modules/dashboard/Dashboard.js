import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import BeneficiaryStats from './beneficiary_stats';
import TokensByProject from './tokens_by_project';
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
		beneficiariesByProject: [],
		tokensByProject: []
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
					beneficiariesByProject: d.beneficiary.project,
					tokensByProject: d.tokenAllocation.projectAllocation
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

	// useEffect(() => {
	// 	(async () => {
	// 		initApp();
	// 	})();
	// }, [initApp]);

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
						title="Beneficiary"
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
						title="Financial Institutions"
						title_color="#F7C087"
						icon_color="#F7C087"
						icon_name="fas fa-dollar-sign"
						data={stats.totalProjects}
					/>
				</Col>
				{/* <Col md="3">
					<AgencyTokens allocatedTokens={stats.totalAllocation} />
				</Col>
				<Col md="3">
					<AgencyTokens allocatedTokens={stats.totalAllocation} />
				</Col> */}
				{/* <Col md="8">
					<TotalStats
						vendors={stats.totalVendors}
						projects={stats.totalProjects}
						beneficiaries={stats.totalBeneficiaries}
					/>
				</Col> */}
			</Row>
			<Row>
				<Col md="8">
					<BeneficiaryStats data={stats.beneficiariesByProject} />
				</Col>
				<Col md="4">
					<TokensByProject data={stats.tokensByProject} />
				</Col>
			</Row>
		</>
	);
};

export default Dashboard;
