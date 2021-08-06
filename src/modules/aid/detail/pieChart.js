import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

export default function Chart({ available_tokens, total_tokens }) {
	const pieData = {
		labels: ['Available Tokens', 'Used Tokens'],
		datasets: [
			{
				data: [available_tokens, total_tokens - available_tokens],
				backgroundColor: ['#2b7ec1', '#fd7e14'],
				hoverBackgroundColor: ['#2b7ec1', '#fd7e14']
			}
		]
	};
	return (
		<div>
			<Card>
				<CardBody>
					<CardTitle className="title">Token Detail</CardTitle>
					<div className="chart-wrapper" style={{ width: '100%', margin: 10, height: 230 }}>
						<Pie
							data={pieData}
							options={{
								maintainAspectRatio: false,
								legend: {
									display: true,
									position: 'bottom',
									labels: {
										fontFamily: 'Be Vietnam',
										fontColor: '#9B9B9B'
									}
								}
							}}
						/>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
