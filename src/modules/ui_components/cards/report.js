import React from 'react';
import { Card, CardBody } from 'reactstrap';

import './cards.css';

export default function Stats(props) {
	const { title, data, icon_name, icon_color } = props;
	return (
		<div>
			<Card>
				<div className="card-body">
					<CardBody className="title text-center">
						<i style={{ color: icon_color || '#222', fontSize: '40px' }} className={icon_name}></i>
						<br />
						<h3 className="report-title">{title || 'No Title'}</h3>
						<p className="report-data">
							Total {title || 'No Title'}: {data || '0'}
						</p>
					</CardBody>
				</div>
			</Card>
		</div>
	);
}
