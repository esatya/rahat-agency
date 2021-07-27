import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import './project.css';

export default function DetailCard(props) {
	const { title, button_name, name, name_value, total, total_value } = props;
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title" style={{ flexBasis: '70%' }}>
							{title || 'No Title'}
						</CardTitle>
						<div style={{ flexBasis: '30%' }}>
							{title === 'Project Details' ? (
								<BootstrapSwitchButton
									checked={true}
									onlabel="Activated"
									offlabel="Suspended"
									width={160}
									height={30}
									onstyle="success"
									// onChange={}
								/>
							) : (
								<button
									type="button"
									class="btn waves-effect waves-light btn-outline-info"
									style={{ borderRadius: '8px' }}
								>
									{button_name || 'button'}
								</button>
							)}
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flexBasis: '70%' }}>
							<p className="card-font-medium">{name_value || '0'}</p>
							<div className="sub-title">{name || 'No Label'}</div>
						</div>
						<div style={{ flexBasis: '30%' }}>
							<p className="card-font-bold">{total_value || '0'}</p>
							<div className="sub-title">{total || 'No Label'}</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
