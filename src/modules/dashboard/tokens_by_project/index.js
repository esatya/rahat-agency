import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

let _data = [];
let _labels = [];

let pieData = {
  labels: _labels,
  datasets: [
    {
      data: _data,
      backgroundColor: [
        '#088A4B',
        '#23b7e5',
        '#0B2161',
        '#2962ff',
        '#fb6340',
        '#2dce89',
        '#4fc3f7',
      ],
      hoverBackgroundColor: [
        '#088A4B',
        '#23b7e5',
        '#0B2161',
        '#2962ff',
        '#fb6340',
        '#2dce89',
        '#4fc3f7',
      ],
    },
  ],
};

export default function Index(props) {
  const { data } = props;
  if (data && data.length) {
    _labels = [];
    _data = [];
    for (let d of data) {
      _labels.push(d.name);
      _data.push(d.token);
    }
    pieData.labels = _labels;
    pieData.datasets[0].data = _data;
  }
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Tokens by project</CardTitle>
          <div
            className="chart-wrapper"
            style={{ width: '100%', margin: '0 auto', height: 350 }}
          >
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                legend: {
                  display: true,
                  labels: {
                    fontFamily: 'Nunito Sans, sans-sarif',
                    fontColor: '#8898aa',
                  },
                },
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
