import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label, FormGroup } from 'reactstrap';
import SelectWrapper from '../../global/SelectWrapper';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../../constants';
import { AidContext } from '../../../contexts/AidContext';
import { UserContext } from '../../../contexts/UserContext';

import TokenChart from './budget/token_chart';

const ProjectReport = () => {
	const { addToast } = useToasts();
	const { listAid } = useContext(AidContext);
	const { getDashboardStats } = useContext(UserContext);

	const [importing, setImporting] = useState(false);
	const [projectList, setProjectList] = useState([]);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

	const [stats, setStats] = useState({
		totalProjects: 0,
		totalVendors: 0,
		totalBeneficiaries: 0,
		totalMobilizers: 0,
		totalAllocation: 0,
		redeemedTokens: 0,
		beneficiariesByProject: [],
		tokensByProject: [],
		totalInstitutions: 0
	});

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleProjectChange = () => {};
	const handleExportClick = () => {};

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

	const fetchDashboardStats = () => {
		getDashboardStats()
			.then(d => {
				// console.log({ d });
				const {
					projectCount,
					vendorCount,
					beneficiary,
					mobilizerCount,
					tokenAllocation,
					institutionCount,
					tokenRedemption
				} = d;

				setStats(prevState => ({
					...prevState,
					totalProjects: projectCount,
					totalVendors: vendorCount,
					totalBeneficiaries: beneficiary.totalCount,
					totalMobilizers: mobilizerCount,
					totalAllocation: tokenAllocation.totalAllocation,
					redeemedTokens: tokenRedemption.totalTokenRedemption,
					beneficiariesByProject: beneficiary.project,
					tokensByProject: tokenAllocation.projectAllocation,
					totalInstitutions: institutionCount
				}));
			})
			.catch(() => {
				addToast('Internal server error!', TOAST.ERROR);
			});
	};

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	useEffect(fetchDashboardStats, []);
	// console.log({ projectList });

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
											data={projectList}
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
							{/* <div className="p-4">
								<TokenChart data={''} />
							</div> */}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default ProjectReport;
