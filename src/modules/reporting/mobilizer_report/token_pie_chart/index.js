import React from 'react';
import { CardTitle } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

let _data = [];
let _labels = [];

let pieData = {
	labels: _labels,
	datasets: [
		{
			data: _data,
			pointRadius: 1,
			pointHitRadius: 10,
			backgroundColor: ['#80D5AA', '#2b7ec1', '#F7C087'],
			hoverBackgroundColor: ['#80D5AA', '#2b7ec1', '#F7C087'],
			hoverOffset: 100
		}
	]
};

export default function Index(props) {
	const { data ,projectId} = props;

	if (data && data.length) {
		_labels = [];
		_data = [];
		for (let d of data) {
			_labels.push(d.name);
			_data.push(d.count);
		}
		pieData.labels = _labels;
		pieData.datasets[0].data = _data;
	}

	return (
		<div>
			<CardTitle>Token</CardTitle>
			<div className="chart-wrapper" style={{ width: '100%', margin: 10, height: 230 }}>
				{projectId?(<Pie
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
				/>):(	<span
						style={{
							color: '#F7C087'
						}}
					>
						Please select Project
					</span>)}
				
			</div>
		</div>
	);
}
