import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/project.css';

import Loading from '../../global/Loading';
import { formatBalanceAndCurrency } from '../../../utils';

export default function Balance(props) {
	const {
		title,
		token_data,
		package_data,
		button_name,
		projectId,
		fetching,
		action,
		handleIssueToken,
		loading
	} = props;
	const history = useHistory();
	const handleClick = () => {
		history.push(`/add-budget/${projectId}`);
	};
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title">{title || 'No Title'}</CardTitle>
						</Col>
						<Col>
							{loading ? (
								<Loading />
							) : button_name ? (
								<button
									type="button"
									className="btn waves-effect waves-light btn-outline-info"
									style={{ borderRadius: '8px', float: 'right' }}
									onClick={action === 'issue_token' ? handleIssueToken : handleClick}
								>
									{button_name || 'button'}
								</button>
							) : (
								''
							)}
						</Col>
					</Row>
					<Row>
						<Col>
							{fetching ? <Loading /> : <p className="card-font-bold">{token_data || '0'}</p>}

							<div style={{ marginTop: 0 }} className="sub-title">
								Tokens
							</div>
						</Col>
						<Col>
							{fetching ? (
								<Loading />
							) : (
								<p className="card-font-bold">
									{package_data && package_data.currency
										? formatBalanceAndCurrency(package_data.grandTotal, package_data.currency)
										: '0'}
								</p>
							)}

							<div style={{ marginTop: 0 }} className="sub-title">
								Package
							</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
