import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import TokenByProject from './tokens_by_project';
import BeneficiaryByProject from './beneficiary_by_project';
import { StatsCard } from '../ui_components/cards';
import { TOAST } from '../../constants';
import { UserContext } from '../../contexts/UserContext';
import TransactionChart from '../ui_components/chart';

const Dashboard = () => {
	const { addToast } = useToasts();

	const { getDashboardStats } = useContext(UserContext);
	const [stats, setStats] = useState({
		totalProjects: 0,
		totalVendors: 0,
		totalBeneficiaries: 0,
		totalMobilizers: 0,
		totalAllocation: 0,
		redeemedTokens: 0,
		beneficiariesByProject: [],
		tokensByProject: [],
		totalInstitutions: 0
	});
	const [exportData, setExportData] = useState({
		tokens_by_project: [],
		benef_by_project: []
	});

	const fetchDashboardStats = () => {
		getDashboardStats()
			.then(d => {
				const {
					projectCount,
					vendorCount,
					beneficiary,
					mobilizerCount,
					tokenAllocation,
					institutionCount,
					tokenRedemption
				} = d;
				if (beneficiary && beneficiary.project.length) setBeneficiaryByProjectExport(beneficiary.project);
				if (tokenAllocation && tokenAllocation.projectAllocation.length)
					setTokensByProjectExport(tokenAllocation.projectAllocation);
				setStats(prevState => ({
					...prevState,
					totalProjects: projectCount,
					totalVendors: vendorCount,
					totalBeneficiaries: beneficiary.totalCount,
					totalMobilizers: mobilizerCount,
					totalAllocation: tokenAllocation.totalAllocation,
					redeemedTokens: tokenRedemption.totalTokenRedemption,
					beneficiariesByProject: beneficiary.project,
					tokensByProject: tokenAllocation.projectAllocation,
					totalInstitutions: institutionCount
				}));
			})
			.catch(() => {
				addToast('Internal server error!', TOAST.ERROR);
			});
	};

	const setBeneficiaryByProjectExport = data => {
		const export_data = data.map(d => {
			return { Project: d.name, Count: d.count };
		});
		setExportData(prevState => ({
			...prevState,
			benef_by_project: export_data
		}));
	};

	const setTokensByProjectExport = data => {
		const export_data = data.map(d => {
			return { Project: d.name, Tokens: d.token };
		});
		setExportData(prevState => ({
			...prevState,
			tokens_by_project: export_data
		}));
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
						title="Mobilizers"
						title_color="#F7C087"
						icon_color="#F7C087"
						icon_name="fas fa-dollar-sign"
						data={stats.totalMobilizers}
					/>
				</Col>
			</Row>
			<Row>
				<Col md="8">
					<TokenByProject data={stats.tokensByProject} exportData={exportData.tokens_by_project || []} />
				</Col>
				<Col md="4">
					<BeneficiaryByProject
						releasedToken={stats.totalAllocation}
						redeemedTokens={stats.redeemedTokens}
						data={stats.beneficiariesByProject}
						exportData={exportData.benef_by_project || []}
					/>
				</Col>
			</Row>
			<TransactionChart />
		</>
	);
};

export default Dashboard;
