import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import '../../../assets/css/project.css';
import IdImgPlaceholder from '../../../assets/images/id-icon-1.png';
import { formatWord } from '../../../utils';
import { History } from '../../../utils/History';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function BeneficiaryInfo({ basicInfo, extras }) {
	const handleEditClick = () => History.push(`/edit-beneficiary/${basicInfo._id}`);

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title" style={{ flexBasis: '90%' }}>
							More Information
						</CardTitle>
						<div style={{ flexBasis: '10%' }}>
							<button
								type="button"
								onClick={handleEditClick}
								className="btn waves-effect waves-light btn-info"
								style={{ borderRadius: '8px' }}
							>
								Edit
							</button>
						</div>
					</div>
					<Row>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.address || '-'}</p>
								<div className="sub-title">Address</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.govt_id || '-'}</p>
								<div className="sub-title">Government ID number</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.group ? formatWord(extras.group) : '-'}</p>
								<div className="sub-title">Group</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.adult ? extras.adult : '-'}</p>
								<div className="sub-title">Number of family member (Adult)</div>
							</div>
						</Col>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.education ? extras.education : '-'}</p>
								<div className="sub-title">Education</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.gender || '-'}</p>
								<div className="sub-title">Gender</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.age ? extras.age : '-'}</p>
								<div className="sub-title">Age</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.child ? extras.child : '-'}</p>
								<div className="sub-title">Number of family member(Child)</div>
							</div>
						</Col>
						<Col>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.profession ? extras.profession : '-'}</p>
								<div className="sub-title">Profession</div>
							</div>
							<img
								src={basicInfo.govt_id_image ? `${IPFS_GATEWAY}/ipfs/${basicInfo.govt_id_image}` : IdImgPlaceholder}
								alt="certificate"
								width="90%"
								height="60%"
								className="card-data"
							/>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
