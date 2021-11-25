module.exports = {
	CURRENCY: {
		NP_RUPEES: 'NPR'
	},
	BALANCE_TABS: { TOKEN: 'Token', PACKAGE: 'Package' },
	APP_CONSTANTS: {
		PASSCODE_LENGTH: 6,
		BULK_BENEFICIARY_LIMIT: 200,
		FETCH_LIMIT: 100,
		PAGE_LIMIT: 1
	},
	ROLES: { ADMIN: 'Admin', MANAGER: 'Manager' },
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
		},
		WARNING: {
			appearance: 'warning',
			autoDismiss: true
		}
	},
	PROJECT_STATUS: {
		ACTIVE: 'active',
		SUSPENDED: 'suspended'
	},
	GROUPS: {
		DIFFERENTLY_ABLED: {
			label: 'Differently Abled',
			value: 'Differently_Abled'
		},
		MATERNITY: {
			label: 'Maternity',
			value: 'Maternity'
		},
		SENIOR_CITIZENS: {
			label: 'Senior Citizens',
			value: 'Senior_Citizens'
		},
		COVID_VICTIM: {
			label: 'Covid Victim',
			value: 'Covid_Victim'
		},
		NATURAL_CLIMATE_VICTIM: {
			label: 'Natural Calamities Victim',
			value: 'Natural_Calamities_Victim'
		},
		UNDER_PRIVILAGED: {
			label: 'Under Privileged',
			value: 'Under_Privileged'
		},
		SEVERE_HEATH_ISSUES: {
			label: 'Severe Health Issues',
			value: 'Severe_Health_Issues'
		},
		SINGLE_WOMAN: {
			label: 'Single Women',
			value: 'Single_Women'
		},
		ORPHAN: {
			label: 'Orphan',
			value: 'Orphan'
		}
	}
};
