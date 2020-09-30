import React, { useState, useEffect, useCallback, useContext } from "react";
import { VendorContext } from "../../contexts/VendorContext";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Table,
} from "reactstrap";

const Vendor = (props) => {
  const { addToast } = useToasts();
  const [model, setModel] = useState(false);
  const [issueModel, setIssueModel] = useState(false);
  const [filter, setFilter] = useState("");

  const {
    listVendor,
    list,
    pagination,
    query,
    listAid,
    aid,
    vendor,
    addVendor,
    setVendor,
    issueTokens,
  } = useContext(VendorContext);

  const toggle = () => setModel(!model);
  const toggleIssueModel = (b) => {
    if (b) {
      setVendor(b);
    }
    setIssueModel(!issueModel);
  };

  //List Beneficiary
  let get = useCallback(
    (params) => {
      listVendor(params);
    },
    [listVendor]
  );

  useEffect(() => {
    listVendor({ ...pagination, ...query }).catch((e) =>
      addToast("Something went wrong!", {
        appearance: "error",
        autoDismiss: true,
      })
    );
    listAid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let onSearchName = useCallback(
    (val) => {
      get({ limit: 10, start: 0, name: val, phone: "", aid });
    },
    [aid, get]
  );

  let onSearchPhone = useCallback(
    (val) => {
      get({ limit: 10, start: 0, name: "", phone: val, aid });
    },
    [aid, get]
  );

  const onSearch = (val) => {
    if (!filter.trim().length) return;
    if (filter === "name") {
      onSearchName(val);
    } else if (filter === "phone") {
      onSearchPhone(val);
    }
  };

  const handlePagination = useCallback(
    (current) => {
      let st = current * pagination.limit;
      get({ start: st, limit: pagination.limit, ...query, aid });
    },
    [aid, get, pagination.limit, query]
  );

  return (
    <div className="main">
      <div className="transaction-table-container">
        <Card>
          <CardTitle className="mb-0 p-3 border-bottom bg-light">
            <i className="mdi mdi-border-right mr-2"></i>Vendors List
            <div style={{ float: "right" }}>
              <Button color="info" onClick={(e) => toggle()}>
                Add Vendor
              </Button>
            </div>
          </CardTitle>
          <CardBody>
            <div
              style={{ float: "right", display: "flex", padding: "15px 1px" }}
            >
              <div style={{ display: "flex" }}>
                <Input
                  placeholder="Search..."
                  onChange={(event) => {
                    onSearch(event.target.value);
                  }}
                  style={{ width: "100%" }}
                />

                <CustomInput
                  type="select"
                  id="exampleCustomSelect"
                  name="customSelect"
                  defaultValue=""
                  style={{ width: "auto" }}
                  onChange={(event) => {
                    // clear();
                    setFilter(event.target.value);
                  }}
                >
                  <option value="" disabled>
                    Filter
                  </option>
                  <option value="name">Name</option>
                  <option value="phone">Phone</option>
                </CustomInput>
              </div>
            </div>
            <Table borderless responsive style={{ backgroundColor: "white" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Wallet Address</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {list.length ? (
                  list.map((e, i) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>{e.phone}</td>
                      <td>{e.wallet_address}</td>
                      <td>{e.email}</td>
                      <td>{e.address}</td>
                      <td className="blue-grey-text  text-darken-4 font-medium">
                        <Link
                          className="btn btn-secondary"
                          to={`/vendors/${e._id}`}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}></td>
                    <td>No data available.</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Pagination
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <PaginationItem onClick={(e) => handlePagination(0)}>
                <PaginationLink first href="#" />
              </PaginationItem>
              {[...Array(pagination.page)].map((p, i) => (
                <PaginationItem
                  key={i}
                  active={
                    pagination.start === i * pagination.limit ? true : false
                  }
                  onClick={(e) => handlePagination(i)}
                >
                  <PaginationLink href="#">{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationLink
                  last
                  href="#"
                  onClick={(e) => handlePagination(pagination.page - 1)}
                />
              </PaginationItem>
            </Pagination>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={issueModel} toggle={toggleIssueModel}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            issueTokens(e).then((d) => {
              get();
              toggleIssueModel();
            });
          }}
        >
          <ModalHeader toggle={toggleIssueModel}>
            <div>
              <h3>Issue Tokens</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="form-item">
              <label htmlFor="claimable">Tokens</label>
              <br />
              <Input
                name="claimable"
                type="text"
                defaultValue={vendor.claimable}
                placeholder="Tokens"
                className="form-field"
                required
              />
            </div>
            <br />

            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Submit</Button>

            <Button color="secondary" onClick={toggleIssueModel}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={model} toggle={toggle}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            addVendor(e)
              .then((d) => {
                addToast("Vendor Added Successfully", {
                  appearance: "success",
                  autoDismiss: true,
                });
                get();
                toggle();
              })
              .catch((err) =>
                addToast(err.message, {
                  appearance: "error",
                  autoDismiss: true,
                })
              );
          }}
        >
          <ModalHeader toggle={toggle}>
            <div>
              <h3>Add Vendor</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            {/* <div className="form-item">
              <label htmlFor="aid">Aid</label>
              <br />

              <CustomInput
                type="select"
                id="aid"
                name="aid"
                className="form-field"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  All
                </option>
                {aids.map(e => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </CustomInput>
            </div>
            <br /> */}

            <div className="form-item">
              <label htmlFor="name">Name</label>
              <br />
              <Input
                name="name"
                type="text"
                placeholder="Full Name"
                className="form-field"
                required
              />
            </div>
            <br />

            <div className="form-item">
              <label htmlFor="ethaddress">Wallet Address</label>
              <br />
              <Input
                name="ethaddress"
                type="text"
                placeholder="Wallet Address"
                className="form-field"
                required
              />
            </div>
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridColumnGap: "10px",
              }}
            >
              <div className="form-item">
                <label htmlFor="email">Email</label>
                <br />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="form-field"
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="phone">Phone</label>
                <br />
                <Input
                  name="phone"
                  type="number"
                  placeholder="Phone no"
                  className="form-field"
                  required
                />
              </div>
            </div>
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridColumnGap: "10px",
              }}
            >
              <div className="form-item">
                <label htmlFor="address">Address</label>
                <br />
                <Input
                  name="address"
                  type="text"
                  placeholder="Your Address"
                  className="form-field"
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="govt_id">Government Id</label>
                <br />
                <Input
                  name="govt_id"
                  type="text"
                  placeholder="Govt Id"
                  className="form-field"
                  required
                />
              </div>
            </div>
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Submit</Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <br />
    </div>
  );
};

export default Vendor;
