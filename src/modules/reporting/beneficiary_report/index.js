import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import { Button, Card, CardBody, CardTitle, Input, FormGroup, Label } from 'reactstrap';
import AgeBarDiagram from './age_bar_diagram';
import ProjectBarDiagram from './project_bar_diagram';
import GenderPieChart from './gender_pie_chart';
import GroupPieChart from './group_pie_chart';
import SelectWrapper from '../../global/SelectWrapper';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import {ExportToExcel} from "../../global/ExportToExcel";

const BeneficiaryReport = () => {
	const { beneficiaryReport, listProject } = useContext(BeneficiaryContext);

	const [projectId, setProjectId] = useState('');
	const [projectList, setProjectList] = useState([]);

	const [fetchingBeneficiaryData, setFetchingBeneficiaryData] = useState(false);

	const [exporting, setExporting] = useState(false);
	const [beneficiaryExportData, setBeneficiaryExportData] = useState(null);
    const ageBarRef = useRef(null);
	const genderPieRef = useRef(null);
	const groupPieRef = useRef(null);
	const projectBarRef = useRef(null);
	const downloadImage = useCallback(()=>{
		downloadProjectBar();
		downloadAgeBar();
		downloadGenderPie();
		downloadGroupPie();
	},[]);
	const downloadAgeBar=()=>{
		const link = document.createElement("a");
		link.download = "age_bar_diagram.png";
		link.href = ageBarRef.current.chartInstance.toBase64Image();
		link.click();
	}
	const downloadGenderPie=()=>{
		const link = document.createElement("a");
		link.download = "gender_pie_diagram.png";
		link.href = genderPieRef.current.chartInstance.toBase64Image();
		link.click();
	}
	const downloadGroupPie=()=>{
		const link = document.createElement("a");
		link.download = "group_pie_diagram.png";
		link.href = groupPieRef.current.chartInstance.toBase64Image();
		link.click();
	}
	const downloadProjectBar=()=>{
		const link = document.createElement("a");
		link.download = "project_bar_diagram.png";
		link.href = projectBarRef.current.chartInstance.toBase64Image();
		link.click();
	}

	const [beneficiaryData, setBeneficiaryData] = useState({
		beneficiaryByGender: [],
		beneficiaryByGroup: [],
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
			const { beneficiaryByGender, beneficiaryByGroup, beneficiaryByProject, beneficiaryByAge } = data;
			setBeneficiaryData(prevState => ({
				...prevState,
				beneficiaryByGender: beneficiaryByGender.beneficiaries,
				beneficiaryByGroup: beneficiaryByGroup.beneficiaries,
				beneficiaryByProject: beneficiaryByProject.project,
				beneficiaryByAge: beneficiaryByAge.beneficiaries
			}));
		}
		const data = await beneficiaryReport();
		const { beneficiaryByGender, beneficiaryByGroup, beneficiaryByProject, beneficiaryByAge, beneficiaryExportData } = data;
		setBeneficiaryData(prevState => ({
			...prevState,
			beneficiaryByGender: beneficiaryByGender.beneficiaries,
			beneficiaryByGroup: beneficiaryByGroup.beneficiaries,
			beneficiaryByProject: beneficiaryByProject.project,
			beneficiaryByAge: beneficiaryByAge.beneficiaries
		}));
		setFetchingBeneficiaryData(false);
		setBeneficiaryExportData(beneficiaryExportData);
	}, [beneficiaryReport, projectId, formData.from, formData.to]);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {
		downloadImage();

	};

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
										<a
											// type="button"
											onClick={handleExportClick}
											// className="btn"
											// color="info"
											// outline={true}
											style={{ borderRadius: '8px' }}
										>
											<ExportToExcel apiData={beneficiaryExportData} fileName="Beneficiaries-report.xlsx" />
										</a>
									)}
								</div>
							</div>
							<div className="p-4 mt-4">
								<ProjectBarDiagram projectBarRef={projectBarRef}  data={beneficiaryData.beneficiaryByProject} fetching={fetchingBeneficiaryData} />
							</div>
							<div className="p-4">
								<AgeBarDiagram data={beneficiaryData.beneficiaryByAge} fetching={fetchingBeneficiaryData} ageBarRef={ageBarRef} />
							</div>
							<div className="p-4">
								<GenderPieChart genderPieRef={genderPieRef} data={beneficiaryData.beneficiaryByGender} fetching={fetchingBeneficiaryData} />
							</div>
							<div className="p-4">
								<GroupPieChart groupPieRef={groupPieRef} data={beneficiaryData.beneficiaryByGroup} fetching={fetchingBeneficiaryData} />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BeneficiaryReport;
