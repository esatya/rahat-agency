import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardBody, CardTitle } from "reactstrap";

const barData = {
  labels: [
    "Humla Rahat",
    "Jumla Rahat",
    "Covid Rahat",
    "Solukhumbu Landslide Rahat",
    "Flood Victims Help",
    "Remote Child Education",
  ],
  datasets: [
    {
      label: "Beneficiaries",
      backgroundColor: "#4fc3f7",
      borderColor: "#4fc3f7",
      data: [20, 60, 55, 75, 80, 100],
    },
  ],
};

const Index = () => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>Beneficiaries by project</CardTitle>
          <div
            className="chart-wrapper"
            style={{ width: "100%", margin: "0 auto", height: 350 }}
          >
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                legend: {
                  display: true,
                  labels: {
                    fontFamily: "Nunito Sans, sans-sarif",
                    fontColor: "#8898aa",
                  },
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: { display: false },
                      ticks: {
                        fontFamily: "Nunito Sans, sans-sarif",
                        fontColor: "#8898aa",
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: { display: false },
                      ticks: {
                        fontFamily: "Nunito Sans, sans-sarif",
                        fontColor: "#8898aa",
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
