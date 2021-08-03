import React, { useState, useCallback } from 'react';
import { Button, Card, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import '../../project.css';
import UnlockWallet from '../../../modules/global/walletUnlock';

export default function BudgetAdd() {
	const [inputTokens, setInputToken] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);

	const togglePasscodeModal = useCallback(() => setPasscodeModal(!passcodeModal), [passcodeModal]);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const handleTokenSubmit = e => {
		e.preventDefault();
		togglePasscodeModal();
	};
	return (
		<div>
			<UnlockWallet open={passcodeModal} onClose={e => setPasscodeModal(e)}></UnlockWallet>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">Budget</CardTitle>
					<Row>
						<Col md="6" sm="12" style={{ marginBottom: '10px' }}>
							<p className="card-font-bold">10,000,000</p>
							<div className="sub-title">Total Project Budget</div>
						</Col>
						<Col md="6" sm="12">
							<p className="card-font-bold">50,000</p>
							<div className="sub-title">Total Redeemed Budget</div>
						</Col>
					</Row>
				</div>
			</Card>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">Add Budget</CardTitle>
					<Form onSubmit={handleTokenSubmit}>
						<FormGroup>
							<InputGroup>
								<Input
									type="number"
									name="assign_tokens"
									value={inputTokens || ''}
									onChange={handleInputChange}
									placeholder="Enter number of token balance to be added."
									required
								/>
								<InputGroupAddon addonType="append">
									<Button color="info">Add Budget</Button>
								</InputGroupAddon>
							</InputGroup>
						</FormGroup>
					</Form>
				</div>
			</Card>
		</div>
	);
}
