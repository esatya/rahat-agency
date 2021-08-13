import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import '../../project.css';
import displayPic from '../../../assets/images/users/user_avatar.svg';

export default function VendorDetail(props) {
	const { name } = props;
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title" style={{ flexBasis: '70%' }}>
						Vendor Detail
					</CardTitle>

					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={displayPic} alt="user" className="rounded-circle" width="45" />
								<div style={{ marginLeft: '20px' }}>
									<p className="card-font-medium">{name || ''}</p>
									<div className="sub-title">Name</div>
								</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<button
								type="button"
								className="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px', float: 'right' }}
							>
								Approve
							</button>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
