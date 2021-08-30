import React, { useState, useCallback } from 'react';
import { Button, Card, CardTitle, Form, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import '../../project.css';
import UnlockWallet from '../../../modules/global/walletUnlock';
import TotalCard from '../../totalCard';

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
			<TotalCard
				title="Budget"
				data1="10,000,000"
				sub_title1="Total Project Budget"
				data2="50,000"
				sub_title2="Total Redeemed Budget"
			/>
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
