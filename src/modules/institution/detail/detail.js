
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  FormGroup, 
  Label, 
  InputGroup
} from 'reactstrap';

import { InstitutionContext } from '../../../contexts/InstitutionContext';
import Loading from "../../global/Loading";

export default function DetailsForm(props) {
  const institutionId = props.params.id;
  const { addToast } = useToasts();
  const [institution_details, setInstitutionDetails] = useState(null);

  const {
    getInstitutionDetails,
    loading,
    setLoading,
    resetLoading,
  } = useContext(InstitutionContext);

  const loadInstitutionDetails = () => {
    setLoading();
    getInstitutionDetails(institutionId)
      .then(d=>{setInstitutionDetails(d); resetLoading();})
      .catch(() => {
        addToast('Something went wrong on server!', {
          appearance: 'error',
          autoDismiss: true,
        });
      });
      resetLoading();
  };

  useEffect(loadInstitutionDetails, []);
  
  return (
    <>
      <Row>
        <Col md="12">
          <Card>
            <CardTitle className="bg-light border-bottom p-3 mb-0">
              <i className="mdi mdi-currency-usd mr-2"></i>Institution Details.
            </CardTitle>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label>Name</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="name"
                      defaultValue={institution_details ? institution_details.name : ""}
                      onChange={e => setInstitutionDetails({ ...institution_details, name: e.target.value })}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Head Office Address</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="address"
                      defaultValue={institution_details ? institution_details.address : ""}
                      onChange={e => setInstitutionDetails({ ...institution_details, address: e.target.value })}

                    />
                  </InputGroup>
                </FormGroup>
                  <FormGroup>
                  <Label>Primary Contact</Label>
                  <InputGroup>
                    <Input
                      readOnly
                      type="text"
                      name="phone"   
                      defaultValue={institution_details ? institution_details.phone : ""}
                      onChange={e => setInstitutionDetails({ ...institution_details, phone: e.target.value })}
                    />
                  </InputGroup>
                </FormGroup>
                 <div className="border-top pt-3 mt-3">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      <Link to="/institutions" className="btn btn-dark">
                        Go Back
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
