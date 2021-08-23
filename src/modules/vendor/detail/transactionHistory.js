import React from 'react';
import { Card, CardTitle, CustomInput, Table, Row, Col } from 'reactstrap';
import Loading from '../../global/Loading';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;

const TransactionHistory = props => {
	const { transactions } = props;
	console.log('tx list', transactions);

	return (
		<div className="main">
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">
						<Row>
							<Col md="6">Transaction History</Col>
							<Col md="6">
								<CustomInput
									type="select"
									id="exampleCustomSelect"
									name="customSelect"
									defaultValue=""
									style={{ width: 'auto', float: 'right' }}
								>
									<option value="phone">Sort By Date</option>
									<option value="name">By Name</option>
									<option value="project">By Project</option>
								</CustomInput>
							</Col>
						</Row>
					</CardTitle>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">From</th>
								<th className="border-0">To</th>
								<th className="border-0">Block number</th>
								<th className="border-0">Value</th>
								<th className="border-0">Type</th>
								<th className="border-0">TX</th>
							</tr>
						</thead>
						<tbody>
							{transactions &&
								transactions.map(tx => {
									return (
										<tr>
											<td>{tx.from}</td>
											<td>{tx.to}</td>
											<td>{tx.blockNumber}</td>
											<td>{tx.value}</td>
											<td>{tx.tag}</td>
											<td>
												<a href={EXPLORER_URL + '/tx/' + tx.transactionHash} target="_blank" rel="noopener noreferrer">
													Verify
												</a>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</div>
			</Card>

			<br />
		</div>
	);
};

export default TransactionHistory;
