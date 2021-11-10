import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Card, CardTitle, Col, Row, FormGroup, Input, Label } from 'reactstrap';

import { History } from '../../../utils/History';
import '../../../assets/css/project.css';
import QRGenerator from './qrGenerator';
import ReactToPrint from 'react-to-print';
import ModalWrapper from '../../global/CustomModal';

export default function ProjectInfo({ projectDetails }) {
	const { _id, social_mobilizer, project_manager, location, description, created_at, serial_index } = projectDetails;

	const handleEditClick = () => History.push(`/edit-project/${_id}`);

	const [qrGenModal, setQrGenModal] = useState(false);
	const [qrGenData, setQrGenData] = useState({ min: 0, max: 0, projectVersion: 0, amount: null });
	// const [qrGenLoading, setQrGenLoading] = useState(false);

	const toggleQrGen = () => {
		setQrGenModal(!qrGenModal);
		setQrGenData({ min: 0, max: 0, projectVersion: serial_index, amount: null });
	};
	// const toggleQrGenLoading = () => setQrGenLoading(!qrGenLoading);

	const qrComponentRef = useRef();
	const printRef = useRef();
	const handleQrGenSubmit = e => {
		e.preventDefault();
		printRef.current.handleClick();
	};

	// useReactToPrint({
	// 	content: () => qrComponentRef.current
	// });
	const handleQrGenData = e => {
		console.log(e.target.name);
		if (e.target.name === 'max' && e.target.value > 100) return;

		setQrGenData({ ...qrGenData, [e.target.name]: e.target.value || null });
	};

	return (
		<div>
			<div style={{ display: 'none' }}>
				<QRGenerator props={qrGenData} ref={qrComponentRef} />
				<ReactToPrint trigger={() => <React.Fragment />} content={() => qrComponentRef.current} ref={printRef} />
			</div>
			<ModalWrapper
				toggle={toggleQrGen}
				open={qrGenModal}
				title="Pre-Generate Qr-Code"
				handleSubmit={handleQrGenSubmit}
				// loading={qrGenLoading}
			>
				<FormGroup>
					<Label>Number of Qr-code</Label>
					<Input
						type="number"
						name="max"
						placeholder="please enter no. between 0 - 100"
						value={qrGenData.max || ''}
						onChange={handleQrGenData}
						min={0}
						max={100}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label>Token Amount</Label>
					<Input
						type="number"
						name="amount"
						placeholder="please enter token amount for qr-code"
						value={qrGenData.amount || ''}
						onChange={handleQrGenData}
					/>
				</FormGroup>
			</ModalWrapper>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 330 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
						</Col>
						<Col>
							<div style={{ flex: 1, padding: 2, float: 'right' }}>
								<button
									onClick={toggleQrGen}
									type="button"
									className="btn waves-effect waves-light btn-outline-info"
									style={{ borderRadius: '8px', marginRight: '20px' }}
								>
									Pre-Generate Qr code
								</button>
								<button
									type="button"
									onClick={handleEditClick}
									className="btn waves-effect waves-light btn-info"
									style={{ borderRadius: '8px' }}
								>
									Edit
								</button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">
									{project_manager ? `${project_manager.name.first} ${project_manager.name.last}` : '-'}
								</p>
								<div className="sub-title">Project Manager</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{location || '-'}</p>
								<div className="sub-title">Location</div>
							</div>
						</Col>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{social_mobilizer || '-'}</p>
								<div className="sub-title">Social Mobilizer</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{moment(created_at).format('ll')}</p>
								<div className="sub-title">Created Date</div>
							</div>
						</Col>
					</Row>

					<p className="sub-title" style={{ textAlign: 'justify' }}>
						{description || 'Project description not available...'}
					</p>
				</div>
			</Card>
		</div>
	);
}
