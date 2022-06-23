import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'reactstrap';
import { ReportCard } from '../ui_components/cards';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../constants';
import { UserContext } from '../../contexts/UserContext';

const Reporting = () => {
	const { addToast } = useToasts();

	const { getDashboardStats } = useContext(UserContext);
	const [stats, setStats] = useState({
		totalProject: '',
		totalBeneficiary: '',
		totalMobilizer: '',
		totalVendor: '',
		beneficiaryByProject: []
	});

	const fetchDashboardStats = () => {
		getDashboardStats()
			.then(data => {
				const { projectCount, mobilizerCount, vendorCount, beneficiary } = data;
				setStats(prevState => ({
					...prevState,
					totalProject: projectCount,
					totalBeneficiary: beneficiary.totalCount,
					totalMobilizer: mobilizerCount,
					totalVendor: vendorCount,
					beneficiaryByProject: beneficiary.project
				}));
			})
			.catch(() => {
				addToast('Internal server error!', TOAST.ERROR);
			});
	};

	useEffect(fetchDashboardStats, []);
	return (
		<>
			<Row>
				<Col md="6">
					<Link to={`/report-project`}>
						<ReportCard data={stats.totalProject} title="Projects" icon_color="#2b7ec1" icon_name="fas fa-clone" />
					</Link>
				</Col>
				<Col md="6">
					<Link to={`/report-beneficiary`}>
						<ReportCard
							data={stats.totalBeneficiary}
							title="Beneficiaries"
							icon_color="#80D5AA"
							icon_name="fas fa-users"
						/>
					</Link>
				</Col>
			</Row>

			<Row>
				<Col md="6">
					<Link to={`/report-vendor`}>
						<ReportCard data={stats.totalVendor} title="Vendors" icon_color="#F49786" icon_name="fas fa-anchor" />
					</Link>
				</Col>
				<Col md="6">
					<Link to={`/report-mobilizer`}>
						<ReportCard
							data={stats.totalMobilizer}
							title="Mobilizers"
							icon_color="#F7C087"
							icon_name="fas fa-dollar-sign"
						/>
					</Link>
				</Col>
			</Row>
		</>
	);
};
export default Reporting;
