import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table, FormGroup, InputGroup, Input, Col, Row } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import QRCode from 'qrcode';

import { AidContext } from '../../../../contexts/AidContext';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { APP_CONSTANTS, TOAST } from '../../../../constants';
import { htmlResponse } from '../../../../utils/printBeneficiary';
import ModalWrapper from '../../../global/CustomModal';
import PasscodeModal from '../../../global/PasscodeModal';
import GrowSpinner from '../../../global/GrowSpinner';
import UploadList from './uploadList';
import * as XLSX from 'xlsx';

const ACTION = {
	BULK_QR: 'bulk_qrcode_export',
	BULK_ISSUE: 'bulk_token_issue'
};

const List = ({ beneficiaries, projectId }) => {
	const { addToast } = useToasts();
	const { beneficiary_pagination, beneficiaryByAid, bulkTokenIssueToBeneficiary } = useContext(AidContext);
	const { loading, setLoading, wallet, isVerified, appSettings } = useContext(AppContext);

	const [amount, setAmount] = useState('');
	const [amountModal, setAmountModal] = useState(false);
	const [currentAction, setCurrentAction] = useState('');
	const [beneficiaryPhones, setBeneficiaryPhones] = useState([]); // For bulk issue
	const [beneficiaryTokens, setBeneficiaryTokens] = useState([]); // For bulk issue
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [benefUploadFile, setBenefUploadFile] = useState('');
	const [uploadListModal, setUploadListModal] = useState(false);
	const [uploadData, setUploadData] = useState(null);

	const hiddenFileInput = React.useRef(null);

	const togglePasscodeModal = () => setPasscodeModal(!passcodeModal);
	const toggleUploadListModal = () => setUploadListModal(!uploadListModal);

	const toggleAmountModal = action => {
		if (action) setCurrentAction(action);
		setAmountModal(!amountModal);
	};

	const handleFileUploadClick = event => {
		hiddenFileInput.current.click();
	};

	const handleUploadListSubmit = () => {
	};

	const handleFileChange = e => {
		setUploadListModal(true);
		readFile(e.target.files[0]);
		e.target.value = '';
		//setBenefUploadFile(e.target.files[0]);
	};

	const readFile = file => {
		const reader = new FileReader();
		reader.onload = evt => {
			// evt = on_file_select event
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			/* Update state */
			const jsonData = convertToJson(data);
			setUploadData(jsonData);
		};
		reader.readAsBinaryString(file);
	};

	const convertToJson = csv => {
		var lines = csv.split('\n');

		var result = [];

		var headers = lines[0].split(',');

		for (var i = 1; i < lines.length; i++) {
			var obj = {};
			var currentline = lines[i].split(',');

			for (var j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}

			result.push(obj);
		}

		//return result; //JavaScript object
		return result; //JSON
	};

	const handleAmountChange = e => setAmount(e.target.value);

	const handleModalFormSubmit = e => {
		e.preventDefault();
		if (currentAction === ACTION.BULK_QR) return handleBulkQrExport();
		if (currentAction === ACTION.BULK_ISSUE) return handleBulkTokenIssue();
	};

	const handlePagination = current_page => {
		let _start = (current_page - 1) * beneficiary_pagination.limit;
		return beneficiaryByAid(projectId, { start: _start });
	};

	const convertQrToImg = async data => {
		let result = [];
		for (let d of data) {
			const imgUrl = await QRCode.toDataURL(`phone:+977${d.phone}?amount=${amount ? amount : null}`);
			result.push({ imgUrl, phone: d.phone });
		}
		return result;
	};

	const handleBulkTokenIssue = async () => {
		let beneficiary_tokens = [];
		if (!amount) return addToast('Please enter token amount', TOAST.ERROR);
		const { data } = await beneficiaryByAid(projectId, { limit: APP_CONSTANTS.BULK_BENEFICIARY_LIMIT });
		if (!data || !data.length) return addToast('No beneficiary available', TOAST.ERROR);
		if (data.length) {
			const beneficiary_phones = data.map(d => d.phone);
			const len = beneficiary_phones.length;
			if (len < 1) return addToast('No phone number found', TOAST.ERROR);
			for (let i = 0; i < len; i++) {
				beneficiary_tokens.push(amount);
			}
			setBeneficiaryTokens(beneficiary_tokens);
			setBeneficiaryPhones(beneficiary_phones);
			toggleAmountModal();
			togglePasscodeModal();
		}
	};

	const handleBulkQrExport = async () => {
		const res = await beneficiaryByAid(projectId, { limit: APP_CONSTANTS.BULK_BENEFICIARY_LIMIT });
		if (!res || !res.data.length) return addToast('No beneficiay available', TOAST.ERROR);
		return printBulkQrCode(res.data);
	};

	const printBulkQrCode = async data => {
		const qrcodeImages = await convertQrToImg(data);
		const html = htmlResponse(data, qrcodeImages);
		toggleAmountModal();
		setAmount('');
		var newWindow = window.open('', 'Print QR', 'fullscreen=yes'),
			document = newWindow.document.open();
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};

	const submitBulkTokenIssue = useCallback(async () => {
		if (wallet && isVerified) {
			try {
				setPasscodeModal(false);
				setLoading(true);
				const { contracts } = appSettings.agency;
				let res = await bulkTokenIssueToBeneficiary({
					projectId: projectId,
					phone_numbers: beneficiaryPhones,
					token_amounts: beneficiaryTokens,
					contract_address: contracts.rahat,
					wallet
				});
				if (res) {
					setAmount('');
					const total_ben = beneficiaryPhones.length;
					return addToast(`Each of ${total_ben} beneficiary has been assigned ${amount} tokens`, TOAST.SUCCESS);
				}
			} catch (err) {
				addToast(err.message, TOAST.ERROR);
			} finally {
				setLoading(false);
			}
		}
	}, [
		addToast,
		amount,
		appSettings.agency,
		beneficiaryPhones,
		beneficiaryTokens,
		bulkTokenIssueToBeneficiary,
		isVerified,
		projectId,
		setLoading,
		wallet
	]);

	useEffect(() => {
		submitBulkTokenIssue();
	}, [submitBulkTokenIssue, isVerified]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<ModalWrapper
				toggle={toggleAmountModal}
				open={amountModal}
				title="Set Beneficiary Amount"
				handleSubmit={handleModalFormSubmit}
				loading={loading}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="amount"
							placeholder="Please enter amount"
							value={amount || ''}
							onChange={handleAmountChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>

			<ModalWrapper
				toggle={toggleUploadListModal}
				open={uploadListModal}
				title="Beneficiaries List"
				handleSubmit={handleUploadListSubmit}
				loading={loading}
				size="xl"
			>
				<UploadList data={uploadData} />
			</ModalWrapper>

			<div>
				{loading ? (
					<GrowSpinner />
				) : (
					<div className="row">
						<div style={{ flex: 1, padding: 10 }}>
							<button
								onClick={() => toggleAmountModal(ACTION.BULK_ISSUE)}
								type="button"
								class="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px', marginRight: '20px' }}
							>
								Bulk Token Issue
							</button>
							<button
								type="button"
								onClick={() => toggleAmountModal(ACTION.BULK_QR)}
								class="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px' }}
							>
								Bulk Generate QR Code
							</button>
						</div>
						<div style={{ padding: 10, float: 'right' }}>
							<button
								type="button"
								onClick={handleFileUploadClick}
								class="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px' }}
							>
								Upload Beneficiaries
							</button>
							<input type="file" ref={hiddenFileInput} onChange={handleFileChange} style={{ display: 'none' }} />
						</div>
					</div>
				)}

				<div className="flex-item">
					{/* <button type="button" class="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
						Add Beneficiary
					</button> */}
				</div>
			</div>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Govt. ID</th>
					</tr>
				</thead>
				<tbody>
					{beneficiaries.length > 0 ? (
						beneficiaries.map(d => {
							return (
								<tr key={d._id}>
									<td>{d.name}</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone}</td>
									<td>{d.govt_id || '-'}</td>
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

			{beneficiary_pagination.totalPages > 1 ? (
				<Pagination
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '50px'
					}}
				>
					<PaginationItem>
						<PaginationLink first href="#first_page" onClick={() => handlePagination(1)} />
					</PaginationItem>
					{[...Array(beneficiary_pagination.totalPages)].map((p, i) => (
						<PaginationItem
							key={i}
							active={beneficiary_pagination.currentPage === i + 1 ? true : false}
							onClick={() => handlePagination(i + 1)}
						>
							<PaginationLink href={`#page=${i + 1}`}>{i + 1}</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationLink
							last
							href="#last_page"
							onClick={() => handlePagination(beneficiary_pagination.totalPages)}
						/>
					</PaginationItem>
				</Pagination>
			) : (
				''
			)}
		</>
	);
};

export default List;
