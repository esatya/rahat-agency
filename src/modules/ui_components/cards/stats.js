import React from 'react';
import { Card, CardTitle } from 'reactstrap';

import './cards.css';

export default function Stats(props) {
	const { title, title_color, data, icon_name, icon_color } = props;
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle style={{ color: title_color || '#222' }} className="title">
						{title || 'No Title'}
					</CardTitle>
					<br />
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h2 style={{ flexBasis: '70%' }} className="card-font-medium">
							{data || '0'}
						</h2>
						<h2 style={{ flexBasis: '30%' }} className="card-font-medium">
							<i style={{ color: icon_color || '#222' }} class={icon_name}></i>
						</h2>
					</div>
					<div style={{ marginTop: 0 }} className="sub-title">
						Total {title}
					</div>
				</div>
				{/* <div className="earningsbox mt-1"></div> */}
			</Card>
		</div>
	);
}
