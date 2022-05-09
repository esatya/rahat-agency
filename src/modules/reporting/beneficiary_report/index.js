import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, Input, FormGroup, Label } from 'reactstrap';
import AgeBarDiagram from './age_bar_diagram';
import ProjectBarDiagram from './project_bar_diagram';
import GenderPieChart from './gender_pie_chart';
import SelectWrapper from '../../global/SelectWrapper';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';

const BeneficiaryReport = () => {
	const { beneficiaryReport, listProject } = useContext(BeneficiaryContext);

	const [projectId, setProjectId] = useState('');
	const [projectList, setProjectList] = useState([]);

	const [fetchingBeneficiaryData, setFetchingBeneficiaryData] = useState(false);

	const [exporting, setExporting] = useState(false);

	const [beneficiaryData, setBeneficiaryData] = useState({
		beneficiaryByGender: [],
		beneficiaryByProject: [],
		beneficiaryByAge: []
	});
	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

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

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {};

	const loadProjects = useCallback(async () => {
		const project = await listProject();
		if (project && project.data.length) {
			const select_options = project.data.map(p => {
				return {
					label: p.name,
					value: p._id
				};
			});
			setProjectList(select_options);
		}
	}, [listProject]);

	const handleProjectChange = data => {
		const values = data.value.toString();
		setProjectId(values);
	};

	useEffect(() => {
		fetchBeneficiaryData();
	}, [fetchBeneficiaryData]);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

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
								<ProjectBarDiagram data={beneficiaryData.beneficiaryByProject} fetching={fetchingBeneficiaryData} />
							</div>
							<div className="p-4">
								<AgeBarDiagram data={beneficiaryData.beneficiaryByAge} fetching={fetchingBeneficiaryData} />
							</div>
							<div className="p-4">
								<GenderPieChart data={beneficiaryData.beneficiaryByGender} fetching={fetchingBeneficiaryData} />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BeneficiaryReport;
