import React, { useState, useEffect, useContext } from 'react';
import { Input } from 'reactstrap';

import { AppContext } from '../../contexts/AppSettingsContext';
import ModalWrapper from './LiteModal';
import Wallet from '../../utils/blockchain/wallet';
import { APP_CONSTANTS } from '../../constants';

export default function UnlockWallet({ open, onClose }) {
	const { hasWallet, walletPasscode, setWallet, changeIsverified, setWalletPasscode } = useContext(AppContext);
	const PASSCODE_LENGTH = APP_CONSTANTS.PASSCODE_LENGTH;

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('');

	const handlePasscodeChange = e => {
		e.preventDefault();
		const { value } = e.target;
		if (value.length >= PASSCODE_LENGTH) {
			setLoadingMessage('Verifying your passcode. Please wait...');
			return verifyPasscode(value);
		}
	};
	const checkPasscodeMatch = code => {
		if (code !== walletPasscode) return false;
		return true;
	};

	const verifyPasscode = async code => {
		let isMatched = false;

		if (walletPasscode && hasWallet) {
			isMatched = checkPasscodeMatch(code);
			if (!isMatched) {
				setLoadingMessage(<span style={{ color: 'red' }}>Passcode Incorrect</span>);
				return;
			}
			setLoadingMessage(<span style={{ color: 'green' }}>Verified</span>);
			setPasscodeModal(!passcodeModal);
			return changeIsverified(true);
		} else {
			try {
				let wlt = await Wallet.loadWallet(code);
				setWallet(wlt);
				setWalletPasscode(code);
				setLoadingMessage(<span style={{ color: 'green' }}>Verified</span>);
				setPasscodeModal(!passcodeModal);
				return changeIsverified(true);
			} catch (err) {
				return setLoadingMessage(<span style={{ color: 'red' }}>Passcode is invalid</span>);
			}
		}
	};

	const maxLengthCheck = object => {
		if (object.target.value.length > object.target.maxLength) {
			object.target.value = object.target.value.slice(0, object.target.maxLength);
		}
	};

	const togglePasscodeModal = () => {
		setPasscodeModal(!passcodeModal);
		onClose(!passcodeModal);
	};

	useEffect(() => {
		setLoadingMessage('Enter 6 digit passcode');
		setPasscodeModal(open);
	}, [open]);

	return (
		<>
			<ModalWrapper
				title="Verify passcode"
				open={passcodeModal}
				toggle={togglePasscodeModal}
				loadingMessage={loadingMessage}
			>
				{
					<Input
						required
						type="text"
						className="verify-input pwd"
						defaultValue={e => e.target.value}
						onChange={handlePasscodeChange}
						placeholder="------"
						maxLength="6"
						onInput={e => maxLengthCheck(e)}
					/>
				}
			</ModalWrapper>
		</>
	);
}
