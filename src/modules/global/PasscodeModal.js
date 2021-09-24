import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import useDigitInput from 'react-digit-input';

import { APP_CONSTANTS } from '../../constants';
import { AppContext } from '../../contexts/AppSettingsContext';
import Wallet from '../../utils/blockchain/wallet';

const PASSCODE_LEN = APP_CONSTANTS.PASSCODE_LENGTH;

export default function PasscodeModal(props) {
	const { toggleModal, title, isOpen, size, handleSubmit } = props;
	const { wallet, walletPasscode, setWallet, changeIsverified, setWalletPasscode } = useContext(AppContext);

	const [value, onChange] = useState('');
	const [loadingMessage, setLoadingMessage] = useState('');

	const digits = useDigitInput({
		acceptedCharacters: /^[0-9]$/,
		length: 6,
		value,
		onChange
	});

	const verifyWallet = useCallback(
		async input_value => {
			try {
				onChange('');
				if (wallet && walletPasscode) {
					if (input_value !== walletPasscode) return setLoadingMessage('Please enter correct passcode!');
					changeIsverified(true);
					setLoadingMessage('Wallet verified!');
				} else {
					setLoadingMessage('Verifying wallet, please wait...');
					const w = await Wallet.loadWallet(input_value);
					setWalletPasscode(input_value);
					changeIsverified(true);
					setLoadingMessage('Wallet verified!');
					setWallet(w);
				}
			} catch (err) {
				setLoadingMessage('Please enter correct passcode!');
			}
		},
		[changeIsverified, setWallet, setWalletPasscode, wallet, walletPasscode]
	);

	useEffect(() => {
		const input_value = value.trim();
		if (input_value.length === PASSCODE_LEN) {
			verifyWallet(input_value);
		}
	}, [changeIsverified, setWallet, setWalletPasscode, value, value.length, verifyWallet, wallet, walletPasscode]);

	return (
		<>
			<Modal
				isOpen={isOpen}
				toggle={toggleModal}
				size={size || 'xl'}
				aria-labelledby="contained-modal-title-vcenter"
				centered
				class="modal-backdrop fade in"
			>
				<Form id="form" style={{ backgroundColor: '#2b7ec1', textAlign: 'center' }} onSubmit={handleSubmit}>
					<ModalBody className="pt-4">
						{/* {children || 'No child elements supplied.'} */}
						{/* <span>Close</span> */}
						<div>
							<h2 style={{ marginBottom: '25px', color: 'white' }}>
								{title || 'Verify Passcode'} &nbsp;
								<span style={{ cursor: 'pointer' }} onClick={toggleModal}>
									<small>
										<i class="fa fa-times" aria-hidden="true"></i>
									</small>
								</span>
							</h2>
						</div>

						<h5 style={{ marginBottom: '25px', color: 'white' }}>
							Enter you passcode from RUMSAN WALLET to proceed transaction
						</h5>

						<div>
							<div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
								<input inputMode="decimal" type="password" className="input-pin" autoFocus {...digits[0]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[1]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[2]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[3]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[4]} />
								<input inputMode="decimal" type="password" className="input-pin" {...digits[5]} />
							</div>
							{/* <pre>
								<code>"{value}"</code>
							</pre> */}
						</div>
						<div className="text-center" style={{ padding: '0px 0px 15px', marginTop: 20, color: 'white' }}>
							{loadingMessage ? loadingMessage : ''}
						</div>
					</ModalBody>
				</Form>
			</Modal>
		</>
	);
}

PasscodeModal.propTypes = {
	toggleModal: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired
};
