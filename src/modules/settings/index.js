import React, { useState } from "react";
import {
  Card,
  CardBody,
  Modal,
  Button,
  Input,
  Form,
  ModalHeader,
  ModalFooter,
  ModalBody
} from "reactstrap";
import { useToasts } from "react-toast-notifications";
import * as AuthApi from "../../services/auth";

const Settings = props => {
  const { addToast } = useToasts();
  const [model, setModel] = useState(false);
  const [inputs, setInputs] = useState({ key: "", secret: "" });
  const [name, setName] = useState("");
  const toggle = () => setModel(!model);

  const generateKey = e => {
    e.preventDefault();
    if (!name && !name.trim().length) {
      addToast("provide valid name", {
        appearance: "error",
        autoDismiss: true
      });
      return;
    }
    AuthApi.pat({ name })
      .then(d => {
        setInputs({ key: d.key, secret: d.secret });
        toggle();
      })
      .catch(err =>
        addToast(err.message, {
          appearance: "error",
          autoDismiss: true
        })
      );
  };

  return (
    <div>
      <Card>
        <CardBody style={{ float: "right" }}>
          <Input
            placeholder="Name of your app"
            onChange={e => setName(e.target.value)}
            style={{ display: "inline", width: "auto", marginRight: "5px" }}
          />
          <Button onClick={generateKey}>Generate Key</Button>
        </CardBody>
      </Card>
      <Modal isOpen={model} toggle={toggle}>
        <Form>
          <ModalHeader toggle={toggle}>
            <div>
              <h3>Keys</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="form-item">
              <label htmlFor="name">Key</label>
              <br />
              <Input
                name="key"
                type="text"
                defaultValue={inputs.key || " "}
                className="form-field"
                required
              />
            </div>
            <br />

            <div className="form-item">
              <label htmlFor="secret">Secret</label>
              <br />
              <Input name="secret" className="form-field" defaultValue={inputs.secret} required />
            </div>
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
