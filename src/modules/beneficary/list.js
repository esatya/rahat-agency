import React, { useState, useEffect, useCallback, useContext } from "react";
import { BeneficiaryContext } from "../../contexts/BeneficiaryContext";
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
  Table,
  Form,
  // Spinner
} from "reactstrap";

const Beneficiary = (props) => {
  const { addToast } = useToasts();
  const [model, setModel] = useState(false);
  const [filter, setFilter] = useState("");
  // const [spin, setSpin] = useState(false);

  const {
    listBeneficiary,
    list,
    pagination,
    query,
    listAid,
    aids,
    aid,
    addBeneficiary,
    setAid,
    // importBeneficiary
  } = useContext(BeneficiaryContext);

  const toggle = () => setModel(!model);

  //List Beneficiary
  let get = useCallback(
    (params) => {
      listBeneficiary(params);
    },
    [listBeneficiary]
  );

  useEffect(() => {
    listBeneficiary({ ...pagination, ...query });
    listAid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let onSearchName = useCallback(
    (val) => {
      get({
        limit: 10,
        start: 0,
        name: val,
        phone: "",
        aid: aid ? aid._id : "",
      });
    },
    [aid, get]
  );

  let onSearchPhone = useCallback(
    (val) => {
      get({
        limit: 10,
        start: 0,
        name: "",
        phone: val,
        aid: aid ? aid._id : "",
      });
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
      get({
        start: st,
        limit: pagination.limit,
        ...query,
        aid: aid ? aid._id : "",
      });
    },
    [aid, get, pagination.limit, query]
  );

  return (
    <div className="main">
      <div className="transaction-table-container">
        <Card>
          <CardTitle className="mb-0 p-3 border-bottom bg-light">
            <i className="mdi mdi-border-right mr-2"></i>Beneficiary List
            <div style={{ float: "right" }}>
              <Button color="info" onClick={(e) => toggle()}>
                Add Beneficiary
              </Button>
              {/* <Button
                color="info"
                onClick={event => {
                  event.preventDefault();
                  setSpin(true);
                  importBeneficiary()
                    .then(d => {
                      setSpin(false);
                      addToast("Imported successfully", {
                        appearance: "success",
                        autoDismiss: true
                      });
                      get();
                    })
                    .catch(err => {
                      setSpin(false);
                      addToast(err.message, {
                        appearance: "error",
                        autoDismiss: true
                      });
                    });
                }}
              >
                {spin ? <Spinner size="sm" /> : ""} Import Beneficiary
              </Button> */}
            </div>
          </CardTitle>
          <CardBody>
            <div
              style={{ float: "right", display: "flex", padding: "15px 1px" }}
            >
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                defaultValue=""
                style={{ width: "auto" }}
                onChange={(event) => {
                  // clear();
                  get({
                    limit: 10,
                    start: 0,
                    name: "",
                    phone: "",
                    aid: event.target.value,
                  });

                  setAid({
                    name:
                      event.target.options[event.target.selectedIndex].label,
                    _id: event.target.value,
                  });
                }}
              >
                <option value="">All</option>
                {aids.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </CustomInput>
              <div style={{ display: "inline-flex" }}>
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
            {aid && aid._id ? (
              <Table borderless style={{ backgroundColor: "white" }} responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length ? (
                    list.map((e, i) => (
                      <tr key={e._id}>
                        <td>{e.name}</td>
                        <td>{e.phone}</td>
                        <td>{e.email}</td>
                        <td>{e.address}</td>
                        <td>
                          <div>
                            <Link
                              className="btn btn-secondary"
                              to={`/beneficiaries/${e._id}/${aid.name}/${aid._id}`}
                            >
                              Details
                            </Link>
                          </div>
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
            ) : (
              <Table borderless responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
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
                        <td>{e.email}</td>
                        <td>{e.address}</td>
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
            )}

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

      <Modal isOpen={model} toggle={toggle}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            addBeneficiary(e)
              .then((d) => {
                addToast("Beneficiary Added successfully", {
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
              <h3>Add Beneficiary</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridColumnGap: "10px",
              }}
            >
              <div className="form-item">
                <label htmlFor="aid">Project</label>
                <br />

                <CustomInput
                  type="select"
                  id="aid"
                  name="aid"
                  defaultValue=""
                  className="form-field"
                  required
                >
                  <option value="" disabled>
                    All
                  </option>
                  {aids.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </CustomInput>
              </div>
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
                <label htmlFor="wallet_address">Wallet Address</label>
                <br />
                <Input
                  name="wallet_address"
                  type="text"
                  placeholder="Wallet Address"
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
                <label htmlFor="address_temporary">Temporary Address</label>
                <br />
                <Input
                  name="address_temporary"
                  type="text"
                  placeholder="Your temp Address"
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

export default Beneficiary;
