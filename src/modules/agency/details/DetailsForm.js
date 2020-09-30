import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";

import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import { AgencyContext } from "../../../contexts/AgencyContext";
import Loading from "../../global/Loading";

export default function DetailsForm(props) {
  const agencyId = props.params.id;
  const { addToast } = useToasts();
  const {
    loading,
    agency_details,
    setLoading,
    resetLoading,
    getAgencyDetails,
    approveAgency,
  } = useContext(AgencyContext);

  const [tokenPayload, settokenPayload] = useState({
    name: "",
    symbol: "",
    supply: "",
    wallet_address: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!tokenPayload.wallet_address) {
      return addToast("Wallet address is required!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.value) {
        approveAndDeploy();
      }
    });
  };

  const approveAndDeploy = () => {
    setLoading();
    approveAgency(agencyId)
      .then(() => {
        resetLoading();
        Swal.fire("Approved!", "Token deployed successfully.", "success");
        loadAgencyDetails();
      })
      .catch((err) => {
        addToast("Something went wrong on server!", {
          appearance: "error",
          autoDismiss: true,
        });
        resetLoading();
      });
  };

  const loadAgencyDetails = () => {
    getAgencyDetails(agencyId)
      .then((d) => {
        const { token } = d.agency;
        settokenPayload({
          name: token.name || "",
          symbol: token.symbol || "",
          supply: token.supply || "",
          wallet_address: d.agency.wallet_address,
        });
      })
      .catch(() => {
        addToast("Something went wrong on server!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(loadAgencyDetails, []);

  return (
    <>
      <Row>
        <Col md="6">
          <Card>
            <CardTitle className="bg-light border-bottom p-3 mb-0">
              <i className="mdi mdi-book mr-2"></i>Agency Details.
            </CardTitle>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label>Agency Name</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="name"
                      value={agency_details ? agency_details.name : ""}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Address</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="address"
                      value={
                        agency_details && agency_details.address
                          ? agency_details.address
                          : ""
                      }
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Email Address</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="email"
                      name="email"
                      value={
                        agency_details && agency_details.email
                          ? agency_details.email
                          : "N/A"
                      }
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Wallet Address</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="wallet_address"
                      value={
                        agency_details ? agency_details.wallet_address : ""
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card>
            <CardTitle className="bg-light border-bottom p-3 mb-0">
              <i className="mdi mdi-book mr-2"></i>Token Details.
            </CardTitle>
            <CardBody>
              <Form onSubmit={handleFormSubmit}>
                <FormGroup>
                  <Label>Token Name</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ti-ticket"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      name="name"
                      value={tokenPayload.name}
                      readOnly
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Token Symbol</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ti-marker"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      name="symbol"
                      value={tokenPayload.symbol}
                      readOnly
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Supply</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ti-spray"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      name="supply"
                      value={tokenPayload.supply}
                      readOnly
                      required
                    />
                  </InputGroup>
                </FormGroup>

                <div className="border-top pt-3 mt-3">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div style={{ marginTop: 20, marginBottom: 10 }}>
                      <Button type="submit" className="btn btn-success mr-2">
                        Approve and Deploy
                      </Button>
                      <Link to="/agency" className="btn btn-dark">
                        Cancel
                      </Link>
                    </div>
                  )}
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
