import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, FormGroup } from 'reactstrap';

import { MobilizerContext } from '../../../contexts/MobilizerContext';
import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import ProjectBarDiagram from './project_bar_diagram';
import SelectWrapper from '../../global/SelectWrapper';
import TokenChart from './token_pie_chart';
import PackageChart from './package_pie_chart';

// const DUMMY_TOKEN_DATA = [
// 	{ count: 100, name: 'Total token', id: '1' },
// 	{ count: 80, name: 'Redeemed token', id: '2' }
// ];
// const DUMMY_PACKAGE_DATA = [
// 	{ count: 100, name: 'Total package', id: '4' },
// 	{ count: 30, name: 'Redeemed package', id: '5' }
// ];

const MobilizerReport = () => {
	const { appSettings } = useContext(AppContext);
	const [importing, setImporting] = useState(false);

	const [mobilizerTokens,setMobilizerTokens] = useState({})
	const [mobilizerPackages,setMobilizerPackages] = useState({})
	const { getMobilizerReport,getTotalMobilizerIssuedTokens, getMobilizerIssuedPackages,listMobilizer, listAid } = useContext(MobilizerContext);
	const {getProjectPackageBalance} = useContext(AidContext);
	const [exporting, setExporting] = useState(false);
	const [mobilizerData, setMobilizerData] = useState({
		mobilizerByProject: []
	});
	const [fetchingMobilizerData, setFetchingMobilizerData] = useState(false);

	const [projectId, setProjectId] = useState(null);
	const [projectList, setProjectList] = useState([]);

	const fetchMobilizerData = useCallback(async () => {
		setFetchingMobilizerData(true);
		const { mobilizerByProject } = await getMobilizerReport();
		setMobilizerData({ mobilizerByProject: mobilizerByProject.project });
		setFetchingMobilizerData(false);
	}, [getMobilizerReport]);

	const handleProjectChange = data => {
		const values = data.value.toString();
		setProjectId(values);
	};

	

	const fetchMobilizers= useCallback(async ()=>{
		const mobilizers = await listMobilizer({projectId});
		return mobilizers;
	},[listMobilizer,projectId])

	const fetchMobilizerIssuedTokens = useCallback(async()=>{
		if(!projectId) return;
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const { contracts } = agency;
		const {data} = await fetchMobilizers();
		const mobilizers = data.map((el) => el.wallet_address);
		const mobilizerIssuedTokens = await getTotalMobilizerIssuedTokens(contracts.rahat,mobilizers,projectId);
		setMobilizerTokens([{name:'Total Tokens',count:mobilizerIssuedTokens.totalTokens},
							{name:'Mobilizer Issued Tokens',count:mobilizerIssuedTokens.totalMobilizerIssuedTokens
						}]);
	},[appSettings,fetchMobilizers,getTotalMobilizerIssuedTokens,projectId])

	const fetchMobilizerIssuedPackages = useCallback(async()=>{
		if(!projectId) return;
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const { contracts } = agency;
		const {data} = await fetchMobilizers();
		const mobilizers = data.map((el) => el.wallet_address);
		const totalPackage = await getProjectPackageBalance(projectId,contracts.rahat_admin);
		const issuedPackages = await getMobilizerIssuedPackages(contracts.rahat,mobilizers);
		const totalIssuesPackages = issuedPackages.reduce((prev,curr)=>prev+curr.grandTotal,0);
		setMobilizerPackages([{name:'Total Package',count:totalPackage.projectPackageCapital},
							{name:'Mobilizer Issued Tokens',count:totalIssuesPackages
						}])
	},[appSettings,fetchMobilizers,getMobilizerIssuedPackages,projectId,getProjectPackageBalance])


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
		// setProjects(project);
	}, [listAid]);

	const handleExportClick = () => {};

	useEffect(() => {
		fetchMobilizerData();
	}, [fetchMobilizerData]);
	useEffect(() => {
		fetchMobilizerIssuedTokens();
	}, [fetchMobilizerIssuedTokens]);

	useEffect(()=>{fetchMobilizerIssuedPackages()},[fetchMobilizerIssuedPackages])

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Mobilizer report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3">
							<div className="row">
								<div className="col-md-10 sm-12">
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
							<div className="p-4 mt-4">
								<div className="row">
									<div className="col-md-6 sm-12">
										<TokenChart data={mobilizerTokens} fetching={fetchingMobilizerData} projectId={projectId} />
									</div>
									<div className="col-md-6 sm-12">
										<PackageChart data={mobilizerPackages} fetching={fetchingMobilizerData} projectId={projectId}/>
									</div>
								</div>
							</div>
							<div className="p-4">
								<ProjectBarDiagram
									data={mobilizerData.mobilizerByProject}
									fetching={fetchingMobilizerData}
									dataLabel="Project"
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default MobilizerReport;
