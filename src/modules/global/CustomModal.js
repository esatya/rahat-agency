import React from 'react';
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';

export default function CustomModal(props) {
  const { open, toggle, title, handleSubmit, className, children, hideFooter } =
    props;
  return (
    <>
      <Modal
        isOpen={open}
        toggle={toggle.bind(null)}
        className={className || ''}
      >
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={toggle.bind(null)}>
            {title || 'Modal Title'}
          </ModalHeader>
          <ModalBody>{children || 'No child elements supplied.'}</ModalBody>
          {hideFooter ? (
            ''
          ) : (
            <ModalFooter>
              <Button type="submit" color="primary">
                Submit
              </Button>
              <Button color="secondary" onClick={toggle.bind(null)}>
                Cancel
              </Button>
            </ModalFooter>
          )}
        </Form>
      </Modal>
    </>
  );
}

CustomModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
