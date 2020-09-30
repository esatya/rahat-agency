import React from "react";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import PropTypes from "prop-types";

export default function CustomModal(props) {
  return (
    <>
      <Modal
        isOpen={props.open}
        toggle={props.toggle.bind(null)}
        className={props.className || ""}
      >
        <Form onSubmit={props.handleSubmit}>
          <ModalHeader toggle={props.toggle.bind(null)}>
            {props.title || "Modal Title"}
          </ModalHeader>
          <ModalBody>
            {props.children || "No child elements supplied."}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button color="secondary" onClick={props.toggle.bind(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}

CustomModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
