import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label, FormGroup, Row, Col } from 'reactstrap';
import SelectWrapper from '../../global/SelectWrapper';

const PROJECTLIST = ['Earthquake relief', 'Landslide relief', 'Flood relief'];

const ProjectReport = () => {
	const [importing, setImporting] = useState(false);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleProjectChange = () => {};
	const handleExportClick = () => {};

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
											data={PROJECTLIST}
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

							{/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<div className="d-flex align-items-center">
									
									
								</div>

								<div>
									
								</div>
							</div> */}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default ProjectReport;
