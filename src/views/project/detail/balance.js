import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import './project.css';

export default function Balance(props) {
	const { title, data, button_name, label } = props;
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">{title || 'No Title'}</CardTitle>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flexBasis: '70%' }}>
							<p className="card-font-bold">{data || '0'}</p>
							<div style={{ marginTop: 0 }} className="sub-title">
								{label || 'No Label'}
							</div>
						</div>
						<div style={{ flexBasis: '30%' }}>
							<button
								type="button"
								class="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px' }}
							>
								{button_name || 'button'}
							</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
