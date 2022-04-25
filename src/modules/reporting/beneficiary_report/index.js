import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import AgeBarDiagram from './age_bar_diagram';
import ProjectBarDiagram from './project_bar_diagram';
import GenderPieChart from './gender_pie_chart';

const DUMMY_GENDER_DATA = [
	{ count: 20, name: 'Male', id: '1' },
	{ count: 21, name: 'Female', id: '2' },
	{ count: 10, name: 'Other', id: '3' },
	{ count: 5, name: 'Unknown', id: '4' }
];

const BeneficiaryReport = () => {
	const [importing, setImporting] = useState(false);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {};

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Beneficiary report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3">
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
								<ProjectBarDiagram data={''} dataLabel="Project" />
							</div>
							<div className="p-4">
								<AgeBarDiagram data={''} dataLabel="Age" />
							</div>
							<div className="p-4">
								<GenderPieChart data={DUMMY_GENDER_DATA} />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BeneficiaryReport;
