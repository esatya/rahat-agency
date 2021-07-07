import React, { useContext, useState } from 'react';
import { CardTitle, Card, CardBody, Row, Col, Button, FormGroup, InputGroup, Input } from 'reactstrap';
import QRCode from 'qrcode';
import { useToasts } from 'react-toast-notifications';

import AidDetails from './AidDetails';
import BeneficiaryList from './BeneficiaryList';
import TokenDetails from './TokenDetails';
import { AidContext } from '../../../contexts/AidContext';
import ModalWrapper from '../../global/CustomModal';

const FETCH_LIMIT = 200;

export default function Details({ match }) {
	const aidId = match.params.id;
	const { beneficiaryByAid } = useContext(AidContext);
	const { addToast } = useToasts();

	const [modal, setModal] = useState(false);
	const [amount, setAmount] = useState('');

	const toggleModal = () => setModal(!modal);
	const handleAmountChange = e => setAmount(e.target.value);

	const fetchBeneficiaryByProject = e => {
		e.preventDefault();
		beneficiaryByAid(aidId, { limit: FETCH_LIMIT })
			.then(res => {
				const { data } = res;
				if (data && data.length) return generateBulkQRCodes(data);
				toggleModal();
				addToast('No beneficiary available!', {
					appearance: 'error',
					autoDismiss: true
				});
			})
			.catch();
	};

	//   tel:+9779801109670?amount=200
	const convertQrToImg = async data => {
		let result = [];
		for (let d of data) {
			const imgUrl = await QRCode.toDataURL(`phone:+977${d.phone}?amount=${amount ? amount : null}`);
			result.push({ imgUrl, phone: d.phone });
		}
		return result;
	};

	const generateBulkQRCodes = async data => {
		const qrcodeImages = await convertQrToImg(data);

		let html = `<html>
		<head>
		<style>
		*{
		  margin:0;
		  top:0;
		 }
		</style>
		</head>
		<body>
		`;
		// eslint-disable-next-line array-callback-return
		data.map((d, i) => {
			const name = `Name: ${d.name}`;
			const address = `Address: ${d.address}`;
			const govtID = `Govt. ID: ${d.govt_id}`;
			const found = qrcodeImages.find(f => f.phone === d.phone);
			if (i % 2 === 0) {
				html += `
			<div class="row" style="display:flex;">
			  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
				<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
				<div class="col-md-4" style="margin-top:5px;">
				  <label>
					<h3>${name}<h3>
					<h4>${address}<h4>
					<h4>${govtID}<h4>
				  </label>
				  <br><br>
				</div>
			  </div>`;
			} else {
				html += `
			  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
				<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
				<div class="col-md-4" style="margin-top:5px;">
				  <label>
					<h3>${name}<h3>
					<h4>${address}<h4>
					<h4>${govtID}<h4>
				  </label>
				  <br><br>
				</div>
			  </div>
			</div>`;
			}
		});
		if (data.length % 2 !== 0) {
			html += ` 
		  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
		  </div>
		</div>`;
		}
		html += '</body></html>';
		toggleModal();
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
				toggle={toggleModal}
				open={modal}
				title="Set Beneficiary Amount"
				handleSubmit={fetchBeneficiaryByProject}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="amount"
							placeholder="Please enter amount (optional)"
							value={amount || ''}
							onChange={handleAmountChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>
			<Row>
				<Col md="6">
					<Card style={{ minHeight: 484 }}>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">Project Details</CardTitle>
						<CardBody>
							<AidDetails aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
				<Col md="6">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">Token Details</CardTitle>
						<CardBody>
							<TokenDetails aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<div className="bg-light border-bottom p-3 mb-0 card-title">
								<Row>
									<Col md="10">
										<i className="mdi mdi-border-right mr-2"></i>Beneficiary List
									</Col>
									<Col md="2">
										<div style={{ marginLeft: 30 }}>
											<Button onClick={toggleModal} type="button" className="btn" color="info">
												Export Bulk QRCode
											</Button>
										</div>
									</Col>
								</Row>
							</div>
							<BeneficiaryList aidId={aidId} />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}
