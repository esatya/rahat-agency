import React, { createContext, useCallback, useContext, useReducer } from 'react';
import aidReduce from '../reducers/aidReducer';
import * as Service from '../services/aid';
import ACTION from '../actions/aid';
import { AppContext } from './AppSettingsContext';
import { get } from '../services/institution';

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
		async ({ projectId, supplyToken, rahat_admin, wallet }) => {
			changeIsverified(false);
			await Service.addProjectBudget(wallet, projectId, supplyToken, rahat_admin);
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

	// function vendorsByAid(aidId, params) {
	// 	return new Promise((resolve, reject) => {
	// 		Service.vendorsByAid(aidId, params)
	// 			.then(res => {
	// 				dispatch({ type: ACTION.VENDORS_LIST_SUCCESS, res });
	// 				resolve(res);
	// 			})
	// 			.catch(err => {
	// 				reject(err);
	// 			});
	// 	});
	// }

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

	// function listAid(query) {
	// 	return new Promise((resolve, reject) => {
	// 		Service.listAid(query)
	// 			.then(res => {
	// 				dispatch({ type: ACTION.LIST_AID_SUCCESS, res });
	// 				resolve(res);
	// 			})
	// 			.catch(err => {
	// 				reject(err);
	// 			});
	// 	});
	// }

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
				bulkTokenIssueToBeneficiary
			}}
		>
			{children}
		</AidContext.Provider>
	);
};
