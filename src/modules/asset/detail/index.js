import React from 'react';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import BreadCrumb from '../../ui_components/breadcrumb';
import '../../../assets/css/project.css';

export default function NewAsset({ match }) {
	const { projectId } = match.params;

	return (
		<>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Mint Asset" />
			<Card>
				<div className="stat-card-body">
					<CardTitle className="title">Mint Asset</CardTitle>
					<CardBody className="pl-0">
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">John doe</p>
									<div className="sub-title">Name</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">150</p>
									<div className="sub-title">Quantity</div>
								</div>
							</Col>
						</Row>
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">The asset is made up of ten items. Hope it helps!</p>
									<div className="sub-title">Description</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">Dollars</p>
									<div className="sub-title">Value in fiat currency</div>
								</div>
							</Col>
						</Row>
					</CardBody>
				</div>
			</Card>
		</>
	);
}
