import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';

let _labels = [];
let _data = [];

let barData = {
  labels: [],
  datasets: [
    {
      label: 'Beneficiaries',
      backgroundColor: '#4fc3f7',
      borderColor: '#4fc3f7',
      data: [],
    },
  ],
};

const Index = (props) => {
  const { data } = props;
  if (data && data.length) {
    _labels = [];
    _data = [];
    for (let d of data) {
      _labels.push(d.name);
      _data.push(d.count);
    }
  }

  barData.labels = _labels;
  barData.datasets[0].data = _data;

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Beneficiaries by project</CardTitle>
          <div
            className="chart-wrapper"
            style={{ width: '100%', margin: '0 auto', height: 350 }}
          >
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                legend: {
                  display: true,
                  labels: {
                    fontFamily: 'Nunito Sans, sans-sarif',
                    fontColor: '#8898aa',
                  },
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: { display: false },
                      ticks: {
                        fontFamily: 'Nunito Sans, sans-sarif',
                        fontColor: '#8898aa',
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: { display: false },
                      ticks: {
                        fontFamily: 'Nunito Sans, sans-sarif',
                        fontColor: '#8898aa',
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
