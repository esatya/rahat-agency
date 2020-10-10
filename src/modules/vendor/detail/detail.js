import React, { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  ButtonGroup,
  Button,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";

import { VendorContext } from "../../../contexts/VendorContext";
import { AppContext } from "../../../contexts/AppSettingsContext";
import profilePhoto from "../../../assets/images/users/1.jpg";

export default function DetailsForm(props) {
  const vendorId = props.params.id;
  const { addToast } = useToasts();
  const {
    vendor,
    getVendorDetails,
    approveVendor,
    changeVendorStatus,
    getVendorBalance,
  } = useContext(VendorContext);
  const { appSettings } = useContext(AppContext);
  const [vendorBalance, setVendorBalance] = useState("");

  const loadVendorDetails = () => {
    getVendorDetails(vendorId)
      .then((d) => {
        getBalance(d.wallet_address);
      })
      .catch(() => {
        addToast("Something went wrong on server!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const getBalance = async (wallet) => {
    if (appSettings && appSettings.agency) {
      try {
        const { token } = appSettings.agency.contracts;
        let d = await getVendorBalance(token, wallet);
        setVendorBalance(d);
      } catch {
        addToast("Invalid vendor wallet address!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  const handleChangeStatus = async (status) => {
    let swal = await Swal.fire({
      title: "Are you sure?",
      text: `Vendor will be marked as ${status}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });
    if (swal.isConfirmed) {
      try {
        await changeVendorStatus(vendorId, status);
        addToast(`Vendor marked as ${status}`, {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (e) {
        addToast("Something went wrong on server!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  useEffect(loadVendorDetails, []);

  const handleVendorApprove = async (e) => {
    e.preventDefault();
    let contract_addr = appSettings.agency.contracts.rahat;
    let wallet = vendor.wallet_address;
    let payload = {
      status: "active",
      wallet_address: wallet,
      contract_address: contract_addr,
    };
    try {
      let swal = await Swal.fire({
        title: "Are you sure?",
        text: `You want to approve this vendor!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      });
      if (swal.isConfirmed) {
        await approveVendor(vendorId, payload);
        addToast("Vendor approved successfully.", {
          appearance: "success",
          autoDismiss: true,
        });
      }
    } catch {
      addToast("Invalid vendor wallet address!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const vendor_status =
    vendor && vendor.agencies ? vendor.agencies[0].status : "new";

  return (
    <>
      <Row>
        <Col md="12">
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
                      {vendor ? vendor.name : ""}
                    </h5>
                    <p className="mb-0">
                      Current balance: {vendorBalance || 0}
                    </p>
                  </div>
                  <div className="ml-auto" style={{padding:5}}>
                  {vendor_status !== "new" ? (
                    <ButtonGroup>
                      <Button
                        onClick={() => handleChangeStatus("active")}
                        disabled={vendor_status === "suspended" ? false : true}
                        color="success"
                      >
                        Activate
                      </Button>
                      <Button
                        onClick={() => handleChangeStatus("suspended")}
                        disabled={vendor_status === "active" ? false : true}
                        color="danger"
                      >
                        Suspend
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Button
                      onClick={handleVendorApprove}
                      className="btn"
                      color="info"
                    >
                      Approve
                    </Button>
                  )}
                  </div>
                </div>
                <div className="details-table px-4">
                  <Table responsive borderless size="sm" className="mt-4">
                    <tbody>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Status</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="status"
                            id="status"
                            defaultValue={
                              vendor && vendor.agencies
                                ? vendor.agencies[0].status
                                : ""
                            }
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold">Phone</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="phone"
                            id="phone"
                            defaultValue={vendor ? vendor.phone : ""}
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
                            defaultValue={vendor ? vendor.email : ""}
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
                            defaultValue={vendor ? vendor.govt_id : ""}
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
                            defaultValue={vendor ? vendor.wallet_address : ""}
                          />
                        </td>
                      </tr>
                      <tr className="d-flex">
                        <td className="col-3 font-bold"> Address</td>
                        <td className="col-9">
                          <Input
                            readOnly
                            type="text"
                            name="address"
                            id="address"
                            defaultValue={
                              vendor && vendor.address ? vendor.address : ""
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
      </Row>
    </>
  );
}
