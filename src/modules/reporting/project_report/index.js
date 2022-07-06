import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label, FormGroup } from 'reactstrap';
import SelectWrapper from '../../global/SelectWrapper';
import { APP_CONSTANTS } from '../../../constants';

import { AidContext } from '../../../contexts/AidContext';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { VendorContext } from '../../../contexts/VendorContext';

import TokenChart from './budget/token_chart';
import BeneficiaryByProject from './beneficiary';
import PackageChart from './budget/package_chart';
import VendorChart from './vendor';
import BeneficiaryOnBoarded from './mobilizer/beneficiary_onboarded';
import TokenIssuedByMobilizer from './mobilizer/token_issued';
import BeneficiaryOnBoardedFromAidConnect from './aid_connect/index';

//TODO: project selector in the middle if project is not selected

const { PAGE_LIMIT } = APP_CONSTANTS;

const DUMMY_VENDOR_DATA = [
	{
		name: 'Token Used',
		count: 30
	},
	{
		name: 'Token Unused',
		count: 20
	},
	{
		name: 'Token Allocated',
		count: 50
	}
];

const DUMMY_BENEFICIARY_ONBOARDED_DATA = [
	{
		name: 'Total Beneficiary',
		count: 200
	}
];

const DUMMY_AID_CONNECT_DATA = [
	{
		name: 'Total beneficiary',
		count: 100
	}
];

const DUMMY_TOKEN_ISSUED_DATA = [
	{
		name: 'Token Used',
		count: 90
	},
	{
		name: 'Token Unused',
		count: 60
	},
	{
		name: 'Token Issued',
		count: 150
	}
];

const ProjectReport = () => {
	const { listAid, getProjectTokenBalance, getProjectPackageBalance } = useContext(AidContext);
	const {
		listBeneficiary,
		beneficiaryReport,
		getTotalBeneficairyTokenBalances,
		getTotalBeneficiaryPackages
	} = useContext(BeneficiaryContext);
	const { appSettings } = useContext(AppContext);
	const { getTotalVendorsBalances, getVendorDetails, listVendor } = useContext(VendorContext);

	const [exporting, setExporting] = useState(false);
	const [projectList, setProjectList] = useState([]);
	const [projectId, setProjectId] = useState(null);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});
	const [fetchingTokenData, setFetchingTokenData] = useState(false);
	const [fetchingPackageData, setFetchingPackageData] = useState(false);
	const [fetchingBeneficiaryData, setFetchingBeneficiaryData] = useState(false);
	const [fetchingVendorData, setFetchingVendorData] = useState(false);
	const [fetchingBeneficiaryOnBoardedData, setFetchingBeneficiaryOnBoardedData] = useState(false);
	const [fetchingTokenIssuedByMobilizerData, setFetchingTokenIssuedByMobilizerData] = useState(false);
	const [fetchingBeneficiaryOnBoardedFromAidConnectData, setFetchingBeneficiaryOnBoardedFromAidConnectData] = useState(
		false
	);

	const [projectBalance, setProjectBalance] = useState({
		projectCapital: 0,
		remainingBalance: 0,
		allocatedBudget: 0
	});

	const [projectPackageBalance, setProjectPackageBalance] = useState({
		projectPackageCapital: 0,
		remainingPackageBalance: 0,
		allocatedPackageBudget: 0
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

	const TOTAL_BENEFICIARY_TOKEN_BALANCE = [
		{
			name: 'Tokens Used',
			count: beneficiaryTokenBalance.totalUsedTokens
		},
		{
			name: 'Tokens Unused',
			count: beneficiaryTokenBalance.totalRemainingTokens
		},
		{
			name: 'Tokens Allocated',
			count: projectBalance.allocatedBudget
		}
	];

	const TOTAL_BENEFICIARY_PACKAGE_BALANCE = [
		{
			name: 'Total Package',
			count: projectPackageBalance.projectPackageCapital
		},
		{
			name: 'Remaining Package',
			count: projectPackageBalance.remainingPackageBalance
		},
		{
			name: 'Allocated Package',
			count: projectPackageBalance.allocatedPackageBudget
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
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const { contracts } = agency;
		if (projectId) {
			setFetchingTokenData(true);
			const projectTokenBalance = await getProjectTokenBalance(projectId, contracts.rahat_admin);
			const { projectCapital, remainingBalance, allocatedBudget } = projectTokenBalance;
			setProjectBalance(prevState => ({
				...prevState,
				projectCapital,
				remainingBalance,
				allocatedBudget
			}));
			setFetchingTokenData(false);
		}
	}, [projectId, getProjectTokenBalance, appSettings]);

	const fetchProjectPackageBalance = useCallback(async () => {
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const { contracts } = agency;
		if (!projectId) return;
		setFetchingPackageData(true);
		const projectPackageBalance = await getProjectPackageBalance(projectId, contracts.rahat_admin);
		const { projectPackageCapital, remainingPackageBalance, allocatedPackageBudget } = projectPackageBalance;
		setProjectPackageBalance(prevState => ({
			...prevState,
			projectPackageCapital,
			remainingPackageBalance,
			allocatedPackageBudget
		}));
		setFetchingPackageData(false);
	}, [projectId, getProjectPackageBalance, appSettings]);

	const fetchBeneficiaryList = useCallback(async () => {
		if (!projectId) return;
		const res = await listBeneficiary({ projectId });
		setBeneficiaries(res.data);
	}, [listBeneficiary, projectId]);

	const fetchTotalBeneficairyTokenBalances = useCallback(async () => {
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const { contracts } = agency;
		const totalBeneficairyTokenBalances = await getTotalBeneficairyTokenBalances(beneficiaries, contracts.rahat);
		const { totalRemainingTokens, totalTokenIssued, totalUsedTokens } = totalBeneficairyTokenBalances;
		setBeneficiaryTokenBalance(prevState => ({
			...prevState,
			totalRemainingTokens: totalRemainingTokens,
			totalTokenIssued: totalTokenIssued,
			totalUsedTokens: totalUsedTokens
		}));
	}, [getTotalBeneficairyTokenBalances, appSettings, beneficiaries]);

	// const fetchTotalBeneficiaryPackages = useCallback(async () => {
	// 	const { agency } = appSettings;
	// 	if (!agency || !agency.contracts) return;
	// 	const { contracts } = agency;
	// 	const totalBeneficiaryPackages = await getTotalBeneficiaryPackages(beneficiaries, contracts.rahat);
	// 	// const { totalRemainingPackageBalance, totalPackageBalance } = totalBeneficiaryPackages;
	// }, [getTotalBeneficiaryPackages, appSettings, beneficiaries]);

	const fetchBeneficiaryData = useCallback(async () => {
		setFetchingBeneficiaryData(true);
		if (projectId && formData.from && formData.to) {
			const fromDate = new Date(formData.from);
			const toDate = new Date(formData.to);

			const data = await beneficiaryReport({ projectId, from: fromDate, to: toDate });
			const { beneficiaryByGender, beneficiaryByProject, beneficiaryByAge } = data;
			setBeneficiaryData(prevState => ({
				...prevState,
				beneficiaryByGender: beneficiaryByGender.beneficiaries,
				beneficiaryByProject: beneficiaryByProject.project,
				beneficiaryByAge: beneficiaryByAge.beneficiaries
			}));
		}
		const data = await beneficiaryReport();
		const { beneficiaryByGender, beneficiaryByProject, beneficiaryByAge } = data;
		setBeneficiaryData(prevState => ({
			...prevState,
			beneficiaryByGender: beneficiaryByGender.beneficiaries,
			beneficiaryByProject: beneficiaryByProject.project,
			beneficiaryByAge: beneficiaryByAge.beneficiaries
		}));
		setFetchingBeneficiaryData(false);
	}, [beneficiaryReport, projectId, formData.from, formData.to]);

	const fetchVendorList = useCallback(async () => {
		const vendors = await listVendor({ start: 0, limit: PAGE_LIMIT });
		console.log({ vendors });
	}, [listVendor]);

	// const fetchTotalVendorsBalances = useCallback(async () => {
	// 	const { agency } = appSettings;
	// 	if (!agency || !agency.contracts) return;
	// 	const { rahat_erc20 } = agency.contracts;
	// 	const vendorTokenStatus = await getTotalVendorsBalances(rahat_erc20);
	// }, []);

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
		fetchVendorList();
	}, [fetchVendorList]);
	// useEffect(() => {
	// 	fetchTotalBeneficiaryPackages();
	// }, [fetchTotalBeneficiaryPackages]);

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
									{exporting ? (
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

							{!projectId ? (
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										marginTop: '30px',
										marginBottom: '20px',
										color: '#F7C087'
									}}
								>
									Please select project to get reports{' '}
								</span>
							) : (
								<div>
									<div className="mt-4">
										<h4>Budget</h4>
										<div className="row p-4">
											<div className="col-md-6 sm-12">
												<TokenChart data={TOTAL_BENEFICIARY_TOKEN_BALANCE} fetching={fetchingTokenData} />
											</div>
											<div className="col-md-6 sm-12">
												<PackageChart data={TOTAL_BENEFICIARY_PACKAGE_BALANCE} fetching={fetchingPackageData} />
											</div>
										</div>
									</div>
									<div className="mt-4">
										<h4>Beneficiaries</h4>
										<BeneficiaryByProject beneficiary={beneficiaryData} fetching={fetchingBeneficiaryData} />
									</div>
									<div className="mt-4">
										<h4>Vendors</h4>
										<div className="p-4">
											<VendorChart data={DUMMY_VENDOR_DATA} fetching={fetchingVendorData} />
										</div>
									</div>
									<div className="mt-4">
										<h4>Mobilizers</h4>
										<div className="row p-4">
											<div className="col-md-6 sm-12">
												<BeneficiaryOnBoarded
													data={DUMMY_BENEFICIARY_ONBOARDED_DATA}
													fetching={fetchingBeneficiaryOnBoardedData}
												/>
											</div>
											<div className="col-md-6 sm-12">
												<TokenIssuedByMobilizer
													data={DUMMY_TOKEN_ISSUED_DATA}
													fetching={fetchingTokenIssuedByMobilizerData}
												/>
											</div>
										</div>
									</div>
									<div className="mt-4">
										<h4>Aid connect</h4>
										<div className="p-4">
											<BeneficiaryOnBoardedFromAidConnect
												data={DUMMY_AID_CONNECT_DATA}
												fetching={fetchingBeneficiaryOnBoardedFromAidConnectData}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default ProjectReport;
