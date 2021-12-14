import { CURRENCY } from '../constants';

const DEF_SHOW_CHARS = 20;

export const formatWord = word => {
	if (!word) return '-';
	return word.replace(/_/g, ' ');
};

export const blobToBase64 = blob => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};

export const generateUID = length => {
	if (!length) length = 16;
	return window
		.btoa(
			Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
				.map(b => String.fromCharCode(b))
				.join('')
		)
		.replace(/[+/]/g, '')
		.substring(0, length);
};

export const formatBalanceAndCurrency = (amount, currency) => {
	if (!amount) amount = 0;
	if (!currency) currency = CURRENCY.NP_RUPEES;
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
};

export const dottedString = function (inputStr, len) {
	if (!len) len = DEF_SHOW_CHARS;
	if (!inputStr) inputStr = '-';
	return inputStr.length > len ? inputStr.substring(0, len) + '...' : inputStr;
};
