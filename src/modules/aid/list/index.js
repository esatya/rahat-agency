import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Button, Card, CardBody, CardTitle, FormGroup, Label, Input, InputGroup, Table, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { AidContext } from '../../../contexts/AidContext';
import AidModal from '../../global/CustomModal';
import { History } from '../../../utils/History';
import AdvancePagination from '../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../constants';
import { dottedString } from '../../../utils';
import MiniSpinner from '../../global/MiniSpinner';


const { PAGE_LIMIT } = APP_CONSTANTS;

const List = () => {
	const {
		listAid,
		addAid,
		getProjectsBalances
	} = useContext(AidContext);
	const { appSettings } = useContext(AppContext);
	const { addToast } = useToasts();
	const [aidModal, setaidModal] = useState(false);
	const [aidPayload, setaidPayload] = useState({ name: '' });

	const [searchName, setSearchName] = useState('');
	const [projectStatus, setProjectStatus] = useState('');

	const [totalRecords, setTotalRecords] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [fetchingPackageBalances, setFetchingPackageBalances] = useState(true);
	const [projectList,setProjectList] = useState([]);
	const [tokenBalances,setTokenBalances] = useState(0);
	const [packageBalances,setPackageBalances] = useState(0);


	const toggleModal = () => {
		setaidModal(!aidModal);
	};

	const handleAddProjectClick = () => History.push('/add-project');

	const handleProjectStatusChange = e => {
		const query = {};
		const { value } = e.target;
		if (value) query.status = value;
		setProjectStatus(value);
		loadAidList(query);
	};

	const handleInputChange = e => {
		setaidPayload({ ...aidPayload, [e.target.name]: e.target.value });
	};

	const handleSearchInputChange = e => {
		const query = {};
		const { value } = e.target;
		if (value) query.name = value;
		setSearchName(value);
		loadAidList(query);
	};

	const handleAidSubmit = async e => {
		e.preventDefault();
		try {
			await addAid(aidPayload);
			toggleModal();
			addToast('Project created successfully.', {
				appearance: 'success',
				autoDismiss: true
			});
			loadAidList({});
			setaidPayload({ name: '' });
		} catch (err) {
			addToast(err, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

		const appendProjectBalances = useCallback(({ projects, balances }) => {
		const projectsWithBalances = projects.map((el, i) => {
			el.tokenBalance = balances.projectBalances[i];
			el.packageBalances = balances.packageBalances[i].grandTotal;
			return el;
		});
		setProjectList(projectsWithBalances);
		setFetchingPackageBalances(false);
	}, []);

	const fetchProjectsBalances = useCallback(async (projects) => {
		if (!appSettings || !appSettings.agency) return;
		const { agency } = appSettings;
		if (!agency && !agency.contracts) return;
		setFetchingPackageBalances(true);
		const projectIds = projects.map(el => el._id);
		const balances = await getProjectsBalances(projectIds, agency.contracts.rahat,agency.contracts.rahat_admin);
		if(balances) await appendProjectBalances({projects,balances})
		
	}, [ getProjectsBalances,
		appSettings,appendProjectBalances
	]);

	const onPageChanged = useCallback(
		async paginationData => {
			const params = {};
			if (searchName) params.name = searchName;
			if (projectStatus) params.status = projectStatus;
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, ...params };
			const {data}  = await listAid(query);
			setProjectList(data);
			fetchProjectsBalances(data);

		},
		[listAid, projectStatus, searchName,fetchProjectsBalances]
	);

	const loadAidList = useCallback(
		async query => {
			const {data,total} = await listAid(query);
			setProjectList(data);
			setTotalRecords(total);
		},
		[listAid]
	);

	const fetchTotalRecords = useCallback(async () => {
		try {
			const data = await listAid({ start: 0, limit: PAGE_LIMIT });
			setTotalRecords(data.total);
		} catch (err) {
			addToast('Something went wrong!', {
				appearance: 'error',
				autoDismiss: true
			});
		}
	}, [addToast, listAid]);





	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	// useEffect(() => {
	// 	fetchProjectsBalances();
	// }, [fetchProjectsBalances]);

	return (
		<>
			<AidModal toggle={toggleModal} open={aidModal} title="Add Project" handleSubmit={handleAidSubmit}>
				<FormGroup>
					<Label>Name</Label>
					<InputGroup>
						<Input
							type="text"
							name="name"
							placeholder="Enter project name."
							value={aidPayload.name}
							onChange={handleInputChange}
							required
						/>
					</InputGroup>
				</FormGroup>
			</AidModal>
			<Card>
				<CardTitle className="mb-0 pt-3">
					<span style={{ paddingLeft: 26 }}>Projects</span>
				</CardTitle>
				<CardTitle className="mb-0 p-3">
					<div className="toolbar-flex-container">
						<div style={{ flex: 1, padding: 10 }}>
							<input
								style={{ width: '40%' }}
								className="custom-input-box"
								value={searchName || ''}
								onChange={handleSearchInputChange}
								placeholder="Search by name..."
							/>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="flex-item">
								<CustomInput
									onChange={handleProjectStatusChange}
									type="select"
									id="exampleCustomSelect"
									name="customSelect"
									value={projectStatus || ''}
									style={{ width: 'auto' }}
								>
									<option value="">--Select Status--</option>
									<option value="active">Active</option>
									<option value="draft">Draft</option>
								</CustomInput>
							</div>
							<div className="flex-item">
								<Button onClick={handleAddProjectClick} className="btn" color="info">
									Add New
								</Button>
							</div>
						</div>
					</div>
				</CardTitle>
				<CardBody>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">S.N.</th>
								<th className="border-0">Name</th>
								<th className="border-0">Location</th>
								<th className="border-0">Project Manager</th>
								<th className="border-0">Created Date</th>
								<th className="border-0">Status</th>
								<th className="border-0">Balance</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{projectList.length ? (
								projectList.map((d, i) => {
									return (
										<tr key={d._id}>
											<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
											<td>{dottedString(d.name)}</td>
											<td>{dottedString(d.location)}</td>
											<td>
												{d.project_manager ? `${d.project_manager.name.first} ${d.project_manager.name.last}` : '-'}
											</td>
											<td>{moment(d.created_at).format('MMM Do YYYY')}</td>
											<td>{d.status === 'closed' ? 'COMPLETED' : d.status.toUpperCase()}</td>
											<td>
													{fetchingPackageBalances ? (
														<MiniSpinner />
													) : (
														<>
															<span className="badge badge-success p-2 mb-1">
																{d.tokenBalance || 0 } Tokens 
															</span>
															<br />
															<span className="badge bg-light text-dark p-2">
															 Rs. {d.packageBalances || 0} Packages
															</span>
														</>
													) }
												</td>
											<td className="blue-grey-text  text-darken-4 font-medium">
												<Link to={`/projects/${d._id}`}>
													<i className="fas fa-eye fa-lg"></i>
												</Link>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={2}></td>
									<td>No data available.</td>
								</tr>
							)}
						</tbody>
					</Table>

					{totalRecords > 0 && (
						<AdvancePagination
							totalRecords={totalRecords}
							pageLimit={PAGE_LIMIT}
							pageNeighbours={1}
							onPageChanged={onPageChanged}
						/>
					)}
				</CardBody>
			</Card>
		</>
	);
};

export default List;
