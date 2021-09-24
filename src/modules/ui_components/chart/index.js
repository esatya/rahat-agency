import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import '../../../assets/css/project.css';
import Chart from 'react-apexcharts';
// import Loading from '../../global/Loading';

//Line chart
const optionssalesummary = {
	chart: {
		id: 'basic-bar',
		type: 'area',
		toolbar: {
			show: false
		}
	},

	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'smooth',
		width: 2
	},
	colors: ['#4fc3f7', '#7460ee'],
	legend: {
		show: false
	},
	markers: {
		size: 3
	},
	xaxis: {
		categories: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		labels: {
			show: true,
			style: {
				colors: ['#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4'],
				fontSize: '12px',
				fontFamily: "'Nunito Sans', sans-serif"
			}
		}
	},
	yaxis: {
		labels: {
			show: true,
			style: {
				colors: ['#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4', '#99abb4'],
				fontSize: '12px',
				fontFamily: "'Nunito Sans', sans-serif"
			}
		}
	},
	grid: {
		borderColor: 'rgba(0,0,0,0.1)',
		xaxis: {
			lines: {
				show: true
			}
		},
		yaxis: {
			lines: {
				show: true
			}
		}
	},
	tooltip: {
		theme: 'dark'
	}
};
const seriessalessummry = [
	{
		name: 'Site A view',
		data: [0, 5, 6, 8, 25, 9, 8, 24]
	},
	{
		name: 'Site B view',
		data: [0, 3, 1, 2, 8, 1, 5, 1]
	}
];

export default function TransactionChart() {
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">Transactions</CardTitle>
					<div className="campaign ct-charts">
						<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 250 }}>
							<Chart options={optionssalesummary} series={seriessalessummry} type="area" height="250" />
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
