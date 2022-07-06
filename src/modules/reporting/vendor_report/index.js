import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, FormGroup } from 'reactstrap';

import ProjectBarDiagram from './project_bar_diagram';
import TokenChart from './token_pie_chart';
import PackageChart from './package_pie_chart';
import { VendorContext } from '../../../contexts/VendorContext';
import SelectWrapper from '../../global/SelectWrapper';

const DUMMY_TOKEN_DATA = [
	{ count: 100, name: 'Total token', id: '1' },
	{ count: 80, name: 'Redeemed token', id: '2' }
];
const DUMMY_PACKAGE_DATA = [
	{ count: 100, name: 'Total package', id: '4' },
	{ count: 30, name: 'Redeemed package', id: '5' }
];
const VendorReport = () => {
	const { getVendorReport, listAid } = useContext(VendorContext);

	const [exporting, setExporting] = useState(false);
	const [projectId, setProjectId] = useState('');
	const [projectList, setProjectList] = useState([]);

	const [fetchingVendorData, setFetchingVendorData] = useState(false);

	const [vendorData, setVendorData] = useState({
		vendorByProject: []
	});

	const fetchVendorData = useCallback(async () => {
		setFetchingVendorData(true);
		const { vendorByProject } = await getVendorReport();
		setVendorData({ vendorByProject: vendorByProject.project });
		setFetchingVendorData(false);
	}, [getVendorReport]);

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
		fetchVendorData();
	}, [fetchVendorData]);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Vendor report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3 mb-0">
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
										<TokenChart data={DUMMY_TOKEN_DATA} fetching={fetchingVendorData} />
									</div>
									<div className="col-md-6 sm-12">
										<PackageChart data={DUMMY_PACKAGE_DATA} fetching={fetchingVendorData} />
									</div>
								</div>
							</div>
							<div className="p-4">
								<ProjectBarDiagram
									data={vendorData.vendorByProject}
									dataLabel="Project"
									fetching={fetchingVendorData}
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default VendorReport;
