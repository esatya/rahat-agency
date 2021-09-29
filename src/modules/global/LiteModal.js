import React from //  ,{ useState }
'react';
import { Form, Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
// import useDigitInput from 'react-digit-input';

export default function CustomModal(props) {
	const {
		children,
		// toggle,
		title,
		loadingMessage,
		open,
		size,
		handleSubmit
	} = props;
	// const [value, onChange] = useState('');
	// const digits = useDigitInput({
	// 	acceptedCharacters: /^[0-9]$/,
	// 	length: 6,
	// 	value,
	// 	onChange
	// });
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
