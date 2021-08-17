import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';

import Balance from '../../ui_components/balance';
import DetailsCard from '../../global/DetailsCard';
import BeneficiaryInfo from './beneficiaryInfo';
import ProjectInvovled from '../../ui_components/projects';
import BreadCrumb from '../../ui_components/breadcrumb';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';

const BenefDetails = ({ params }) => {
	const { id } = params;
	const { getBeneficiaryDetails, getBeneficiaryBalance } = useContext(BeneficiaryContext);
	const { appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [extras, setExtras] = useState({});
	const [projectList, setProjectList] = useState([]);
	const [currentBalance, setCurrentBalance] = useState('');

	const [fetching, setFetching] = useState(false);

	const fetchCurrentBalance = useCallback(
		async phone => {
			const parsed_phone = parseInt(phone);
			const { rahat } = appSettings.agency.contracts;
			setFetching(true);
			const balance = await getBeneficiaryBalance(parsed_phone, rahat);
			setCurrentBalance(balance);
			setFetching(false);
		},
		[appSettings.agency.contracts, getBeneficiaryBalance]
	);

	const fetchBeneficiaryDetails = useCallback(async () => {
		const details = await getBeneficiaryDetails(id);
		await fetchCurrentBalance(details.phone);
		if (details && details.extras) setExtras(details.extras);
		setBasicInfo(details);
		const projects = details.projects.map(d => {
			return { id: d._id, name: d.name };
		});
		setProjectList(projects);
	}, [fetchCurrentBalance, getBeneficiaryDetails, id]);

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
					<Balance
						title="Balance"
						button_name="Issue Token"
						data={currentBalance}
						fetching={fetching}
						label="Current Balance"
					/>
				</Col>
			</Row>

			{basicInfo && <BeneficiaryInfo basicInfo={basicInfo} extras={extras} />}

			<ProjectInvovled projects={projectList} />
		</>
	);
};

export default BenefDetails;
