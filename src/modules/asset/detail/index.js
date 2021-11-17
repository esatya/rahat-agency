import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Card, CardBody, CardTitle, Col, Row, FormGroup, InputGroup, Label, Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import BreadCrumb from '../../ui_components/breadcrumb';
import '../../../assets/css/project.css';
import BackButton from '../../global/BackButton';
import PasscodeModal from '../../global/PasscodeModal';
import { TOAST } from '../../../constants';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';

export default function NewAsset({ match }) {
	const { packageId, projectId } = match.params;
	const { addToast } = useToasts();
	const history = useHistory();

	const { getPackageDetails, mintNft } = useContext(AidContext);
	const { appSettings, isVerified, wallet } = useContext(AppContext);

	const [packageDetails, setPackageDetails] = useState(null);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mintQty, setMintQty] = useState('');

	const handleMintQty = e => setMintQty(e.target.value);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const submitMintNft = useCallback(async () => {
		try {
			if (isVerified && wallet) {
				const { tokenId } = packageDetails;
				setPasscodeModal(false);
				setLoading(true);
				const { contracts } = appSettings.agency;
				const payload = {
					tokenId: tokenId,
					projectCapital: mintQty,
					projectId: projectId,
					packageId: packageId
				};
				await mintNft({ payload, contracts, wallet });
				setLoading(false);
				addToast('Package minted successfully', TOAST.SUCCESS);
				history.push(`/add-budget/${projectId}`);
			}
		} catch (err) {
			setLoading(false);
			addToast('Package mint failed', TOAST.ERROR);
		}
	}, [
		isVerified,
		wallet,
		packageDetails,
		appSettings.agency,
		mintQty,
		projectId,
		packageId,
		mintNft,
		addToast,
		history
	]);

	const handleQuantitySubmit = e => {
		e.preventDefault();
		togglePasscodeModal();
	};

	const fetchPackageDetails = useCallback(async () => {
		const d = await getPackageDetails(packageId);
		setPackageDetails(d);
	}, [packageId, getPackageDetails]);

	useEffect(() => {
		fetchPackageDetails();
	}, [fetchPackageDetails]);

	useEffect(() => {
		submitMintNft();
	}, [isVerified, submitMintNft]);

	return (
		<>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>

			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Mint Package" />
			<Card>
				<div className="stat-card-body">
					<CardTitle className="title">Mint Package</CardTitle>
					<CardBody className="pl-0">
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.name ? packageDetails.name : '-'}{' '}
										{packageDetails && packageDetails.symbol ? `(${packageDetails.symbol})` : '-'}
									</p>
									<div className="sub-title">Name</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.totalSupply ? packageDetails.totalSupply : '-'}
									</p>
									<div className="sub-title">Quantity</div>
								</div>
							</Col>
						</Row>
						<Row>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.metadata.description ? packageDetails.metadata.description : '-'}
									</p>
									<div className="sub-title">Description</div>
								</div>
							</Col>
							<Col>
								<div style={{ marginBottom: '25px' }}>
									<p className="card-font-medium">
										{packageDetails && packageDetails.metadata.currency ? packageDetails.metadata.currency : 'NPR'} {''}
										{packageDetails && packageDetails.metadata.fiatValue ? packageDetails.metadata.fiatValue : '-'}
									</p>
									<div className="sub-title">Value in fiat currency</div>
								</div>
							</Col>
						</Row>
					</CardBody>

					<hr />

					<CardBody>
						<FormGroup>
							<Label>
								Mint package <span style={{ fontSize: 12 }}>-Entered quantity will be added to existing quantity</span>
							</Label>
							<form onSubmit={handleQuantitySubmit}>
								<InputGroup>
									<Input
										type="number"
										value={mintQty || ''}
										name="mintQty"
										placeholder="Enter quantity"
										onChange={handleMintQty}
										required
									/>
									&nbsp;
									{loading ? (
										<button disabled={true} type="button" className="btn waves-effect waves-light btn-secondary">
											Minting, Please wait...
										</button>
									) : (
										<button type="submit" className="btn waves-effect waves-light btn-info">
											Mint Now
										</button>
									)}
								</InputGroup>
							</form>
						</FormGroup>
						<BackButton />
					</CardBody>
				</div>
			</Card>
		</>
	);
}
