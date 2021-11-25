import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

export default function MaskLoader(props) {
	const { isOpen, message, size } = props;
	return (
		<>
			<Modal isOpen={isOpen} className={props.className || ''} size={size ? size : ''} backdrop="sta" centered>
				<ModalBody>
					<div style={{ padding: 10 }}>
						{message || 'Please wait...'} <span style={{ fontSize: 12 }}>This may take a while</span>
					</div>
					<div class="spinner-grow text-primary" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-secondary" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-success" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-danger" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-warning" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-info" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-dark" role="status">
						<span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-light" role="status">
						<span class="sr-only">Loading...</span>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

MaskLoader.propTypes = {
	isOpen: PropTypes.bool.isRequired
};
