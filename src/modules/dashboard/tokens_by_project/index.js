import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';

import { ExportToExcel } from '../../global/ExportToExcel';

const barChartData = {
	datasets: [
		{
			label: 'Tokens Allocated',
			backgroundColor: '#2B7EC1',
			stack: '2'
		}
		// {
		// 	label: 'Token Released',
		// 	backgroundColor: '#DBEBF4',
		// 	stack: '2',
		// 	data: [10, 15, 5, 20, 30, 24]
		// }
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
	let { data, exportData } = props;

	let bar_labels = [];
	let bar_data = [];
	if (data.length > 5) data = data.slice(0, 5)
	if (data && data.length) {
		bar_labels = [];
		for (let d of data) {
			bar_labels.push(d.name);
			bar_data.push(d.token);
		}
	}

	barChartData.labels = bar_labels;
	barChartData.datasets[0].data = bar_data;

	return (
		<div>
			<Card>
				<CardBody>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle>Tokens by project</CardTitle>
						<div>
							{exportData.length ? <ExportToExcel apiData={exportData} fileName="Tokens-by-project-report.xlsx" /> : ''}
						</div>
					</div>
					<br />
					<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 420 }}>
						{/* <Bar data={barChartData} options={barChartOptions} /> */}
						<Bar data={barChartData} options={barChartOptions} />
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default Index;
