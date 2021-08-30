import React from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import Balance from '../../balance';
import DetailCard from '../../detailCard';
import BeneficiaryInfo from './beneficiaryInfo';
import ProjectInvovled from '../../projectInvolved';

const projects = [
	{ id: '0', name: 'Sindhupalchowk relief' },
	{ id: '1', name: 'Flood relief distribution' }
];
const BeneficiaryDetail = () => {
	return (
		<>
			<p className="page-heading">Beneficiary</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Beneficiary</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Detail</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="7">
					<DetailCard
						title="Beneficiary Details"
						button_name="Generate QR Code"
						name="Name"
						name_value="Susma shahi thakuri"
						total="Total Issued"
						total_value="1,500"
					/>
				</Col>
				<Col md="5">
					<Balance title="Balance" button_name="Issue Token" data="500" label="Current Balance" />
				</Col>
			</Row>

			<BeneficiaryInfo />
			<ProjectInvovled projects={projects} />
		</>
	);
};

export default BeneficiaryDetail;
