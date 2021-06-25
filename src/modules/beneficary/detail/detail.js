import React, { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Button,
  Table,
  FormGroup,
  Label,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import Swal from "sweetalert2";

import { BeneficiaryContext } from "../../../contexts/BeneficiaryContext";
import { AppContext } from "../../../contexts/AppSettingsContext";
import profilePhoto from "../../../assets/images/users/1.jpg";
import UnlockWallet from '../../global/walletUnlock';


export default function DetailsForm(props) {
  const { addToast } = useToasts();
  const [tokenBalance, setTokenBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [inputTokens, setInputTokens] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [availableBalance, setAvailableBalance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [passcodeModal, setPasscodeModal] = useState(false);


  const beneficiaryId = props.params.id;

  const togglePasscodeModal = () => setPasscodeModal(!passcodeModal);


  const {
    issueTokens,
    beneficiary_detail,
    getBeneficiaryDetails,
    getBeneficiaryBalance,
    listAid,
    getAvailableBalance,
  } = useContext(BeneficiaryContext);

  const { appSettings,isVerified } = useContext(AppContext);

  const handleTokenChange = (e) => {
    setInputTokens(e.target.value);
  };

  const handleSelectProject = async (e) => {
    try {
      setLoading(true);
      setSelectedProject(e.value);
      //const { rahat_admin } = appSettings.agency.contracts;
      let d = await getAvailableBalance(e.value);
      setAvailableBalance(d);
      setShowAlert(true);
      setLoading(false);
    } catch {
      setShowAlert(false);
      addToast("Failed to fetch availabe balance!", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  const handleIssueToken = (e) => {
    e.preventDefault();
    if (!selectedProject || !inputTokens) {
      Swal.fire({
        icon: 'error',
        title: 'Attention',
        text: 'Project and input token is required!',
      })
      return;
    }
    if (inputTokens > availableBalance) {
      Swal.fire({
        icon: 'error',
        title: 'Attention',
        text: 'Input balance can not be greater than available balance!',
      })
      return;
    }
     togglePasscodeModal()
  };

  const submitIssueTokenDetails = () => {
    if (!isVerified) return;
    const payload = {
      claimable: +inputTokens,
      phone: +beneficiary_detail.phone,
      projectId: selectedProject,
    };
    setLoading(true);
    issueTokens(payload)
      .then(() => {
        toggleModal();
        addToast(`${payload.claimable} tokens assigned to beneficiary.`, {
          appearance: "success",
          autoDismiss: true,
        });
        getBalance(payload.phone);
        setLoading(false);
        resetTokenIssueForm();
      })
      .catch((err) => {
        addToast(err.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const toggleModal = () => {
    setModal((prevState) => !prevState);
    resetTokenIssueForm();
  };

  const resetTokenIssueForm = () => {
    setInputTokens(null);
    setAvailableBalance("");
    setSelectedProject(null);
    setShowAlert(false);
  };

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

  const fetchProjectList = () => {
    listAid()
      .then((d) => {
        sanitizeProjectOptions(d.data);
      })
      .catch(() => {
        addToast("Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const sanitizeProjectOptions = (data) => {
    let options = [];
    if (data && data.length) {
      for (let d of data) {
        let obj = {};
        obj.value = d._id;
        obj.label = d.name;
        options.push(obj);
      }
      setProjectOptions(options);
      return;
    }
    setProjectOptions(options);
  };

  useEffect(fetchProjectList, []);
  useEffect(loadBeneficiaryDetails, []);
  useEffect(submitIssueTokenDetails, [isVerified]);

  const contractAddress =
    appSettings && appSettings.agency ? appSettings.agency.contracts.rahat : "";

  return (
    <>
        <UnlockWallet open={passcodeModal} onClose={e => setPasscodeModal(e)}></UnlockWallet>

      <Modal isOpen={modal} toggle={toggleModal.bind(null)}>
        <ModalHeader toggle={toggleModal.bind(null)}>Issue Token</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Project *</Label>
            <Select
              onChange={handleSelectProject}
              closeMenuOnSelect={true}
              defaultValue={[]}
              options={projectOptions}
              placeholder="--Select Project--"
            />
            <br />
            <Label>Tokens *</Label>
            <InputGroup>
              <Input
                type="number"
                name="tokens"
                placeholder="Enter number of tokens"
                onChange={handleTokenChange}
                value={inputTokens || ""}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            {showAlert && availableBalance > 0 ? (
              <div className="alert alert-success fade show" role="alert">
                Availabe Balance: {availableBalance}
              </div>
            ) : showAlert ? (
              <div>
                <div className="alert alert-warning fade show" role="alert">
                  <p>
                    Project has ZERO balance.{" "}
                    <Link to={`/projects/${selectedProject}`}>
                      You can add here.
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {loading ? (
            <>
              <div
                role="status"
                className="spinner-border-sm spinner-border text-secondary"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </>
          ) : (
            <>
              {availableBalance && availableBalance > 0 ? (
                <>
                  <Button
                    onClick={handleIssueToken}
                    type="button"
                    color="primary"
                  >
                    Submit
                  </Button>
                  <Button color="secondary" onClick={toggleModal.bind(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                ""
              )}
            </>
          )}
        </ModalFooter>
      </Modal>
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <div>
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
                  <div className="ml-auto">
                    <Button type="button" color="primary" onClick={toggleModal}>
                      Issue Token
                    </Button>
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
      </Row>
    </>
  );
}
