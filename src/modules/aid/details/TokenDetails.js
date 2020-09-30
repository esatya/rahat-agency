import React, { useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

import { AidContext } from "../../../contexts/AidContext";
import { AppContext } from "../../../contexts/AppSettingsContext";
import { useToasts } from "react-toast-notifications";

export default function TokenDetails(props) {
  const { getAidBalance, getProjectCapital } = useContext(AidContext);
  const { appSettings } = useContext(AppContext);
  const { addToast } = useToasts();

  const projectId = props.aidId;

  const [availableBalance, setAvailableBalance] = useState(null);
  const [projectCapital, setProjectCapital] = useState(null);

  const pieData = {
    labels: ["Available Tokens", "Used Tokens"],
    datasets: [
      {
        data: [availableBalance, projectCapital - availableBalance],
        backgroundColor: ["#2dce89", "#5e72e4", "#23b7e5"],
        hoverBackgroundColor: ["#2dce89", "#5e72e4", "#23b7e5"],
      },
    ],
  };

  const loadProjectCapital = () => {
    const { rahat_admin } = appSettings.agency.contracts;
    getProjectCapital(projectId, rahat_admin)
      .then((d) => {
        setProjectCapital(d);
      })
      .catch(() => {
        addToast("Internal server error.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const loadBalance = () => {
    if (appSettings && appSettings.agency) {
      const { rahat_admin } = appSettings.agency.contracts;
      getAidBalance(projectId, rahat_admin)
        .then((d) => {
          setAvailableBalance(d);
          loadProjectCapital(projectId, rahat_admin);
        })
        .catch();
    }
  };

  useEffect(loadBalance, []);

  return (
    <>
      <div style={{ margin: 5 }}>
        <h4>
          <span className="ml-3 badge badge-dark">
            Project Capital : {projectCapital || 0}
          </span>
        </h4>
      </div>
      <div
        className="chart-wrapper"
        style={{ width: "100%", margin: "0 auto", height: 350 }}
      >
        <Pie
          data={pieData}
          options={{
            maintainAspectRatio: false,
            legend: {
              display: true,
              labels: {
                fontFamily: "Nunito Sans, sans-sarif",
                fontColor: "#8898aa",
              },
            },
          }}
        />
      </div>
    </>
  );
}
