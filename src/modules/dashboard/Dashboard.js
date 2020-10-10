import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { useToasts } from "react-toast-notifications";

import AgencyTokens from "./allocated_tokens";
import TotalStats from "./total_stats";
import BeneficiaryStats from "./beneficiary_stats";

import { UserContext } from '../../contexts/UserContext'

const Dashboard = () => {
  const { addToast } = useToasts();

  const {getDashboardStats} = useContext(UserContext)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVendors: 0,
    totalBeneficiaries: 0,
    totalAllocation: 0,
    beneficiariesByProject: []
  })

  const fetchDashboardStats = () => {
    getDashboardStats()
    .then(d => {
      setStats(prevState => ({
        ...prevState, 
        totalProjects: d.projectCount,
        totalVendors: d.vendorCount,
        totalBeneficiaries: d.beneficiary.totalCount,
        totalAllocation: d.tokenAllocation.totalAllocation,
        beneficiariesByProject: d.beneficiary.project
      }));
    })
    .catch(() => {
      addToast("Internal server error!", {
        appearance: "error",
        autoDismiss: true,
      });
    })
  }

  useEffect(fetchDashboardStats,[])

  return (
    <>
      <Row>
        <Col md="4">
          <AgencyTokens allocatedTokens={stats.totalAllocation} />
        </Col>
        <Col md="8">
          <TotalStats vendors={stats.totalVendors} projects={stats.totalProjects} beneficiaries={stats.totalBeneficiaries} />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <BeneficiaryStats data={stats.beneficiariesByProject} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
