import React, { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
} from "reactstrap";

import { BeneficiaryContext } from "../../../contexts/BeneficiaryContext";
import { AppContext } from "../../../contexts/AppSettingsContext";
import profilePhoto from "../../../assets/images/users/1.jpg";

export default function DetailsForm(props) {
  const { addToast } = useToasts();
  const [tokenBalance, setTokenBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const beneficiaryId = props.params.id;
  const aidName = props.params.aid;
  const projectId = props.params.project_id;

  const {
    issueTokens,
    beneficiary_detail,
    getBeneficiaryDetails,
    getBeneficiaryBalance,
  } = useContext(BeneficiaryContext);

  const { appSettings } = useContext(AppContext);

  const getBalance = (phone) => {
    getBeneficiaryBalance(+phone, contractAddress)
      .then((bal) => {
        setTokenBalance(bal);
      })
      .catch(() => {
        addToast("Internal server error!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const loadBeneficiaryDetails = () => {
    getBeneficiaryDetails(beneficiaryId)
      .then((d) => {
        getBalance(d.phone);
      })
      .catch(() => {
        addToast("Internal server error!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(loadBeneficiaryDetails, []);

  const contractAddress =
    appSettings && appSettings.agency ? appSettings.agency.contracts.rahat : "";

  return (
    <>
      <Row>
        <Col md="6">
          <Card>
            <CardBody>
              <div className="">
                <div className="d-flex align-items-center p-4 border-bottom">
                  <div className="mr-3">
                    <img
                      src={profilePhoto}
                      alt="user"
                      className="rounded-circle"
                      width="50"
                    />
                  </div>
                  <div>
                    <h5 className="message-title mb-0">
                      {beneficiary_detail ? beneficiary_detail.name : ""}
                    </h5>
                    <p className="mb-0">Current balance: {tokenBalance}</p>
                  </div>
                </div>
                <div className="details-table px-4">
                  <Table responsive borderless size="sm" className="mt-4">
                    <tbody>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Phone</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="phone"
                            id="phone"
                            defaultValue={
                              beneficiary_detail ? beneficiary_detail.phone : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Email</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="email"
                            id="email"
                            defaultValue={
                              beneficiary_detail ? beneficiary_detail.email : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Government ID</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="govt_id"
                            id="govt_id"
                            defaultValue={
                              beneficiary_detail
                                ? beneficiary_detail.govt_id
                                : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Wallet Address</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="wallet_address"
                            id="wallet_address"
                            defaultValue={
                              beneficiary_detail
                                ? beneficiary_detail.wallet_address
                                : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Permanent Address</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="address"
                            id="address"
                            defaultValue={
                              beneficiary_detail
                                ? beneficiary_detail.address
                                : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Temporary Address</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="phone"
                            id="phone"
                            defaultValue={
                              beneficiary_detail &&
                              beneficiary_detail.address_temporary
                                ? beneficiary_detail.address_temporary
                                : ""
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card style={{ minHeight: 445 }}>
            <CardTitle className="bg-light border-bottom p-3 mb-0">
              <i className="mdi mdi-book mr-2"></i>Issue Token for {aidName}.
            </CardTitle>
            <Form
              onSubmit={(e) => {
                let form = e.target;
                e.preventDefault();
                setLoading(true);
                issueTokens(e, projectId, contractAddress)
                  .then((d) => {
                    addToast(`${d.claimable} tokens assigned to beneficiary.`, {
                      appearance: "success",
                      autoDismiss: true,
                    });
                    getBalance(d.phone);
                    setLoading(false);
                    form.reset();
                  })
                  .catch((err) => {
                    addToast(err.message, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  });
              }}
            >
              <CardBody>
                <div className="form-item">
                  <label htmlFor="claimable">Tokens</label>
                  <br />
                  <Input
                    name="claimable"
                    type="number"
                    placeholder="Enter number of tokens."
                    className="form-field"
                    required
                  />
                </div>
                <br />
                {loading ? (
                  "Deploying token, please wait..."
                ) : (
                  <Button color="primary">Issue Token</Button>
                )}
              </CardBody>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
