import React, { useContext, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { OnboardContext } from "../../contexts/OnboardContext";
import { useToasts } from "react-toast-notifications";

const List = (props) => {
  const { data, list, issue, pagination, query } = useContext(OnboardContext);
  const { addToast } = useToasts();

  useEffect(() => {
    list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePagination = useCallback(
    (current) => {
      let st = current * pagination.limit;
      list({ start: st, limit: pagination.limit, ...query });
    },
    [list, pagination.limit, query]
  );

  return (
    <Card>
      <CardTitle className="mb-0 p-3 border-bottom bg-light">
        <i className="mdi mdi-border-right mr-2"></i>Onboard List
      </CardTitle>
      <CardBody
        style={{
          display: "grid",
          gridTemplateColumns: "auto 200px",
          columnGap: "10px",
        }}
      >
        <div>
          <Table
            borderless
            style={{ backgroundColor: "white", textAlign: "center" }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e, i) => (
                <tr key={e._id}>
                  <td>{`${e.name.first} ${e.name.last}`}</td>
                  <td>
                    {e.comms && e.comms.length ? e.comms[0].address : "N/A"}
                  </td>
                  <td>
                    <Button
                      color={e.issued ? "danger" : "info"}
                      onClick={(event) =>
                        issue(e._id, !e.issued)
                          .then((d) => {
                            list();
                            if (!e.issued) {
                              addToast("Issued Successfully", {
                                appearance: "success",
                                autoDismiss: true,
                              });
                            } else {
                              addToast("Removed Successfully", {
                                appearance: "error",
                                autoDismiss: true,
                              });
                            }
                          })
                          .catch((err) => {
                            addToast(err.message, {
                              appearance: "error",
                              autoDismiss: true,
                            });
                          })
                      }
                    >
                      {e.issued ? "Remove" : "Issue"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <PaginationItem
              disabled={pagination.page > 1 ? false : true}
              onClick={(e) => handlePagination(0)}
            >
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
            <PaginationItem disabled={pagination.page > 1 ? false : true}>
              <PaginationLink
                last
                href="#"
                onClick={(e) => handlePagination(pagination.page - 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
      </CardBody>
    </Card>
  );
};

export default List;
