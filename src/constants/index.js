
const API_SERVER = process.env.REACT_APP_API_SERVER

module.exports = {
	CURRENCY: {
		NP_RUPEES: 'NPR'
	},	
	API_SERVER,
	WSS_SERVER : API_SERVER.replace('http', 'ws'),
	WSS_EVENTS:{
		welcome:'welcome',
		notification:'notification'
	},
	BALANCE_TABS: { TOKEN: 'Token', PACKAGE: 'Package' },
	TRANSACTION_TABS: { TOKEN: 'Token', PACKAGE: 'Package' },
	MAX_QR_GEN: 1000,
	STATUS_ACTIONS: { APPROVE: 'Approve', REJECT: 'Reject' },
	APP_CONSTANTS: {
		PASSCODE_LENGTH: 6,
		BULK_BENEFICIARY_LIMIT: 200,
		FETCH_LIMIT: 100,
		PAGE_LIMIT: 10
	},
	ROLES: { ADMIN: 'Admin', MANAGER: 'Manager', MOBILIZER: 'Mobilizer' },
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
		SUSPENDED: 'suspended',
		CLOSED: 'closed'
	},
	AID_CONNECT_STATUS: {
		ACTIVE: 'active',
		SUSPENDED: 'suspended'
	},
	VENDOR_STATUS: {
		ACTIVE: 'active',
		NEW: 'new',
		SUSPENDED: 'suspended'
	},
	MOBIZ_STATUS: {
		ACTIVE: 'active',
		NEW: 'new',
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
