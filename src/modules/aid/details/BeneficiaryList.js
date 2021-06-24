import React, { useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

import {
  Table,
  Card,
  CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

import { AidContext } from '../../../contexts/AidContext';

export default function BeneficiaryList(props) {
  const { aidId } = props;
  const { addToast } = useToasts();
  // const [search, setSearch] = useState("");
  const {
    beneficiaryByAid,
    beneficiary_list,
    beneficiary_pagination,
  } = useContext(AidContext);

  // const searchByPhone = (e) => {
  //   let { value } = e.target;
  //   setSearch(value);
  //   if (value) {
  //     loadBeneficiaryByAid({ phone: value });
  //   } else {
  //     loadBeneficiaryByAid();
  //   }
  // };

  const handlePagination = (current_page) => {
    let _start = (current_page - 1) * beneficiary_pagination.limit;

    return loadBeneficiaryByAid({
      start: _start,
      limit: beneficiary_pagination.limit,
    });
  };

  const loadBeneficiaryByAid = (query) => {
    if (!query) query = null;
    beneficiaryByAid(aidId, query)
      .then()
      .catch(() => {
        addToast('Something went wrong!', {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  useEffect(loadBeneficiaryByAid, []);

  return (
    <>
      <div className="card-body">
        <Card>
          <CardBody>
            <Table className="no-wrap v-middle" responsive>
              <thead>
                <tr className="border-0">
                  <th className="border-0">Name</th>
                  <th className="border-0">Phone</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Address</th>
                </tr>
              </thead>
              <tbody>
                {beneficiary_list.length ? (
                  beneficiary_list.map((d) => {
                    return (
                      <tr key={d._id}>
                        <td>{d.name}</td>
                        <td>{d.phone}</td>
                        <td>{d.email}</td>
                        <td>{d.address}</td>
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

            {beneficiary_pagination.totalPages > 1 ? (
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '50px',
                }}
              >
                <PaginationItem>
                  <PaginationLink
                    first
                    href="#first_page"
                    onClick={() => handlePagination(1)}
                  />
                </PaginationItem>
                {[...Array(beneficiary_pagination.totalPages)].map((p, i) => (
                  <PaginationItem
                    key={i}
                    active={
                      beneficiary_pagination.currentPage === i + 1
                        ? true
                        : false
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
                      handlePagination(beneficiary_pagination.totalPages)
                    }
                  />
                </PaginationItem>
              </Pagination>
            ) : (
              ''
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
