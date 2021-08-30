import React from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import TotalCard from '../../totalCard';
import VendorDetail from './vendorDetail';
import VendorInfo from './vendorInfo';
import ProjectInvovled from '../../projectInvolved';
import TransactionHistory from './transactionHistory';

const projects = [
	{ id: '0', name: 'Sindhupalchowk relief' },
	{ id: '1', name: 'Flood relief distribution' }
];
const Index = () => {
	return (
		<>
			<p className="page-heading">Vendors</p>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<a href="/">Vendors</a>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb>Detail</BreadcrumbItem>
			</Breadcrumb>
			<Row>
				<Col md="7">
					<VendorDetail name="Susma shahi thakuri" />
				</Col>
				<Col md="5">
					<TotalCard
						title="Token"
						data1="Balance"
						sub_title1="Token Status"
						data2="50,000"
						sub_title2="Total Redeemed "
					/>
				</Col>
			</Row>

			<VendorInfo />
			<ProjectInvovled projects={projects} />
			<TransactionHistory />
		</>
	);
};

export default Index;
