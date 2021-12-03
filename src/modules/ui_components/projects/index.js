import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import '../../../assets/css/project.css';

export default function ProjectsInvolved(props) {
	const { projects, showAddBtn, handleAddBtnClick } = props;
	const history = useHistory();

	const handleProjectClick = projectId => {
		history.push(`/projects/${projectId}`);
	};

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title" style={{ flexBasis: '90%' }}>
						Projects Involved &nbsp;
						{showAddBtn && (
							<a href="#add_project" onClick={handleAddBtnClick} title="Add project">
								<i className="fas fa-plus"></i>
							</a>
						)}
					</CardTitle>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flexBasis: '50%' }}>
							<div>
								{projects && projects.length > 0 ? (
									projects.map(project => (
										<button
											key={project.id}
											onClick={() => handleProjectClick(project.id)}
											type="button"
											className="btn waves-effect waves-light btn-outline-info"
											style={{ borderRadius: '8px', marginRight: '15px', marginBottom: '10px' }}
										>
											{project.name || 'No data'}
										</button>
									))
								) : (
									<p style={{ color: '#2B7EC1' }}>No projects available</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
