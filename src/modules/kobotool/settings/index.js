import React, { useState, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';
import WalletUnlock from '../../../modules/global/walletUnlock';
import BreadCrumb from '../../ui_components/breadcrumb';

const KoboToolboxSettings = () => {
	const { addToast } = useToasts();
	const { setKobotoolbox } = useContext(AppContext);
	const [passcodeModal, setPasscodeModal] = useState(false);
	const [formData, setFormData] = useState({
		token: '',
		kpi: ''
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		const payload = { ...formData };
		setLoading(true);
		setKobotoolbox(payload);
	};

	const handleCancelClick = () => History.push('/kobo-toolbox');

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<p className="page-heading">Kobo Toolbox</p>
			<BreadCrumb root_label="Kobo Toolbox" current_label="Settings" redirect_path="kobo-toolbox" />
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<FormGroup>
									<Label>KPI</Label>
									<Input type="text" value={formData.kpi} name="kpi" onChange={handleInputChange} />
								</FormGroup>

								<FormGroup>
									<Label>API token</Label>
									<Input type="text" value={formData.token} name="token" onChange={handleInputChange} required />
								</FormGroup>

								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<Button type="button" disabled={true} className="btn btn-secondary">
											Adding, Please wait...
										</Button>
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Submit
											</Button>
											<Button
												type="button"
												onClick={handleCancelClick}
												style={{ borderRadius: 8 }}
												className="btn btn-dark ml-2"
											>
												Cancel
											</Button>
										</div>
									)}
								</CardBody>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default KoboToolboxSettings;
