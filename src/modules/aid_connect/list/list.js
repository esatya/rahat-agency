import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
	Button,
	Card,
	CardBody,
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

const { PAGE_LIMIT } = APP_CONSTANTS;

const beneficiaries = [
	{
		_id: 34567,
		name: 'superman',
		phone: 1234,
		address: 'LA, USA',
		project: 'Wash programme'
	}
];

const List = () => {
	const { addToast } = useToasts();
	const { listProject } = useContext(AidConnectContext);
	const [searchName, setSearchName] = useState('');
	const [projectList, setProjectList] = useState([]);
	const [showLink, setShowLink] = useState(false);
	const [linkStatus, setLinkStatus] = useState(true);
	const [selectAll, setSelectAll] = useState(false);
	const [selectedBeneficiary, setSelectedBeneficiary] = useState([]);
	const currentPage = 1;

	const handleCreateLinkClick = () => {
		setShowLink(true);
	};

	const handleImportClick = () => {};

	const handleSearchInputChange = e => {
		const query = {};
		const { value } = e.target;
		if (value) query.name = value;
		setSearchName(value);
	};

	const handleProjectChange = () => {};

	const loadProjects = useCallback(async () => {
		const projects = await listProject();
		if (projects && projects.data.length) {
			const select_options = projects.data.map(p => {
				return {
					label: p.name,
					value: p._id
				};
			});
			setProjectList(select_options);
		}
	}, [listProject]);

	const handleStatusChange = e => {
		const _status = e === true ? 'active' : 'suspended';
		const success_label = _status === 'suspended' ? 'Suspended' : 'Activated';
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

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

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
									multi={true}
									onChange={handleProjectChange}
									maxMenuHeight={150}
									data={projectList}
									placeholder="--Select Project--"
								/>
							</FormGroup>
						</div>
						<div className="mt-4">
							<Label className="ml-1 mt-1 mb-2">Link</Label>
							<FormGroup>
								<Button type="button" onClick={handleCreateLinkClick} className="btn mr-3" color="info">
									Create Link
								</Button>
								{showLink ? (
									<BootstrapSwitchButton
										checked={linkStatus}
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
										<Input type="text" value="" name="link" required />
										<InputGroupAddon addonType="append">
											<Button color="info">Copy</Button>
										</InputGroupAddon>
									</InputGroup>
								</FormGroup>
							) : (
								''
							)}
						</div>
						<div className="mt-4 mb-0">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<input
									style={{ width: '40%' }}
									className="custom-input-box"
									value={searchName || ''}
									onChange={handleSearchInputChange}
									placeholder="Search by name..."
								/>
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
													<td className="blue-grey-text  text-darken-4 font-medium">
														<Link to={`/${d._id}/users`}>
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

							{/* {totalRecords > 0 && (
						<AdvancePagination
							totalRecords={totalRecords}
							pageLimit={PAGE_LIMIT}
							pageNeighbours={1}
							onPageChanged={onPageChanged}
						/>
					)} */}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default List;
