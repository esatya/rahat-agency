import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label, FormGroup } from 'reactstrap';
import SelectWrapper from '../../global/SelectWrapper';
import { AidContext } from '../../../contexts/AidContext';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import { AppContext } from '../../../contexts/AppSettingsContext';

import BudgetChart from './budget/budget_chart';
import TokenChart from './budget/token_chart';
import BeneficiaryByProject from './beneficiary';

const ProjectReport = () => {
	const { listAid, getProjectTokenBalance, getProjectPackageBalance } = useContext(AidContext);
	const {
		listBeneficiary,
		beneficiaryReport,
		getTotalBeneficairyTokenBalances,
		getTotalBeneficiaryPackages
	} = useContext(BeneficiaryContext);
	const { appSettings } = useContext(AppContext);

	const [importing, setImporting] = useState(false);
	const [projectList, setProjectList] = useState([]);
	const [projectId, setProjectId] = useState('');

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

	const [projectBalance, setProjectBalance] = useState({
		projectCapital: 0,
		remainingBalance: 0
	});

	const [beneficiaryTokenBalance, setBeneficiaryTokenBalance] = useState({
		totalRemainingTokens: 0,
		totalTokenIssued: 0,
		totalUsedTokens: 0
	});

	const [beneficiaryData, setBeneficiaryData] = useState({
		beneficiaryByGender: [],
		beneficiaryByProject: [],
		beneficiaryByAge: []
	});
	const [beneficiaries, setBeneficiaries] = useState([]);

	const TOTAL_BUDGET = [
		{
			name: 'Total Budget',
			count: projectBalance.projectCapital
		},
		{
			name: 'Remaining Budget',
			count: projectBalance.remainingBalance
		}
	];

	const TOTAL_BENEFICIARY_TOKEN_BALANCE = [
		{
			name: 'Tokens Used',
			count: beneficiaryTokenBalance.totalUsedTokens
		},
		{
			name: 'Tokens Remaining',
			count: beneficiaryTokenBalance.totalRemainingTokens
		}
	];

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleProjectChange = data => {
		const values = data.value.toString();
		setProjectId(values);
	};

	const loadProjects = useCallback(async () => {
		const project = await listAid();
		if (project && project.data.length) {
			const select_options = project.data.map(p => {
				return {
					label: p.name,
					value: p._id
				};
			});
			setProjectList(select_options);
		}
	}, [listAid]);

	const fetchProjectTokenBalance = useCallback(async () => {
		const { contracts } = appSettings.agency;
		if (projectId) {
			const projectTokenBalance = await getProjectTokenBalance(projectId, contracts.rahat);
			const { projectCapital, remainingBalance } = projectTokenBalance;
			setProjectBalance(prevState => ({
				...prevState,
				projectCapital: projectCapital,
				remainingBalance: remainingBalance
			}));
		}
	}, [projectId, getProjectTokenBalance, appSettings.agency]);

	const fetchProjectPackageBalance = useCallback(async () => {
		const { contracts } = appSettings.agency;
		if (projectId) {
			const projectPackageBalance = await getProjectPackageBalance(projectId, contracts.rahat);
			console.log({ projectPackageBalance });
		}
	}, [projectId, getProjectPackageBalance, appSettings.agency]);

	const fetchBeneficiaryList = useCallback(async () => {
		const res = await listBeneficiary();
		setBeneficiaries(res.data);
	}, [listBeneficiary]);

	const fetchTotalBeneficairyTokenBalances = useCallback(async () => {
		const { contracts } = appSettings.agency;
		const totalBeneficairyTokenBalances = await getTotalBeneficairyTokenBalances(beneficiaries, contracts.rahat);
		const { totalRemainingTokens, totalTokenIssued, totalUsedTokens } = totalBeneficairyTokenBalances;
		setBeneficiaryTokenBalance(prevState => ({
			...prevState,
			totalRemainingTokens: totalRemainingTokens,
			totalTokenIssued: totalTokenIssued,
			totalUsedTokens: totalUsedTokens
		}));
	}, [getTotalBeneficairyTokenBalances, appSettings.agency, beneficiaries]);

	const fetchTotalBeneficiaryPackages = useCallback(async () => {
		const { contracts } = appSettings.agency;
		const totalBeneficiaryPackages = await getTotalBeneficiaryPackages(beneficiaries, contracts.rahat);
		// const { totalRemainingPackageBalance, totalPackageBalance } = totalBeneficiaryPackages;
		console.log({ totalBeneficiaryPackages });
	}, [getTotalBeneficiaryPackages, appSettings.agency, beneficiaries]);

	const fetchBeneficiaryData = useCallback(async () => {
		if (projectId) {
			const data = await beneficiaryReport({ projectId });
			const { beneficiaryByGender, beneficiaryByProject, beneficiaryByAge } = data;
			setBeneficiaryData({
				beneficiaryByGender: beneficiaryByGender.beneficiaries,
				beneficiaryByProject: beneficiaryByProject.project,
				beneficiaryByAge: beneficiaryByAge.beneficiaries
			});
		}
	}, [beneficiaryReport, projectId]);

	const handleExportClick = () => {};

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	useEffect(() => {
		fetchBeneficiaryList();
	}, [fetchBeneficiaryList]);

	useEffect(() => {
		fetchBeneficiaryData();
	}, [fetchBeneficiaryData]);

	useEffect(() => {
		fetchProjectTokenBalance();
	}, [fetchProjectTokenBalance]);

	useEffect(() => {
		fetchProjectPackageBalance();
	}, [fetchProjectPackageBalance]);

	useEffect(() => {
		fetchTotalBeneficairyTokenBalances();
	}, [fetchTotalBeneficairyTokenBalances]);

	useEffect(() => {
		fetchTotalBeneficiaryPackages();
	}, [fetchTotalBeneficiaryPackages]);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Project report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3 mb-0">
							<div className="row">
								<div className="col-md-4 sm-12">
									<FormGroup>
										<SelectWrapper
											multi={false}
											onChange={handleProjectChange}
											maxMenuHeight={150}
											data={projectList}
											placeholder="--Select Project--"
										/>
									</FormGroup>
								</div>
								<div className="col-md-6 sm-12">
									<div className="d-flex flex-wrap align-items-center">
										<div className="d-flex flex-wrap align-items-center">
											<Label className="mr-2">From:</Label>
											<Input
												className="mr-2"
												name="from"
												type="date"
												onChange={handleInputChange}
												style={{ width: '180px' }}
											/>
										</div>
										<div className="d-flex flex-wrap align-items-center">
											<Label className="mr-2">To:</Label>
											<Input type="date" name="to" onChange={handleInputChange} style={{ width: '180px' }} />
										</div>
									</div>
								</div>
								<div className="col-md-2 sm-12">
									{importing ? (
										<Button type="button" disabled={true} className="btn" color="info">
											Exporting...
										</Button>
									) : (
										<Button
											type="button"
											onClick={handleExportClick}
											className="btn"
											color="info"
											outline={true}
											style={{ borderRadius: '8px' }}
										>
											Export
										</Button>
									)}
								</div>
							</div>
							<div className="row p-4">
								<div className="col-md-8 sm-12">
									<BudgetChart data={TOTAL_BUDGET} />
								</div>
								<div className="col-md-4 sm-12">
									<TokenChart data={TOTAL_BENEFICIARY_TOKEN_BALANCE} />
								</div>
							</div>
							<div>
								<BeneficiaryByProject beneficiary={beneficiaryData} />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default ProjectReport;
