import React from 'react';
import moment from 'moment';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import ReactDOM from 'react-dom';

import { History } from '../../../utils/History';
import '../../../assets/css/project.css';
import qrGenerator from './qrGenerator';

export default function ProjectInfo({ projectDetails }) {
	const { _id, social_mobilizer, project_manager, location, description, created_at } = projectDetails;

	const handleEditClick = () => History.push(`/edit-project/${_id}`);

	const printQr = async(data) =>{
		console.log("generating")
		ReactDOM.createPortal(qrGenerator,	document.getElementById('root'))
const qrs= await qrGenerator({min:1,max:3,projectVersion:1,amount:10})

// console.log({qrs});
//var doc = new jsPDF();


var newWindow = window.open("", "newWindow", "width=800, height=600");
console.log({newWindow})
if(newWindow) newWindow.document.write(qrs);
// document.write(qrs);
// document.close();
// setTimeout(function () {
// 	newWindow.print();
// 	newWindow.close();
// }, 250);
	}

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 330 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
						</Col>
						<Col>

						<div style={{ flex: 1, padding: 2,float:'right' }}>
						<button
							onClick={printQr}
							type="button"
							class="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px', marginRight: '20px' }}
						>
							Pre-Generate Qr code
						</button>
						<button
								type="button"
								onClick={handleEditClick}
								className="btn waves-effect waves-light btn-info"
								style={{ borderRadius: '8px' }}
							>
								Edit
							</button>
					</div>

						</Col>
					</Row>
					<Row>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">
									{project_manager ? `${project_manager.name.first} ${project_manager.name.last}` : '-'}
								</p>
								<div className="sub-title">Project Manager</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{location || '-'}</p>
								<div className="sub-title">Location</div>
							</div>
						</Col>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{social_mobilizer || '-'}</p>
								<div className="sub-title">Social Mobilizer</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{moment(created_at).format('ll')}</p>
								<div className="sub-title">Created Date</div>
							</div>
						</Col>
					</Row>

					<p className="sub-title" style={{ textAlign: 'justify' }}>
						{description || 'Project description not available...'}
					</p>
				</div>
			</Card>
		</div>
	);
}
