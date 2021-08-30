import React from 'react';
import { Card, CardTitle, CustomInput, Table, Row, Col } from 'reactstrap';

const TransactionHistory = () => {
	return (
		<div className="main">
			{/* <div className="transaction-table-container"> */}
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
								<th className="border-0">Date</th>
								<th className="border-0">Value</th>
								<th className="border-0">Type</th>
								<th className="border-0">TX</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>xxxxxxxxxxxx123</td>
								<td>xxxxxxxxxxxx456</td>
								<td>23-05-2020</td>
								<td>200,000</td>
								<td>Received</td>
								<td>xxxxxxxxxxx45</td>
							</tr>
						</tbody>
					</Table>
				</div>
			</Card>
			{/* </div> */}

			<br />
		</div>
	);
};

export default TransactionHistory;
