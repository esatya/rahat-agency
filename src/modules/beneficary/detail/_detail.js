import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';

import Balance from '../../ui_components/balance';
import DetailsCard from '../../global/DetailsCard';
import BeneficiaryInfo from './beneficiaryInfo';
import ProjectInvovled from '../../ui_components/projects';
import BreadCrumb from '../../ui_components/breadcrumb';

import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';

const BenefDetails = ({ params }) => {
	const { id } = params;
	const { getBeneficiaryDetails } = useContext(BeneficiaryContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [extras, setExtras] = useState({});
	const [projectList, setProjectList] = useState([]);

	const fetchBeneficiaryDetails = useCallback(async () => {
		const details = await getBeneficiaryDetails(id);
		if (details && details.extras) setExtras(details.extras);
		setBasicInfo(details);
		const projects = details.projects.map(d => {
			return { id: d._id, name: d.name };
		});
		setProjectList(projects);
	}, [getBeneficiaryDetails, id]);

	useEffect(() => {
		fetchBeneficiaryDetails();
	}, [fetchBeneficiaryDetails]);

	return (
		<>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Details" />
			<Row>
				<Col md="7">
					<DetailsCard
						title="Beneficiary Details"
						button_name="Generate QR Code"
						name="Name"
						name_value={basicInfo.name ? basicInfo.name : ''}
						total="Total Issued"
						total_value="1,500"
					/>
				</Col>
				<Col md="5">
					<Balance title="Balance" button_name="Issue Token" data="500" label="Current Balance" />
				</Col>
			</Row>

			{basicInfo && <BeneficiaryInfo basicInfo={basicInfo} extras={extras} />}

			<ProjectInvovled projects={projectList} />
		</>
	);
};

export default BenefDetails;
