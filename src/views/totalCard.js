import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import './project.css';

export default function Balance(props) {
	const { title, data1, data2, sub_title1, sub_title2 } = props;

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">{title}</CardTitle>
					<Row>
						<Col md="6" sm="12" style={{ marginBottom: '10px' }}>
							<p className="card-font-bold">{data1}</p>
							<div className="sub-title">{sub_title1}</div>
						</Col>
						<Col md="6" sm="12">
							<p className="card-font-bold">{data2}</p>
							<div className="sub-title">{sub_title2}</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
