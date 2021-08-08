import React from 'react';
import moment from 'moment';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import { History } from '../../../utils/History';
import '../../../assets/css/project.css';

export default function ProjectInfo({ projectDetails }) {
	const { _id, social_mobilizer, project_manager, location, description, created_at } = projectDetails;

	const handleEditClick = () => History.push(`/edit-project/${_id}`);

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 330 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
						</Col>
						<Col>
							<button
								type="button"
								onClick={handleEditClick}
								className="btn waves-effect waves-light btn-info"
								style={{ borderRadius: '8px', float: 'right' }}
							>
								Edit
							</button>
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
