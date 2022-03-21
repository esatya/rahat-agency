import React from 'react';
import { Card, CardTitle, Table, Row, Col } from 'reactstrap';
import GrowSpinner from '../../../global/GrowSpinner';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;

const TransactionHistory = props => {
	const { transactions, fetching } = props;

	return (
		<div className="main">
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">
						<Row>
							<Col md="6">Token Transaction History</Col>
							<Col md="6"></Col>
						</Row>
					</CardTitle>
					{fetching ? (
						<GrowSpinner />
					) : (
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">From</th>
									<th className="border-0">Value</th>
									<th className="border-0">Type</th>
									<th className="border-0">TX</th>
								</tr>
							</thead>
							<tbody>
								{transactions.length > 0 ? (
									transactions.map(tx => {
										return (
											<tr>
												<td>{tx.from}</td>
												<td>{tx.value}</td>
												<td>{tx.tag}</td>
												<td>
													<a
														href={EXPLORER_URL + '/tx/' + tx.transactionHash}
														target="_blank"
														rel="noopener noreferrer"
													>
														Verify
													</a>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={2}>No transaction available</td>
									</tr>
								)}
							</tbody>
						</Table>
					)}
				</div>
			</Card>

			<br />
		</div>
	);
};

export default TransactionHistory;
