import React, { useContext, useState, useEffect } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { UserContext } from '../../../contexts/UserContext';
import { useToasts } from 'react-toast-notifications';

let _data = [];
let _labels = [];

let pieData = {
	labels: _labels,
	datasets: [
		{
			data: _data,
			pointRadius: 1,
			pointHitRadius: 10,
			backgroundColor: ['#245064', '#80D5AA', '#F49786', '#F7C087', '#2b7ec1', '#fb6340', '#527855'],
			hoverBackgroundColor: ['#245064', '#80D5AA', '#F49786', '#F7C087', '#2b7ec1', '#fb6340', '#527855'],
			hoverOffset: 100
		}
	]
};

export default function Chart() {
	const { addToast } = useToasts();

	const { getDashboardStats } = useContext(UserContext);
	const [stats, setStats] = useState({
		totalAllocation: 0,
		redeemedTokens: 0,
		beneficiariesByProject: []
	});

	const fetchDashboardStats = () => {
		getDashboardStats()
			.then(d => {
				setStats(prevState => ({
					...prevState,
					totalAllocation: d.tokenAllocation.totalAllocation,
					redeemedTokens: d.tokenRedemption.totalTokenRedemption,
					beneficiariesByProject: d.beneficiary.project
				}));
			})
			.catch(() => {
				addToast('Internal server error!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(fetchDashboardStats, []);

	const data = stats.beneficiariesByProject;
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
