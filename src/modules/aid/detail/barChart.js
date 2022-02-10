import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import Loading from '../../global/Loading';

export default function Chart({ available_tokens, total_tokens, total_package, fetching }) {
	const barChartData = {
		datasets: [
			{
				label: 'Available Tokens',
				backgroundColor: '#2B7EC1',
				stack: '2',
				data: [available_tokens]
			},
			{
				label: 'Total Token',
				backgroundColor: '#DBEBF4',
				stack: '2',
				data: [total_tokens]
			},
			{
				label: 'Package',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				data: [total_package]
			}
		]
	};

	const barChartOptions = {
		maintainAspectRatio: false,
		legend: {
			display: true,
			position: 'bottom'
		},
		scales: {
			xAxes: [
				{
					gridLines: { display: false },
					barThickness: 40
				}
			],
			yAxes: [
				{
					gridLines: { borderDash: [4, 2] }
				}
			]
		}
	};

	// let bar_labels = ['Tokens', 'Package'];
	// let bar_data = [available_tokens, 1000];

	// barChartData.labels = bar_labels;
	// barChartData.datasets[0].data = bar_data;

	return (
		<div>
			<Card>
				<CardBody>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle>Token Detail</CardTitle>
					</div>
					<br />
					<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 230 }}>
						{fetching ? <Loading /> : <Bar data={barChartData} options={barChartOptions} />}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
