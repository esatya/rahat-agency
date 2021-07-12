module.exports = {
	APP_CONSTANTS: {
		PASSCODE_LENGTH: 6,
		BULK_BENEFICIARY_LIMIT: 200
	},

	DEFAULT_TOKEN: {
		NAME: 'Ether',
		SYMBOL: 'ETH'
	},
	BACKUP: {
		PASSPHRASE_RULE: '"^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{12,})"',
		GDRIVE_FOLDERNAME: 'RumsanWalletBackups'
	},
	TOAST: {
		ERROR: {
			appearance: 'error',
			autoDismiss: true
		},
		SUCCESS: {
			appearance: 'success',
			autoDismiss: true
		}
	}
};
