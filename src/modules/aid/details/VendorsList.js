import React, { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import {
  Input,
  Card,
  CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { AidContext } from "../../../contexts/AidContext";

export default function VendorList(props) {
  const { aidId } = props;
  const { addToast } = useToasts();
  const [search, setSearch] = useState("");
  const { vendorsByAid, vendors_list, vendor_pagination } = useContext(
    AidContext
  );

  const searchByPhone = (e) => {
    let { value } = e.target;
    setSearch(value);
    if (value) {
      loadVendorsByAId({ phone: value });
    } else {
      loadVendorsByAId();
    }
  };

  const handlePagination = (current_page) => {
    let _start = current_page * vendor_pagination.limit - 1;
    return loadVendorsByAId({ start: _start, limit: vendor_pagination.limit });
  };

  const loadVendorsByAId = (query) => {
    if (!query) query = null;
    vendorsByAid(aidId, query)
      .then()
      .catch(() => {
        addToast("Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(loadVendorsByAId, []);

  return (
    <>
      <div className="card-body">
        <Card>
          <CardBody>
            <ReactTable
              columns={[
                {
                  Header: "Name",
                  accessor: "name",
                  filterable: false,
                },
                {
                  Header: "Eth Address",
                  accessor: "eth_address",
                  sortable: false,
                  filterable: false,
                },
                {
                  Header: "Phone",
                  accessor: "phone",
                  sortable: false,
                  Filter: () => {
                    return (
                      <Input
                        placeholder="Search by phone..."
                        onChange={searchByPhone}
                        style={{ width: "100%" }}
                        value={search}
                      />
                    );
                  },
                },
              ]}
              minRows={2}
              pageSize={vendor_pagination.limit}
              className="-striped -highlight"
              showPaginationBottom={false}
              data={vendors_list}
              filterable
            />

            {vendor_pagination.totalPages > 1 ? (
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
                {[...Array(vendor_pagination.totalPages)].map((p, i) => (
                  <PaginationItem
                    key={i}
                    active={
                      vendor_pagination.currentPage === i + 1 ? true : false
                    }
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
                    onClick={() =>
                      handlePagination(vendor_pagination.totalPages)
                    }
                  />
                </PaginationItem>
              </Pagination>
            ) : (
              ""
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
