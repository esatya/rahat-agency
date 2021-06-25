import React from 'react';
import { Form, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CustomModal(props) {
  const { children, title, loadingMessage, open, size, handleSubmit } = props;

  return (
    <>
      <Modal isOpen={open} toggle={props.toggle} className={props.className || ''} size={size ? size : ''}>
        <Form id="form" onSubmit={handleSubmit}>
          <ModalHeader>{title || 'Modal Title'}</ModalHeader>
          <ModalBody className="pt-4">{children || 'No child elements supplied.'}</ModalBody>
          <div className="text-center" style={{ padding: '0px 0px 15px' }}>
            {loadingMessage ? loadingMessage : ''}
          </div>
        </Form>
      </Modal>
    </>
  );
}

CustomModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
