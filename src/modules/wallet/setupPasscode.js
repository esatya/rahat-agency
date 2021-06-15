import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  InputGroup,
  Input,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

import ModalWrapper from '../global/CustomModal';
import DataService from '../../services/db';

export default function SetupPasscode() {
  const history = useHistory();

  const [showPasscodeModal, setPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showRestoreBtn, setShowRestoreBtn] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const togglePasscodeModal = () => setPasscodeModal(!showPasscodeModal);
  const handlePasscodeChange = (e) => setPasscode(e.target.value);

  const handleConfirmPassword = async (e) => {
    const { value } = e.target;
    setConfirmPasscode(value);
    if (value.length === 6) {
      if (value === passcode) {
        togglePasscodeModal();
        setErrorMsg('');
        setShowRestoreBtn(false);
        await DataService.save('temp_passcode', value);
        history.push('/google/restore');
      } else setErrorMsg('Passcode is incorrect!');
    }
  };

  return (
    <>
      <ModalWrapper
        toggle={togglePasscodeModal}
        open={showPasscodeModal}
        title="Set your passcode"
        hideFooter={true}
      >
        <FormGroup>
          {errorMsg && <Label style={{ color: 'red' }}>{errorMsg}</Label>}
          {passcode.length < 6 && (
            <InputGroup>
              <Input
                type="number"
                name="passcode"
                value={passcode || ''}
                placeholder="Enter 6 digit passcode"
                onChange={handlePasscodeChange}
              />
            </InputGroup>
          )}
          {passcode && passcode.length > 5 && (
            <InputGroup>
              <Input
                type="number"
                name="confirmPasscode"
                value={confirmPasscode || ''}
                placeholder="Confirm passcode"
                onChange={handleConfirmPassword}
              />
            </InputGroup>
          )}
        </FormGroup>
      </ModalWrapper>
      <Row>
        <Col xs="12" md="12">
          <Card style={{ padding: 100 }}>
            <CardBody>
              {showRestoreBtn && (
                <div className="button-group">
                  <Button
                    className="btn"
                    onClick={togglePasscodeModal}
                    color="success"
                    size="lg"
                    block
                  >
                    Restore wallet from google
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
