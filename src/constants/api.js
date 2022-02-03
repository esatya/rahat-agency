const SERVER_URL = process.env.REACT_APP_API_SERVER;
const API_PATH = SERVER_URL + '/api/v1';

module.exports = {
	AGENCY: API_PATH + '/agency',
	APP: API_PATH + '/app',
	AID_CONNECT: API_PATH + '/aid-connect',
	BENEFICARIES: API_PATH + '/beneficiaries',
	INSTITUTIONS: API_PATH + '/institutions',
	METAMASK_LOGIN: API_PATH + '/auth/wallet',
	ONBOARD: API_PATH + '/onboard',
	PROJECTS: API_PATH + '/projects',
	REGISTER: API_PATH + '/agency/register',
	TOKEN_AUTH: API_PATH + '/auth',
	USERS: API_PATH + '/users',
	VENDORS: API_PATH + '/vendors',
	FAUCET: process.env.REACT_APP_BLOCKCHAIN_FAUCET,
	MOBILIZERS: API_PATH + '/mobilizers',
	NFT: API_PATH + '/nft',
	Notification:API_PATH+'/notifications'
};
