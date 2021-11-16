import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Card, CardBody, CardTitle, Col, Row, FormGroup, InputGroup, Label, Input } from 'reactstrap';

import BreadCrumb from '../../ui_components/breadcrumb';
import '../../../assets/css/project.css';
import BackButton from '../../global/BackButton';

import { AidContext } from '../../../contexts/AidContext';

export default function NewAsset({ match }) {
	const { packageId, projectId } = match.params;

	const { getPackageDetails } = useContext(AidContext);
	const [packageDetails, setPackageDetails] = useState(null);

	const handleQuantitySubmit = e => {
		e.preventDefault();
	};

	const fetchPackageDetails = useCallback(async () => {
		const d = await getPackageDetails(packageId);
		setPackageDetails(d);
	}, [packageId, getPackageDetails]);

	useEffect(() => {
		fetchPackageDetails();
	}, [fetchPackageDetails]);

	return (
		<>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Mint Package" />
			<Card>
				<div className="stat-card-body">
					<CardTitle className="title">Mint Package</CardTitle>
					<CardBody className="pl-0">
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.name ? packageDetails.name : '-'}{' '}
										{packageDetails && packageDetails.symbol ? `(${packageDetails.symbol})` : '-'}
									</p>
									<div className="sub-title">Name</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.totalSupply ? packageDetails.totalSupply : '-'}
									</p>
									<div className="sub-title">Quantity</div>
								</div>
							</Col>
						</Row>
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.metadata.description ? packageDetails.metadata.description : '-'}
									</p>
									<div className="sub-title">Description</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.metadata.currency ? packageDetails.metadata.currency : 'NPR'} {''}
										{packageDetails && packageDetails.metadata.fiatValue ? packageDetails.metadata.fiatValue : '-'}
									</p>
									<div className="sub-title">Value in fiat currency</div>
								</div>
							</Col>
						</Row>
					</CardBody>

					<hr />

					<CardBody>
						<FormGroup>
							<Label>
								Mint package <span style={{ fontSize: 12 }}>-Entered quantity will be added to existing quantity</span>
							</Label>
							<form onSubmit={handleQuantitySubmit}>
								<InputGroup>
									<Input type="number" name="mintQty" placeholder="Enter quantity" required />
									&nbsp;
									<button type="submit" className="btn waves-effect waves-light btn-info">
										Mint Now
									</button>
								</InputGroup>
							</form>
						</FormGroup>
						<BackButton />
					</CardBody>
				</div>
			</Card>
		</>
	);
}
