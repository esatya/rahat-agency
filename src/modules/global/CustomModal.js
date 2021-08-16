import React from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

import Loading from './Loading';

export default function CustomModal(props) {
	const { open, toggle, title, children, loading, hideFooter } = props;
	return (
		<>
			<Modal isOpen={open} toggle={toggle.bind(null)} className={props.className || ''} centered>
				<Form onSubmit={props.handleSubmit}>
					<ModalHeader toggle={toggle.bind(null)}>{title || 'Modal Title'}</ModalHeader>
					<ModalBody>{children || 'No child elements supplied.'}</ModalBody>
					{hideFooter ? (
						''
					) : (
						<ModalFooter>
							{loading ? (
								<Loading />
							) : (
								<Button type="submit" color="info">
									Submit
								</Button>
							)}
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
	open: PropTypes.bool.isRequired
};
