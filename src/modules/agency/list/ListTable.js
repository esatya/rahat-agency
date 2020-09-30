import React, { useContext, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { AgencyContext } from "../../../contexts/AgencyContext";

export default function AgencyList() {
  const { addToast } = useToasts();
  const { listAgency, agency, pagination } = useContext(AgencyContext);

  const handlePagination = (current_page) => {
    let _start = current_page * pagination.limit - 1;
    return loadAgencyList({ start: _start, limit: pagination.limit });
  };

  const loadAgencyList = (query) => {
    if (!query) query = null;
    listAgency(query)
      .then()
      .catch(() => {
        addToast("Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(loadAgencyList, []);
  return (
    <>
      <Card>
        <CardTitle className="mb-0 p-3 border-bottom bg-light">
          <Row>
            <Col md="10">
              <i className="mdi mdi-border-right mr-2"></i>Agency List
            </Col>
            <Col md="2"></Col>
          </Row>
        </CardTitle>
        <CardBody>
          <Table className="no-wrap v-middle" responsive>
            <thead>
              <tr className="border-0">
                <th className="border-0">Name</th>
                <th className="border-0">Address</th>
                <th className="border-0">Status</th>
                <th className="border-0">Action</th>
              </tr>
            </thead>
            <tbody>
              {agency.length ? (
                agency.map((d) => {
                  return (
                    <tr key={d._id}>
                      <td>{d.name}</td>
                      <td>{d.address || "n/a"}</td>
                      <td>
                        {d.is_approved === true ? (
                          <span className="ml-3 badge badge-success">
                            Approved
                          </span>
                        ) : (
                          <span className="ml-3 badge badge-danger">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="blue-grey-text  text-darken-4 font-medium">
                        <Link
                          className="btn btn-secondary"
                          to={`/agency-details/${d._id}`}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2}></td>
                  <td>No data available.</td>
                </tr>
              )}
            </tbody>
          </Table>
          {pagination.totalPages > 1 ? (
            <Pagination
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <PaginationItem>
                <PaginationLink
                  first
                  href="#first_page"
                  onClick={() => handlePagination(1)}
                />
              </PaginationItem>
              {[...Array(pagination.totalPages)].map((p, i) => (
                <PaginationItem
                  key={i}
                  active={pagination.currentPage === i + 1 ? true : false}
                  onClick={() => handlePagination(i + 1)}
                >
                  <PaginationLink href={`#page=${i + 1}`}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationLink
                  last
                  href="#last_page"
                  onClick={() => handlePagination(pagination.totalPages)}
                />
              </PaginationItem>
            </Pagination>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
    </>
  );
}
