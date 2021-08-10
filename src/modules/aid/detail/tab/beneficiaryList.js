import React, { useContext, useState } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table, FormGroup, InputGroup, Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import QRCode from 'qrcode';

import { AidContext } from '../../../../contexts/AidContext';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { APP_CONSTANTS, TOAST } from '../../../../constants';
import { htmlResponse } from '../../../../utils/printBeneficiary';
import ModalWrapper from '../../../global/CustomModal';

const ACTION = {
	BULK_QR: 'bulk_qrcode_export',
	BULK_ISSUE: 'bulk_token_issue'
};

const List = ({ beneficiaries, projectId }) => {
	const { addToast } = useToasts();
	const { beneficiary_pagination, beneficiaryByAid } = useContext(AidContext);
	const { loading } = useContext(AppContext);

	const [amount, setAmount] = useState('');
	const [amountModal, setAmountModal] = useState(false);
	const [currentAction, setCurrentAction] = useState('');

	const toggleAmountModal = action => {
		if (action) setCurrentAction(action);
		setAmountModal(!amountModal);
	};

	const handleAmountChange = e => setAmount(e.target.value);

	const handleModalFormSubmit = e => {
		e.preventDefault();
		if (currentAction === ACTION.BULK_QR) return handleBulkQrExport();
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

	return (
		<>
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
			<div className="toolbar-flex-container">
				<div style={{ flex: 1, padding: 10 }}>
					<button
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
