import React, { useState, useContext, useCallback } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { AppContext } from '../../../../../contexts/AppSettingsContext';
import { AidContext } from '../../../../../contexts/AidContext';

import GrowSpinner from '../../../../global/GrowSpinner';

const Token = () => {
	const { total_tokens, available_tokens } = useContext(AidContext);

	const { loading } = useContext(AppContext);
	const [inputTokens, setInputToken] = useState('');

	const [passcodeModal, setPasscodeModal] = useState(false);

	const handleInputChange = e => {
		let { value } = e.target;
		setInputToken(value);
	};

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const handleTokenSubmit = e => {
		e.preventDefault();
		togglePasscodeModal();
	};
	return (
		<>
			<div className="spacing-budget">
				<Row>
					<Col md="6" sm="12">
						<p className="card-font-bold">{total_tokens}</p>
						<div className="sub-title">Project Token</div>
					</Col>
					<Col md="6" sm="12">
						<p className="card-font-bold">{available_tokens}</p>
						<div className="sub-title">Available Token</div>
					</Col>
				</Row>
			</div>
			<div className="spacing-budget">
				<CardTitle className="title">Issue Token</CardTitle>
				{loading ? (
					<GrowSpinner />
				) : (
					<Form onSubmit={handleTokenSubmit}>
						<FormGroup>
							<InputGroup>
								<Input
									type="number"
									name="issue_token"
									value={inputTokens || ''}
									onChange={handleInputChange}
									placeholder="Enter number of token balance to be issued"
									required
								/>
								<InputGroupAddon addonType="append">
									<Button color="info">Issue Token</Button>
								</InputGroupAddon>
							</InputGroup>
						</FormGroup>
					</Form>
				)}
			</div>
		</>
	);
};

export default Token;
