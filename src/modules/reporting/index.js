import React from 'react';
import { Row, Col } from 'reactstrap';
import { ReportCard } from '../ui_components/cards';
import { Link } from 'react-router-dom';

const Reporting = () => {
	return (
		<>
			<Row>
				<Col md="6">
					<Link to={`/report-project`}>
						<ReportCard data="" title="Projects" icon_color="#2b7ec1" icon_name="fas fa-clone" />
					</Link>
				</Col>
				<Col md="6">
					<Link to={`/report-beneficiary`}>
						<ReportCard data="" title="Beneficiaries" icon_color="#80D5AA" icon_name="fas fa-users" />
					</Link>
				</Col>
			</Row>

			<Row>
				<Col md="6">
					<Link to={`/report-vendor`}>
						<ReportCard data="" title="Vendors" icon_color="#F49786" icon_name="fas fa-anchor" />
					</Link>
				</Col>
				<Col md="6">
					<Link to={`/report-mobilizer`}>
						<ReportCard data="" title="Mobilizers" icon_color="#F7C087" icon_name="fas fa-dollar-sign" />
					</Link>
				</Col>
			</Row>
		</>
	);
};
export default Reporting;
