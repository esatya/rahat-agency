import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';

const barChartData = {
	labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6'],
	datasets: [
		{
			label: 'Token Redeem',
			backgroundColor: '#2B7EC1',
			stack: '2',
			data: [30, 50, 20, 40, 50, 30]
		},
		{
			label: 'Token Released',
			backgroundColor: '#DBEBF4',
			stack: '2',
			data: [10, 15, 5, 20, 30, 24]
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
				stacked: true,
				barThickness: 40
			}
		],
		yAxes: [
			{
				gridLines: { borderDash: [4, 2] },
				stacked: true
			}
		]
	}
};

const Index = props => {
	// const { data } = props;
	// if (data && data.length) {
	// 	_labels = [];
	// 	_data = [];
	// 	for (let d of data) {
	// 		_labels.push(d.name);
	// 		_data.push(d.count);
	// 	}
	// }

	// barData.labels = _labels;
	// barData.datasets[0].data = _data;

	return (
		<div>
			<Card>
				<CardBody>
					<CardTitle>Tokens by project</CardTitle>
					<br />
					<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 400 }}>
						{/* <Bar data={barChartData} options={barChartOptions} /> */}
						<Bar data={barChartData} options={barChartOptions} />
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default Index;
