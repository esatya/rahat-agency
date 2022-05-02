import React, { useState ,useContext,useEffect,useCallback} from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import ProjectBarDiagram from './project_bar_diagram';
import TokenChart from './token_pie_chart';
import PackageChart from './package_pie_chart';
import { VendorContext } from '../../../contexts/VendorContext';
const DUMMY_TOKEN_DATA = [
	{ count: 100, name: 'Total token', id: '1' },
	{ count: 80, name: 'Redeemed token', id: '2' }
];
const DUMMY_PACKAGE_DATA = [
	{ count: 100, name: 'Total package', id: '4' },
	{ count: 30, name: 'Redeemed package', id: '5' }
];
const VendorReport = () => {
	const {getVendorReport} = useContext(VendorContext);
	const [importing, setImporting] = useState(false);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});
	const [vendorData, setVendorData] = useState({
		vendorByProject: [],
	});

	const fetchVendorData = useCallback(async() => {
		const {vendorByProject} = await getVendorReport();
		setVendorData({vendorByProject:vendorByProject.project})
	},[getVendorReport])

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {};

	useEffect(() => {
		fetchVendorData();
	}, [fetchVendorData]);

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
									<div className="d-flex flex-wrap align-items-center">
										<div className="d-flex align-items-center">
											<Label className="mr-3">From:</Label>
											<Input className="mr-3" name="from" type="date" onChange={handleInputChange} />
										</div>
										<div className="d-flex align-items-center">
											<Label className="mr-3">To:</Label>
											<Input type="date" name="to" onChange={handleInputChange} />
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
							<div className="p-4 mt-4">
								<ProjectBarDiagram data={vendorData.vendorByProject} dataLabel="Project" />
							</div>
							<div className="p-4">
								<div className="row">
									<div className="col-md-6 sm-12">
										<TokenChart data={DUMMY_TOKEN_DATA} />
									</div>
									<div className="col-md-6 sm-12">
										<PackageChart data={DUMMY_PACKAGE_DATA} />
									</div>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default VendorReport;
