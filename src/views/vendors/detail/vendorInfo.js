import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import '../../project.css';
import image from '../../../assets/images/ID.jpg';
import sign from '../../../assets/images/sign.png';

export default function VendorInfo() {
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
						<Col md="4" sm="12">
							<div className="card-data">
								<p className="card-font-medium">Susma cold store</p>
								<div className="sub-title">Shop name</div>
							</div>

							<div className="card-data">
								<p className="card-font-medium">susma@gmail.com</p>
								<div className="sub-title">Email</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">Bachelors in computer science</p>
								<div className="sub-title">Education</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">NIC Bank LTD</p>
								<div className="sub-title">Bank name</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">120975345678</p>
								<div className="sub-title">Bank account number</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<div className="card-data">
								<p className="card-font-medium">Female</p>
								<div className="sub-title">Gender</div>
							</div>

							<div className="card-data">
								<p className="card-font-medium">9867544232</p>
								<div className="sub-title">Phone number</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">Sindhupalchowk , Kavre</p>
								<div className="sub-title">Address</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">1043325</p>
								<div className="sub-title">PAN number</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">Kathmandu</p>
								<div className="sub-title">Bank branch</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<img src={image} alt="certificate" width="90%" height="150px" className="card-data" />
							<img src={sign} alt="signature" width="90%" height="100px" className="card-data" />
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
