import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, Input, FormGroup, Label } from 'reactstrap';
import AgeBarDiagram from './age_bar_diagram';
import ProjectBarDiagram from './project_bar_diagram';
import GenderPieChart from './gender_pie_chart';
import { useToasts } from 'react-toast-notifications';
import SelectWrapper from '../../global/SelectWrapper';
import { TOAST } from '../../../constants';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';

const BeneficiaryReport = () => {
	const { addToast } = useToasts();

	const { beneficiaryReport, listProject } = useContext(BeneficiaryContext);

	// const [projectId, setProjectId] = useState('');
	// const [projects, setProjects] = useState();
	const [projectList, setProjectList] = useState([]);

	const [importing, setImporting] = useState(false);

	const [beneficiaryData, setBeneficiaryData] = useState({
		beneficiaryByGender: [],
		beneficiaryByProject: [],
		beneficiaryByAge: []
	});

	const fetchBeneficiaryData = () => {
		beneficiaryReport()
			.then(data => {
				const { beneficiaryByGender, beneficiaryByProject, beneficiaryByAge } = data;
				setBeneficiaryData({
					beneficiaryByGender: beneficiaryByGender.beneficiaries,
					beneficiaryByProject: beneficiaryByProject.project,
					beneficiaryByAge: beneficiaryByAge.beneficiaries
				});
			})
			.catch(() => {
				addToast('Internal server error!', TOAST.ERROR);
			});
	};

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

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
		// setProjects(project);
	}, [listProject]);

	const handleProjectChange = data => {
		const values = data.value.toString();
		// setProjectId(values);
	};

	useEffect(fetchBeneficiaryData, []);
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
								<ProjectBarDiagram data={beneficiaryData.beneficiaryByProject} />
							</div>
							<div className="p-4">
								<AgeBarDiagram data={beneficiaryData.beneficiaryByAge} />
							</div>
							<div className="p-4">
								<GenderPieChart data={beneficiaryData.beneficiaryByGender} />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BeneficiaryReport;
