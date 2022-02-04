import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
	Button,
	Card,
	CardBody,
	CustomInput,
	CardTitle,
	Table,
	FormGroup,
	Label,
	Input,
	InputGroup,
	InputGroupAddon
} from 'reactstrap';
import { Link } from 'react-router-dom';
import SelectWrapper from '../../global/SelectWrapper';
import { TOAST, APP_CONSTANTS } from '../../../constants';
import { dottedString } from '../../../utils';
import { AidConnectContext } from '../../../contexts/AidConnectContext';
import { useToasts } from 'react-toast-notifications';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { AID_CONNECT_STATUS } from '../../../constants';
import AdvancePagination from '../../global/AdvancePagination';
import Swal from 'sweetalert2';

const { PAGE_LIMIT } = APP_CONSTANTS;
const SEARCH_OPTIONS = { PHONE: 'phone', NAME: 'name' };

const List = () => {
	const { addToast } = useToasts();

	const { listProject, listAidConnectBeneficiary, generateLink, addBeneficiaryInBulk, changeLinkStatus } = useContext(
		AidConnectContext
	);
	const [projects, setProjects] = useState();
	const [projectList, setProjectList] = useState([]);

	const [link, setLink] = useState('');
	const [linkStatus, setLinkStatus] = useState();

	const [showLinkComponent, setShowLinkComponent] = useState(false);
	const [showLink, setShowLink] = useState(false);

	const [selectAll, setSelectAll] = useState(false);
	const [selectedBeneficiary, setSelectedBeneficiary] = useState([]);
	const [beneficiaries, setBeneficiaries] = useState([]);
	const beneficiaryStatus = true;

	const [projectId, setProjectId] = useState('');
	const [aidConnectId, setAidConnectId] = useState('');

	const [importing, setImporting] = useState(false);

	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});
	const [searchValue, setSearchValue] = useState('');
	const [totalRecords, setTotalRecords] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

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
		setProjects(project);
	}, [listProject]);

	const handleCreateLinkClick = async () => {
		const generatedData = await generateLink(projectId);
		const link = generatedData.data.link;
		setLink(link);
		setShowLink(true);
	};

	const handleFilterOptionChange = e => {
		let { value } = e.target;
		if (value === SEARCH_OPTIONS.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: SEARCH_OPTIONS.NAME
			});
		}

		if (value === SEARCH_OPTIONS.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: SEARCH_OPTIONS.PHONE
			});
		}
		setSearchValue('');
		fetchList({ start: 0, limit: PAGE_LIMIT });
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (filter.searchBy === SEARCH_OPTIONS.PHONE) {
			return fetchList({ start: 0, limit: PAGE_LIMIT, phone: value });
		}
		if (filter.searchBy === SEARCH_OPTIONS.NAME) {
			return fetchList({ start: 0, limit: PAGE_LIMIT, name: value });
		}
		fetchList({ start: 0, limit: PAGE_LIMIT });
	};

	const fetchList = async params => {
		if (aidConnectId) {
			let query = { start: 0, limit: PAGE_LIMIT, ...params };
			const data = await listAidConnectBeneficiary(aidConnectId, query);
			setBeneficiaries(data.data);
			setTotalRecords(data.total);
		}
	};

	const fetchTotalRecords = useCallback(async () => {
		if (aidConnectId) {
			try {
				const data = await listAidConnectBeneficiary(aidConnectId, { start: 0, limit: PAGE_LIMIT });
				setTotalRecords(data.total);
			} catch (err) {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			}
		}
	}, [addToast, listAidConnectBeneficiary, aidConnectId]);

	const handleProjectChange = data => {
		const values = data.value.toString();
		setProjectId(values);
		if (projects && projects.data.length) {
			const selectedProject = projects.data.find(x => x._id === values);
			const aidConnectID = selectedProject.aid_connect.id;
			const status = selectedProject.aid_connect.isActive;
			setAidConnectId(aidConnectID);
			setLinkStatus(status);
			setShowLinkComponent(true);
		}
	};

	const handleStatusChange = e => {
		const payload = {
			isActive: e
		};
		changeLinkStatus(projectId, payload)
			.then(() => {
				addToast(`Link has been ${success_label}`, TOAST.SUCCESS);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
		const _status = e === true ? 'active' : 'suspended';
		const success_label = _status === AID_CONNECT_STATUS.SUSPENDED ? 'Suspended' : 'Activated';
		addToast(`Link has been ${success_label}`, TOAST.SUCCESS);
		setLinkStatus(!linkStatus);
	};

	const handleSelectAll = e => {
		const { checked } = e.target;
		if (checked) {
			const benPhone = beneficiaries.map(b => b.phone);
			setSelectAll(true);
			setSelectedBeneficiary(benPhone);
		} else {
			setSelectAll(false);
			setSelectedBeneficiary([]);
		}
	};

	const handleCheckboxChange = phone => {
		const phoneExist = selectedBeneficiary.includes(phone);
		if (phoneExist) {
			const filterList = selectedBeneficiary.filter(f => f !== phone);
			setSelectedBeneficiary(filterList);
		} else setSelectedBeneficiary([...selectedBeneficiary, phone]);
	};

	const handleCopyClick = () => {};

	const handleImportClick = () => {
		// FILTER BEFOR IMPORTING BENEFICIRIES

		// const selectedBeneficiaries = beneficiaries.find(
		// 	el => selectedBeneficiary.map(d => el.phone === d)
		// 	// .includes(val => selectedBeneficiaryPhones(val)
		// );
		// console.log({ selectedBeneficiaries });

		setImporting(true);
		const filteredData = beneficiaries.map(el => {
			return { name: el.name, phone: el.phone, email: el.email, address: el.address, projects: projectId };
		});
		addBeneficiaryInBulk(filteredData)
			.then(d => {
				setImporting(false);
				if (d.inserted && d.inserted.total)
					addToast(`${d.inserted.total} Beneficiary added successfully`, TOAST.SUCCESS);
				if (d.failed && d.failed.total) addToast(`${d.failed.total} Beneficiary Already Exists`, TOAST.WARNING);
			})
			.catch(e => {
				setImporting(false);
				addToast('Failed to import beneficiaries', TOAST.ERROR);
			});
	};

	const handleBeneficiaryDelete = () => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(result => {
			if (result.isConfirmed) {
				Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
			}
		});
	};

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	const getQueryParams = useCallback(() => {
		const params = {};
		if (filter.searchBy === SEARCH_OPTIONS.PHONE) params.phone = searchValue;
		if (filter.searchBy === SEARCH_OPTIONS.NAME) params.name = searchValue;
		return params;
	}, [filter.searchBy, searchValue]);

	const onPageChanged = useCallback(
		async paginationData => {
			const params = getQueryParams();
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, ...params };
			if (aidConnectId) {
				const data = await listAidConnectBeneficiary(aidConnectId, query);
				setBeneficiaries(data.data);
			}
		},
		[getQueryParams, listAidConnectBeneficiary, aidConnectId]
	);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Aid connect</span>
					</CardTitle>
					<CardBody>
						<div className="mt-2 mb-1 ">
							<FormGroup>
								<Label>Project</Label>
								<SelectWrapper
									multi={false}
									onChange={handleProjectChange}
									maxMenuHeight={150}
									data={projectList}
									placeholder="--Select Project--"
								/>
							</FormGroup>
						</div>
						{showLinkComponent ? (
							<div className="mt-4">
								<Label className="ml-1 mt-1 mb-2">Link</Label>
								<FormGroup>
									<Button type="button" onClick={handleCreateLinkClick} className="btn mr-3" color="info">
										Create Link
									</Button>
									{showLink ? (
										<BootstrapSwitchButton
											checked={linkStatus ? false : true}
											onlabel="Link Activated"
											offlabel="Link Suspended"
											width={150}
											height={30}
											onstyle="success"
											onChange={handleStatusChange}
										/>
									) : (
										''
									)}
								</FormGroup>
								{showLink ? (
									<FormGroup>
										<InputGroup>
											<Input type="text" value={link} name="link" disabled />
											<InputGroupAddon addonType="append">
												<Button color="info" onClick={handleCopyClick}>
													Copy
												</Button>
											</InputGroupAddon>
										</InputGroup>
									</FormGroup>
								) : (
									''
								)}
							</div>
						) : (
							''
						)}
						<div className="mt-4 mb-0">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div className="d-flex">
									<CustomInput
										type="select"
										id="exampleCustomSelect"
										name="customSelect"
										defaultValue=""
										style={{ width: 'auto', marginRight: '10px' }}
										onChange={handleFilterOptionChange}
									>
										<option value="phone">Search By Phone</option>
										<option value="name">By Name</option>
									</CustomInput>
									<Input
										placeholder={filter.searchPlaceholder}
										onChange={handleSearchInputChange}
										style={{ width: '100%' }}
									/>
								</div>

								<div>
									{importing ? (
										<Button type="button" disabled={true} className="btn" color="info">
											Importing...
										</Button>
									) : (
										<Button
											type="button"
											onClick={handleImportClick}
											className="btn"
											color="info"
											outline={true}
											style={{ borderRadius: '8px' }}
										>
											Import
										</Button>
									)}
								</div>
							</div>
						</div>
						<div>
							<Table className="no-wrap v-middle" responsive>
								<thead>
									<tr className="border-0">
										<th className="border-0">
											<input
												id="custom-checkbox"
												onChange={handleSelectAll}
												type="checkbox"
												checked={selectAll}
												value="select all"
											/>
										</th>
										<th className="border-0">S.N.</th>
										<th className="border-0">Name</th>
										<th className="border-0">Phone</th>
										<th className="border-0">Address</th>
										<th className="border-0">Status</th>
										<th className="border-0">Action</th>
									</tr>
								</thead>
								<tbody>
									{beneficiaries.length ? (
										beneficiaries.map((d, i) => {
											return (
												<tr key={d._id}>
													<th>
														<input
															id={`custom-checkbox-${i}`}
															onChange={() => handleCheckboxChange(d.phone)}
															type="checkbox"
															checked={selectedBeneficiary.includes(d.phone)}
															value={d.phone}
														/>
													</th>
													<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
													<td>{dottedString(`${d.name}`)}</td>
													<td>{d.phone || '-'}</td>
													<td>{d.address}</td>
													<td>{beneficiaryStatus ? 'Imported' : 'Not Imported'}</td>
													<td className="d-flex justify-content-around align-items-center blue-grey-text text-darken-4 font-medium">
														<Link to={`/${d._id}/users`}>
															<i className="fas fa-eye fa-lg"></i>
														</Link>
														{/* <Link> */}
														<i className="fas fa-trash-alt fa-lg" onClick={handleBeneficiaryDelete}></i>
														{/* </Link> */}
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
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default List;
