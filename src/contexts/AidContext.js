import React, { createContext, useContext, useReducer } from 'react';
import aidReduce from '../reducers/aidReducer';
import * as Service from '../services/aid';
import ACTION from '../actions/aid';
import { AppContext } from './AppSettingsContext';

const initialState = {
	aids: [],
	pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
	beneficiary_list: [],
	beneficiary_pagination: {
		total: 0,
		limit: 10,
		start: 0,
		currentPage: 1,
		totalPages: 0
	},
	balance: { total: 0, available: 0 },
	aid_details: null,
	loading: false
};

export const AidContext = createContext(initialState);
export const AidContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(aidReduce, initialState);
	const { wallet, appSettings, changeIsverified } = useContext(AppContext);
	function getAidDetails(aidId) {
		return new Promise((resolve, reject) => {
			Service.getAidDetails(aidId)
				.then(res => {
					dispatch({ type: ACTION.GET_AID_SUCCESS, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function addProjectBudget(aidId, supplyToken, contract_addr) {
		// const wallet = await Wallet.loadWallet('123123');
		const { rahat: rahatContractAddr } = appSettings.agency.contracts;
		let d = await Service.addProjectBudget(wallet, aidId, supplyToken, contract_addr);
		changeIsverified(false);
		let balance = await Service.loadAidBalance(aidId, rahatContractAddr);
		if (balance) {
			dispatch({ type: ACTION.GET_BALANCE, res: balance });
			return d;
		}
	}

	async function changeProjectStatus(aidId, status) {
		let res = await Service.changeProjectStatus(aidId, status);
		dispatch({ type: ACTION.GET_AID_SUCCESS, res });
		return res;
	}

	async function getProjectCapital(aidId, contract_addr) {
		let res = await Service.getProjectCapital(aidId, contract_addr);
		dispatch({ type: ACTION.PROJECT_CAPITAL, res });
		return res;
	}

	async function getAidBalance(aidId) {
		const { rahat_admin, rahat } = appSettings.agency.contracts;
		let _available = await Service.loadAidBalance(aidId, rahat);
		let _capital = await Service.getProjectCapital(aidId, rahat_admin);
		dispatch({ type: ACTION.PROJECT_CAPITAL, res: _capital ? _capital : 0 });
		dispatch({
			type: ACTION.AVAILABLE_BALANCE,
			res: _available ? _available : 0
		});
		return _available;
	}

	function setLoading() {
		dispatch({ type: ACTION.SET_LOADING });
	}

	function resetLoading() {
		dispatch({ type: ACTION.RESET_LOADING });
	}

	function vendorsByAid(aidId, params) {
		return new Promise((resolve, reject) => {
			Service.vendorsByAid(aidId, params)
				.then(res => {
					dispatch({ type: ACTION.VENDORS_LIST_SUCCESS, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function beneficiaryByAid(aidId, params) {
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
	}

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

	function listAid(query) {
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
	}

	function bulkTokenIssueToBeneficiary(payload) {
		return Service.bulkTokenIssueToBeneficiary({ ...payload });
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
				balance: state.balance,
				addAid,
				listAid,
				setLoading,
				getAidBalance,
				resetLoading,
				vendorsByAid,
				getAidDetails,
				beneficiaryByAid,
				addProjectBudget,
				changeProjectStatus,
				getProjectCapital,
				bulkTokenIssueToBeneficiary
			}}
		>
			{children}
		</AidContext.Provider>
	);
};
