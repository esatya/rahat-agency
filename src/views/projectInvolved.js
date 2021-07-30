import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import './project.css';

export default function ProjectInvovled(props) {
	const { projects } = props;
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title" style={{ flexBasis: '90%' }}>
						Projects Involved
					</CardTitle>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flexBasis: '50%' }}>
							<div>
								{projects ? (
									projects.map(project => (
										<button
											key={project.id}
											type="button"
											className="btn waves-effect waves-light btn-outline-info"
											style={{ borderRadius: '8px', marginRight: '15px', marginBottom: '10px' }}
										>
											{project.name || 'button'}
										</button>
									))
								) : (
									<p style={{ color: '#2B7EC1' }}>No projects involved</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
