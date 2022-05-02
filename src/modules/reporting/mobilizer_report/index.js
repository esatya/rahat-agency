import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, FormGroup } from 'reactstrap';

import { MobilizerContext } from '../../../contexts/MobilizerContext';
import ProjectBarDiagram from './project_bar_diagram';
import SelectWrapper from '../../global/SelectWrapper';
import TokenChart from './token_pie_chart';
import PackageChart from './package_pie_chart';

const DUMMY_TOKEN_DATA = [
	{ count: 100, name: 'Total token', id: '1' },
	{ count: 80, name: 'Redeemed token', id: '2' }
];
const DUMMY_PACKAGE_DATA = [
	{ count: 100, name: 'Total package', id: '4' },
	{ count: 30, name: 'Redeemed package', id: '5' }
];

const MobilizerReport = () => {
	const { getMobilizerReport, listAid } = useContext(MobilizerContext);

	const [exporting, setExporting] = useState(false);
	const [mobilizerData, setMobilizerData] = useState({
		mobilizerByProject: []
	});
	const [fetchingMobilizerData, setFetchingMobilizerData] = useState(false);

	const [projectId, setProjectId] = useState('');
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
										<TokenChart data={DUMMY_TOKEN_DATA} fetching={fetchingMobilizerData} />
									</div>
									<div className="col-md-6 sm-12">
										<PackageChart data={DUMMY_PACKAGE_DATA} fetching={fetchingMobilizerData} />
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
