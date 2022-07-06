import React, { createContext, useCallback, useContext, useReducer } from 'react';
import aidReduce from '../reducers/aidReducer';
import * as Service from '../services/aid';
import ACTION from '../actions/aid';
import { AppContext } from './AppSettingsContext';
import { get } from '../services/institution';
import * as BenfService from '../services/beneficiary';
import * as SmsService from '../services/sms';

import * as MobilizerService from '../services/mobilizer';

const initialState = {
	aids: [],
	pagination: { total: 0, limit: 10, start: 0, currentPage: 1, totalPages: 0 },
	beneficiary_list: [],
	beneficiary_pagination: {
		total: 0,
		limit: 10,
		start: 0,
		currentPage: 1,
		totalPages: 0
	},
	vendors_list: [],
	vendor_pagination: {
		total: 0,
		limit: 10,
		start: 0,
		currentPage: 1,
		totalPages: 0
	},
	total_tokens: 0,
	available_tokens: 0,
	aid_details: null,
	loading: false
};

export const AidContext = createContext(initialState);

export const AidContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(aidReduce, initialState);
	const { changeIsverified } = useContext(AppContext);

	function getAidDetails(projectId) {
		return Service.getAidDetails(projectId);
	}

	function updateAid(projectId, payload) {
		return Service.updateAid(projectId, payload);
	}

	function getInstitution(institutionId) {
		return get(institutionId);
	}

	const addProjectBudget = useCallback(
		async (wallet, projectId, supplyToken, rahat_admin) => {
			changeIsverified(false);
			return Service.addProjectBudget(wallet, projectId, supplyToken, rahat_admin);
		},
		[changeIsverified]
	);

	async function changeProjectStatus(aidId, status) {
		let res = await Service.changeProjectStatus(aidId, status);
		dispatch({ type: ACTION.GET_AID_SUCCESS, res });
		return res;
	}

	const getProjectCapital = useCallback(async (aidId, rahat_admin_contract) => {
		let res = await Service.getProjectCapital(aidId, rahat_admin_contract);
		dispatch({ type: ACTION.SET_TOTAL_TOKENS, res });
		return res;
	}, []);

	const getAidBalance = useCallback(async (aidId, rahat_contract) => {
		let _available = await Service.loadAidBalance(aidId, rahat_contract);
		dispatch({
			type: ACTION.SET_AVAILABLE_TOKENS,
			res: _available
		});
		return _available;
	}, []);

	function setLoading() {
		dispatch({ type: ACTION.SET_LOADING });
	}

	function resetLoading() {
		dispatch({ type: ACTION.RESET_LOADING });
	}

	const vendorsByAid = useCallback(async (aidId, params) => {
		const res = await Service.vendorsByAid(aidId, params);
		dispatch({ type: ACTION.VENDORS_LIST_SUCCESS, res });
		return res;
	}, []);

	const beneficiaryByAid = useCallback((aidId, params) => {
		return new Promise((resolve, reject) => {
			Service.beneficiaryByAid(aidId, params)
				.then(res => {
					dispatch({ type: ACTION.BENEF_LIST_SUCCSS, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}, []);

	function addAid(payload) {
		return new Promise((resolve, reject) => {
			Service.addAid(payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	const listAid = useCallback(query => {
		return new Promise((resolve, reject) => {
			Service.listAid(query)
				.then(res => {
					dispatch({ type: ACTION.LIST_AID_SUCCESS, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}, []);

	const bulkTokenIssueToBeneficiary = useCallback(
		payload => {
			changeIsverified(false);
			return Service.bulkTokenIssueToBeneficiary({ ...payload });
		},
		[changeIsverified]
	);

	function listFinancialInstitutions(params) {
		return Service.listFinancialInstitutions(params);
	}

	const createNft = useCallback(
		(payload, contracts, wallet) => {
			changeIsverified(false);
			return Service.createNft(payload, contracts, wallet);
		},
		[changeIsverified]
	);

	const listNftPackages = useCallback((projectId, query) => {
		return Service.listNftPackages(projectId, query);
	}, []);

	const getPackageDetails = useCallback(packageId => {
		return Service.getPackageDetails(packageId);
	}, []);

	const mintNft = useCallback(
		({ payload, contracts, wallet }) => {
			changeIsverified(false);
			return Service.mintNft({ payload, contracts, wallet });
		},
		[changeIsverified]
	);

	const issueBenfToken = useCallback(
		async (payload, wallet, contracts) => {
			changeIsverified(false);
			const { rahat } = contracts;
			return Service.issueBeneficiaryToken(wallet, payload, rahat);
		},
		[changeIsverified]
	);
	const sendTokenIssuedSms = useCallback(async (phone, token) => {
		return SmsService.sendTokenIssuedSms({ phone:phone.toString(), token:token.toString() });
	}, []);
	const sendPackageIssuedSms = useCallback(async (phone, packageName) => {
		return SmsService.sendPackageIssuedSms({ phone:phone.toString(), packageName });
	}, []);

	const suspendBeneficiaryToken = useCallback(
		async (payload, wallet, contracts) => {
			changeIsverified(false);
			const { rahat } = contracts;
			return Service.suspendBeneficiaryToken(wallet, payload, rahat);
		},
		[changeIsverified]
	);

	const getBeneficiaryById = useCallback(benfId => {
		return BenfService.getById(benfId);
	}, []);

	const issueBeneficiaryPackage = useCallback(
		(wallet, payload, contract_addr) => {
			changeIsverified(false);
			return Service.issueBeneficiaryPackage(wallet, payload, contract_addr);
		},
		[changeIsverified]
	);

	const getProjectTokenBalance = useCallback((aidId, contract_address) => {
		return Service.getProjectTokenBalance(aidId, contract_address);
	}, []);

	const getProjectPackageBalance = useCallback((aidId, contract_address) => {
		return Service.getProjectPackageBalance(aidId, contract_address);
	}, []);

	const getBeneficiaryIssuedTokens = useCallback((phone, contract_address) => {
		return BenfService.getBeneficiaryIssuedTokens(phone, contract_address);
	}, []);

	const listMobilizersByProject = useCallback(params => {
		return MobilizerService.list(params);
	}, []);

	const uploadBenfToProject = (projectId, payload) => {
		return Service.uploadBenfToProject(projectId, payload);
	};

	const getProjectsBalances = useCallback((projectIds, rahat_address, rahatAdminAddress) => {
		return Service.getProjectsBalances(projectIds, rahat_address, rahatAdminAddress);
	}, []);

	return (
		<AidContext.Provider
			value={{
				aids: state.aids,
				loading: state.loading,
				pagination: state.pagination,
				vendors_list: state.vendors_list,
				vendor_pagination: state.vendor_pagination,
				beneficiary_list: state.beneficiary_list,
				beneficiary_pagination: state.beneficiary_pagination,
				aid_details: state.aid_details,
				available_tokens: state.available_tokens,
				total_tokens: state.total_tokens,
				uploadBenfToProject,
				listMobilizersByProject,
				sendTokenIssuedSms,
				sendPackageIssuedSms,
				getProjectPackageBalance,
				issueBeneficiaryPackage,
				getBeneficiaryById,
				issueBenfToken,
				mintNft,
				createNft,
				listNftPackages,
				getPackageDetails,
				updateAid,
				addAid,
				listAid,
				setLoading,
				getAidBalance,
				getInstitution,
				resetLoading,
				vendorsByAid,
				getAidDetails,
				beneficiaryByAid,
				addProjectBudget,
				changeProjectStatus,
				getProjectCapital,
				listFinancialInstitutions,
				bulkTokenIssueToBeneficiary,
				getBeneficiaryIssuedTokens,
				suspendBeneficiaryToken,
				getProjectsBalances,
				getProjectTokenBalance
			}}
		>
			{children}
		</AidContext.Provider>
	);
};
