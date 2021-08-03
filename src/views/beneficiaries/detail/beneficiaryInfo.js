import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import '../../project.css';
import image from '../../../assets/images/ID.jpg';
export default function BeneficiaryInfo() {
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title" style={{ flexBasis: '90%' }}>
							More Information
						</CardTitle>
						<div style={{ flexBasis: '10%' }}>
							<button type="button" className="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
								Edit
							</button>
						</div>
					</div>
					<Row>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">Sindhupalchowk , Kavre</p>
								<div className="sub-title">Address</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">1243567</p>
								<div className="sub-title">Government ID number</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">Differently able</p>
								<div className="sub-title">Group</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">5</p>
								<div className="sub-title">Number of family member (Adult)</div>
							</div>
						</Col>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">Bachelors in computer science</p>
								<div className="sub-title">Education</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">Female</p>
								<div className="sub-title">Gender</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">45</p>
								<div className="sub-title">Age</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">10</p>
								<div className="sub-title">Number of family member(Child)</div>
							</div>
						</Col>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">Software Engineer</p>
								<div className="sub-title">Profession</div>
							</div>
							<img src={image} alt="certificate" width="90%" height="60%" className="card-data" />
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
