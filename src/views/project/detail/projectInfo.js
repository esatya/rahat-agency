import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import '../../project.css';

export default function ProjectInfo() {
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
						</Col>
						<Col>
							<button
								type="button"
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
								<p className="card-font-medium">Susma shahi thakuri</p>
								<div className="sub-title">Project Manager</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">Sindhupalchowk, Kavre</p>
								<div className="sub-title">Location</div>
							</div>
						</Col>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">Anish lama tamang</p>
								<div className="sub-title">Assigned Social Mobilizer</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">2020-02-23</p>
								<div className="sub-title">Created Date</div>
							</div>
						</Col>
					</Row>

					<p className="sub-title" style={{ textAlign: 'justify' }}>
						Due to landslide, flood and on going covid-19 situation many people living in Sindhupalchowk have been
						effected. They dont have food, shelter and good health care. So we with the joint hand from UNICEF are
						planning to do rahat distribution in this area. With the aim to serve atleast twenty thousand people in that
						area, we have managed one crore rupees. Hope this small gesture bring a little smile and ease their
						suffering.
					</p>
				</div>
			</Card>
		</div>
	);
}
