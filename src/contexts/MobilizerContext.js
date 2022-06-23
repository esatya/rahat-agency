import React, { createContext, useReducer, useContext, useCallback } from 'react';
import mobilizerReduce from '../reducers/mobilizerReducer';
import * as Service from '../services/mobilizer';
import * as AidService from '../services/aid';
import ACTION from '../actions/mobilizer';
import { AppContext } from './AppSettingsContext';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: '',
	aids: [],
	mobilizer: {},
	loading: false,
	transactionHistory: []
};

export const MobilizerContext = createContext(initialState);
export const MobilizerContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(mobilizerReduce, initialState);
	const { wallet, appSettings, changeIsverified } = useContext(AppContext);

	async function getAvailableBalance(proejctId, rahatAdminContractAddr) {
		const { rahat_admin } = appSettings.agency.contracts;
		return AidService.loadAidBalance(proejctId, rahat_admin);
	}

	async function listAid() {
		const d = await AidService.listAid({ start: 0, limit: 20 });
		dispatch({ type: ACTION.LIST_AID, data: { aids: d.data } });
		return d;
	}

	function setAid(aid) {
		dispatch({ type: ACTION.SET_AID, data: aid });
	}

	function clear() {
		dispatch({
			type: ACTION.LIST,
			data: {
				limit: 10,
				start: 0,
				total: 0,
				data: [],
				page: 0,
				name: '',
				phone: ''
			}
		});
	}

	async function approveMobilizer(payload) {
		const { rahat: rahatContractAddr } = appSettings.agency.contracts;
		const res = await Service.approveMobilizer(wallet, payload, rahatContractAddr);
		changeIsverified(false);
		if (res) {
			setMobilizer(res.data);
			return res.data;
		}
	}

	async function changeMobilizerStatus(mobilizerId, status) {
		const res = await Service.changeMobilizerStaus(mobilizerId, status);
		setMobilizer(res.data);
		return res.data;
	}

	function setMobilizer(b) {
		dispatch({ type: ACTION.SET_MOBILIZER, data: b });
	}

	const getMobilizerDetails = useCallback(async id => {
		const data = await Service.get(id);
		setMobilizer(data);
		return data;
	}, []);

	function addMobilizer(payload) {
		return new Promise((resolve, reject) => {
			Service.add(payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	const updateMobilizer = (id, payload) => {
		return Service.updateMobilizer(id, payload);
	};

	function setLoading() {
		dispatch({ type: ACTION.SET_LOADING });
	}

	function resetLoading() {
		dispatch({ type: ACTION.RESET_LOADING });
	}

	const listMobilizer = useCallback(async params => {
		let res = await Service.list(params);
		if (res) {
			dispatch({
				type: ACTION.LIST,
				data: res
			});
			return res;
		}
	}, []);

	const getMobilizerTransactions = useCallback(async mobilizerId => {
		let res = await Service.mobilizerTransactions(mobilizerId);
		if (res) {
			dispatch({
				type: ACTION.MOBILIZER_TX,
				data: res
			});
			return res;
		}
	}, []);

	const getMobilizerBalance = useCallback((contract_addr, wallet_address) => {
		return Service.getMobilizerBalance(contract_addr, wallet_address);
	}, []);

	const getMobilizerIssuedTokens = useCallback((contract_addr, wallet_address) => {
		return Service.getMobilizersIssuedTokens(contract_addr, wallet_address);
	}, []);

	const getMobilizerIssuedPackages = useCallback((contract_addr, wallet_address) => {
		return Service.getMobilizersIssuedPackages(contract_addr, wallet_address);
	}, []);

	const getTotalMobilizerIssuedTokens = useCallback((contract_addr, wallet_address,projectId) => {
		return Service.getTotalMobilizerIssuedTokens(contract_addr, wallet_address,projectId);
	}, []);

	

	const getMobilizerPackageBalance = useCallback((contract_addr, wallet_address) => {
		return Service.getMobilizerPackageBalance(contract_addr, wallet_address);
	}, []);

	const changeMobStatusInProject = useCallback((mobId, payload) => {
		return Service.changeMobStatusInProject(mobId, payload);
	}, []);
	const getMobilizerReport = useCallback(async params => {
		const data = await Service.getMobilizerReport(params);
		return data;
	}, []);

	return (
		<MobilizerContext.Provider
			value={{
				list: state.list,
				aid: state.aid,
				aids: state.aids,
				mobilizer: state.mobilizer,
				loading: state.loading,
				pagination: state.pagination,
				transactionHistory: state.transactionHistory,
				listMobilizer,
				listAid,
				setAid,
				clear,
				addMobilizer,
				updateMobilizer,
				setMobilizer,
				setLoading,
				resetLoading,
				approveMobilizer,
				getMobilizerDetails,
				changeMobilizerStatus,
				getMobilizerBalance,
				getMobilizerTransactions,
				getMobilizerPackageBalance,
				getAvailableBalance,
				changeMobStatusInProject,
				getMobilizerIssuedTokens,
				getTotalMobilizerIssuedTokens,
				getMobilizerIssuedPackages,
				getMobilizerReport
			}}
		>
			{children}
		</MobilizerContext.Provider>
	);
};
