import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import { AidContext } from '../../../../../contexts/AidContext';
import { AppContext } from '../../../../../contexts/AppSettingsContext';

import BackButton from '../../../../global/BackButton';
import PasscodeModal from '../../../../global/PasscodeModal';
import { TOAST } from '../../../../../constants';
import MaskLoader from '../../../../global/MaskLoader';

import { BALANCE_TABS } from '../../../../../constants';
import MiniSpinner from '../../../../global/MiniSpinner';
import { formatBalanceAndCurrency } from '../../../../../utils';

const TOKEN_ISSUE_AMOUNT = 1;
const FETCH_LIMIT = 50;

export default function (props) {
	const { projectId, benfId } = props;
	const { addToast } = useToasts();
	const history = useHistory();

	const {
		listNftPackages,
		getBeneficiaryById,
		issueBeneficiaryPackage,
		getBeneficiaryIssuedTokens,
		sendPackageIssuedSms
	} = useContext(AidContext);
	const { isVerified, wallet, appSettings, currentBalanceTab } = useContext(AppContext);

	const [packageList, setPackageList] = useState([]);
	const [benfName, setBenfName] = useState('');
	const [benfPhone, setBenfPhone] = useState('');
	const [selectedPackages, setSelectedPackages] = useState([]); // Array of selected package tokenIDs
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [masking, setMasking] = useState(false);

	const [fetchingIssuedQty, setFetchingIssuedQty] = useState(false);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleCheckboxClick = e => {
		const { name, checked } = e.target;
		if (checked) setSelectedPackages([...selectedPackages, Number(name)]);
		else {
			const filtered = selectedPackages.filter(f => f !== Number(name));
			setSelectedPackages(filtered);
		}
	};

	const handleIssueClick = () => {
		if (selectedPackages.length < 1) return addToast('Please select package to assign', TOAST.ERROR);
		togglePasscodeModal();
	};

	const checkHasIndex = useCallback((tokenId, tokenIds) => {
		let dataIndex = null;
		for (let i = 0; i < tokenIds.length; i++) {
			const ind = tokenIds.findIndex(t => t === tokenId);
			if (ind > -1) dataIndex = ind;
		}
		return dataIndex;
	}, []);

	const appendIssuedQtyToList = useCallback(
		({ packages, tokenIds, tokenQtys }) => {
			let finalResult = [];
			for (let i = 0; i < packages.length; i++) {
				const dataIndex = checkHasIndex(packages[i].tokenId, tokenIds);
				if (dataIndex > -1) {
					packages[i].issuedQty = tokenQtys[dataIndex];
					finalResult.push(packages[i]);
				} else finalResult.push(packages[i]);
			}

			setPackageList(finalResult);
		},
		[checkHasIndex]
	);

	const fetchIssuedQtys = useCallback(
		async packages => {
			setFetchingIssuedQty(true);
			const { rahat } = appSettings.agency.contracts;
			const { tokenIds, tokenQtys } = await getBeneficiaryIssuedTokens(Number(benfPhone), rahat);
			if (packages.length && tokenQtys.length) await appendIssuedQtyToList({ packages, tokenIds, tokenQtys });
			setFetchingIssuedQty(false);
		},
		[appSettings.agency.contracts, appendIssuedQtyToList, benfPhone, getBeneficiaryIssuedTokens]
	);

	const fetchPackageList = useCallback(async () => {
		const query = { limit: FETCH_LIMIT };
		const d = await listNftPackages(projectId, query);
		if (d && d.data) {
			setPackageList(d.data);
			fetchIssuedQtys(d.data);
		}
	}, [listNftPackages, projectId, fetchIssuedQtys]);

	const fetchBenfDetail = useCallback(async () => {
		const benf = await getBeneficiaryById(benfId);
		if (benf) {
			setBenfName(benf.name);
			setBenfPhone(benf.phone);
		}
	}, [getBeneficiaryById, benfId]);

	const submitBenfPackageRequest = useCallback(async () => {
		if (isVerified && wallet && currentBalanceTab === BALANCE_TABS.PACKAGE) {
			try {
				if (!benfPhone) return addToast('Beneficiary phone is required', TOAST.ERROR);
				setPasscodeModal(false);
				setMasking(true);
				const tokenAmounts = Array(selectedPackages.length).fill(TOKEN_ISSUE_AMOUNT);
				const payload = {
					benfId: benfId,
					projectId: projectId,
					phone: benfPhone,
					amounts: tokenAmounts,
					packageTokens: selectedPackages
				};

				const packageNames = selectedPackages
					.map(item => {
						const name = packageList.find(pkg => Number(pkg.tokenId) === item)?.name;
						return name;
					})
					.join(' , ');

				await sendPackageIssuedSms(Number(benfPhone), packageNames);

				const { rahat } = appSettings.agency.contracts;
				const res = await issueBeneficiaryPackage(wallet, payload, rahat);
				if (res) {
					setMasking(false);
					addToast('Package assigned successfully', TOAST.SUCCESS);
					history.push(`/beneficiaries/${benfId}`);
				}
			} catch (err) {
				setMasking(false);
				const errMsg = err.message ? err.message : 'Could not issue package';
				addToast(errMsg, TOAST.ERROR);
			}
		}
	}, [
		addToast,
		appSettings.agency.contracts,
		benfId,
		benfPhone,
		currentBalanceTab,
		history,
		isVerified,
		issueBeneficiaryPackage,
		projectId,
		selectedPackages,
		wallet,
		packageList,
		sendPackageIssuedSms
	]);

	useEffect(() => {
		fetchBenfDetail();
		fetchPackageList();
	}, [fetchPackageList, fetchBenfDetail]);

	// TODO: Effect called on package issue. Temporarily fixed!
	useEffect(() => {
		submitBenfPackageRequest();
	}, [isVerified, submitBenfPackageRequest]);

	return (
		<>
			<MaskLoader message="Assigning package, please wait..." isOpen={masking} />
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Select</th>
						<th className="border-0">Name</th>
						<th className="border-0">Issued Qty.</th>
						<th className="border-0">Available Qty.</th>
						<th className="border-0">Created By</th>
						<th className="border-0">Details</th>
					</tr>
				</thead>
				<tbody>
					{packageList.length > 0 ? (
						packageList.map((d, i) => {
							return (
								<tr key={d._id}>
									<td style={{ width: '5%' }}>
										<input name={d.tokenId} type="checkbox" onClick={handleCheckboxClick} />
									</td>
									<td>
										{d.name} ({d.symbol})
									</td>
									<td>
										{fetchingIssuedQty ? <MiniSpinner /> : d.issuedQty ? formatBalanceAndCurrency(d.issuedQty) : '0'}
									</td>
									<td>{formatBalanceAndCurrency(d.totalSupply)}</td>
									<td>
										{d.createdBy.name.first} {d.createdBy.name.last || ''}
									</td>
									<td className="blue-grey-text  text-darken-4 font-medium">
										<Link to={`/mint-package/${d._id}/project/${projectId}`}>
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
					)}{' '}
				</tbody>
			</Table>

			<Card>
				<CardBody>
					<div>
						{benfName ? <h4>Beneficiary: {benfName}</h4> : <h4>No beneficiary available</h4>}

						{selectedPackages.length > 0 ? (
							<p>
								<b>{selectedPackages.length} package(s)</b> selected to assign
							</p>
						) : (
							<p>Select package to assign</p>
						)}
					</div>
					<hr />
					<div>
						<button
							onClick={handleIssueClick}
							type="button"
							className="btn waves-effect waves-light btn-info"
							style={{ borderRadius: '8px' }}
						>
							Issue package
						</button>{' '}
						&nbsp;
						<BackButton />
					</div>
				</CardBody>
			</Card>
		</>
	);
}
