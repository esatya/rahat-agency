import React, { useState,useContext,useEffect,useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import { MobilizerContext } from '../../../contexts/MobilizerContext';
import ProjectBarDiagram from './project_bar_diagram';

const MobilizerReport = () => {
	const {getMobilizerReport} = useContext(MobilizerContext);
	const [importing, setImporting] = useState(false);
	const [mobilizerData, setMobilizerData] = useState({
		mobilizerByProject: [],
	});
	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});
	const fetchMobilizerData = useCallback(async() => {
		const {mobilizerByProject} = await getMobilizerReport();
		setMobilizerData({mobilizerByProject:mobilizerByProject.project})
	},[getMobilizerReport])

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {};

	useEffect(() => {
		fetchMobilizerData();
	}, [fetchMobilizerData]);

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
								<ProjectBarDiagram data={mobilizerData.mobilizerByProject} dataLabel="Project" />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default MobilizerReport;
