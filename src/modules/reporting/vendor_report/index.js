import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Button, Card, CardBody, CardTitle, FormGroup } from 'reactstrap';

import ProjectBarDiagram from './project_bar_diagram';
import TokenChart from './token_pie_chart';
import PackageChart from './package_pie_chart';
import { VendorContext } from '../../../contexts/VendorContext';
import SelectWrapper from '../../global/SelectWrapper';
import { ExportToExcel } from "../../global/ExportToExcel";

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
	const [vendorExportData, setVendorExportData] = useState(null);

	const [vendorData, setVendorData] = useState({
		vendorByProject: []
	});

	const vendorPackagePieRef = useRef(null);
	const vendorProjectBarRef = useRef(null);
	const vendorTokenPieRef = useRef(null);

	const downloadImage = useCallback(() => {
		downloadProjectBar();
		downloadPackagePie();
		downloadTokenPie();
	}, []);

	const downloadPackagePie = () => {
		const link = document.createElement("a");
		link.download = "vendor_pie__diagram.png";
		link.href = vendorPackagePieRef.current.chartInstance.toBase64Image();
		link.click();
	}
	const downloadProjectBar = () => {
		const link = document.createElement("a");
		link.download = "vendor_pie_diagram.png";
		link.href = vendorProjectBarRef.current.chartInstance.toBase64Image();
		link.click();
	}
	const downloadTokenPie = () => {
		const link = document.createElement("a");
		link.download = "vendor_bar_diagram.png";
		link.href = vendorTokenPieRef.current.chartInstance.toBase64Image();
		link.click();
	}

	const fetchVendorData = useCallback(async () => {
		setFetchingVendorData(true);
		const { vendorByProject, vendorExportData } = await getVendorReport();
		setVendorData({ vendorByProject: vendorByProject.project });
		setFetchingVendorData(false);
		setVendorExportData(vendorExportData);
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

	const handleExportClick = () => {
		downloadImage();
	};

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
						<span>Vendor Report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3 mb-0">
							<div className="row">
								{/*  */}

								<div className="col-md-2 sm-12">
									{exporting ? (
										<Button type="button" disabled={true} className="btn" color="info">
											Exporting...
										</Button>
									) : (
										<a
											onClick={handleExportClick}
											className="btn"
											color="info"
											style={{ borderRadius: '8px' }}
										>
											<ExportToExcel apiData={vendorExportData} fileName="Vendors-report.xlsx" />

										</a>
									)}
								</div>
							</div>
							{/* <div className="p-4 mt-4">
								<div className="row">
									<div className="col-md-6 sm-12">
										<TokenChart vendorTokenPieRef={vendorTokenPieRef} data={DUMMY_TOKEN_DATA} fetching={fetchingVendorData} />
									</div>
									<div className="col-md-6 sm-12">
										<PackageChart data={DUMMY_PACKAGE_DATA} fetching={fetchingVendorData} vendorPackagePieRef={vendorPackagePieRef} />
									</div>
								</div>
							</div> */}
							<div className="p-4">
								<ProjectBarDiagram
									vendorProjectBarRef={vendorProjectBarRef}
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
