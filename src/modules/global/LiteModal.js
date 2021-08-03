import React, { useState } from 'react';
import { Form, Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import useDigitInput from 'react-digit-input';

export default function CustomModal(props) {
	const {
		// children,
		title,
		loadingMessage,
		open,
		size,
		handleSubmit
	} = props;
	const [value, onChange] = useState('');
	const digits = useDigitInput({
		acceptedCharacters: /^[0-9]$/,
		length: 6,
		value,
		onChange
	});
	return (
		<>
			<Modal
				isOpen={open}
				toggle={props.toggle}
				className={props.className || ''}
				size={size ? size : 'xl'}
				aria-labelledby="contained-modal-title-vcenter"
				centered
				backdrop="true"
				class="modal-backdrop fade in"
			>
				<Form id="form" style={{ backgroundColor: 'black', textAlign: 'center' }} onSubmit={handleSubmit}>
					<ModalBody className="pt-4">
						{/* {children || 'No child elements supplied.'} */}
						<h2 style={{ marginBottom: '50px', color: 'white' }}>{title || 'Modal Title'}</h2>
						<div>
							<div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
								<input inputMode="decimal" type="password" className="input-pin" autoFocus {...digits[0]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[1]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[2]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[3]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[4]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[5]} />
							</div>
							<pre>
								<code>"{value}"</code>
							</pre>
						</div>
						<div className="text-center" style={{ padding: '0px 0px 15px' }}>
							{loadingMessage ? loadingMessage : ''}
						</div>
					</ModalBody>
				</Form>
			</Modal>
		</>
	);
}

CustomModal.propTypes = {
	toggle: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired
};
