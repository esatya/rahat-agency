import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CardTitle } from 'reactstrap';
import Loading from '../../../global/Loading';

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
				// stacked: true,
				barThickness: 40
			}
		],
		yAxes: [
			{
				gridLines: { borderDash: [4, 2] }
				// stacked: true
			}
		]
	}
};

const Index = props => {
	const { data, fetching } = props;

	const barChartData = {
		datasets: [
			{
				label: 'Beneficiaries',
				backgroundColor: '#2B7EC1',
				stack: '2'
			}
		]
	};

	let bar_labels = [];
	let bar_data = [];

	if (data && data.length) {
		bar_labels = [];
		for (let d of data) {
			bar_labels.push(d.name);
			bar_data.push(d.count);
		}
	}

	barChartData.labels = bar_labels;
	barChartData.datasets[0].data = bar_data;

	const sum = bar_data.reduce((a, b) => a + b, 0);

	return (
		<div>
			<CardTitle>Beneficiary by project</CardTitle>
			<br />
			<div
				className="chart-wrapper"
				style={{
					width: '100%',
					margin: '0 auto',
					height: 420,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{fetching ? (
					<Loading />
				) : sum > 0 ? (
					<Bar data={barChartData} options={barChartOptions} />
				) : (
					<span
						style={{
							color: '#F7C087'
						}}
					>
						No data
					</span>
				)}
			</div>
		</div>
	);
};

export default Index;
