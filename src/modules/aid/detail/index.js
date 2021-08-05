import React from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';

import Balance from '../../ui_components/balance';
import DetailCard from '../../global/DetailsCard';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
import Tabs from './tab/index';

const ProjectDetail = () => {
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
					<DetailCard
						title="Project Details"
						button_name="Generate QR Code"
						name="Project Name"
						name_value="Sindhupalchowk Relief Distribution"
						total="Total Project Budget"
						total_value="10,000,000"
					/>
				</Col>
				<Col md="5">
					<Balance title="Budget" button_name="Add Budget" data="50,000" label="Total Redeemed Budget" />
				</Col>
			</Row>

			<Row>
				<Col md="7">
					<ProjectInfo />
				</Col>
				<Col md="5">
					<PieChart />
				</Col>
			</Row>
			<Tabs />
		</>
	);
};

export default ProjectDetail;
