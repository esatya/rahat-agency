import React, { createContext, useReducer, useContext, useCallback, useState } from 'react';
import vendorReduce from '../reducers/vendorReducer';
import * as Service from '../services/vendor';
import * as AidService from '../services/aid';
import ACTION from '../actions/vendor';
import { AppContext } from './AppSettingsContext';
import { APP_CONSTANTS } from '../constants';

const FETCH_FIFTY = 50;

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: '',
	aids: [],
	vendor: {},
	loading: false,
	transactionHistory: [],
	packageTxHistory: []
};

export const VendorContext = createContext(initialState);
export const VendorContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(vendorReduce, initialState);
	const { wallet, appSettings, changeIsverified } = useContext(AppContext);
	const [fetchingVendorBalances, setfetchingVendorBalances] = useState(true);

	const getVendorBalance = useCallback((contract_addr, wallet_address) => {
		return Service.getVendorBalance(contract_addr, wallet_address);
	}, []);

	const appendVendorBalances = (vendors, balances) => {
		if (!vendors.length) return;
		if (vendors.length !== balances.length) throw Error('INVALID DATA');
		return vendors.map((vendor, i) => {
			vendor.tokenBalance = balances[i];
			return vendor;
		});
	};

	const getVendorsBalances = useCallback(
		async payload => {
			if (!appSettings || !appSettings.agency || !appSettings.agency.contracts) return;
			if (!payload.data.length) return;
			try {
				setfetchingVendorBalances(true);
				const { agency } = appSettings;
				const vendorAddresses = payload.data.map(vendor => vendor.wallet_address);
				const vendorBalances = await Service.getVendorsBalances(agency.contracts.rahat_erc20, vendorAddresses);
				payload.data = appendVendorBalances(payload.data, vendorBalances);
				dispatch({
					type: ACTION.LIST,
					data: payload
				});
				setfetchingVendorBalances(false);
				return vendorBalances;
			} catch (e) {
				setfetchingVendorBalances(false);
				return e;
			}
		},
		[appSettings]
	);

	const getVendorPackageBalance = useCallback((contract_address, wallet_addresses, tokenIds) => {
		return Service.getVendorPackageBalance(contract_address, wallet_addresses, tokenIds);
	}, []);

	const listAid = useCallback(async () => {
		const d = await AidService.listAid({ limit: APP_CONSTANTS.FETCH_LIMIT });
		dispatch({ type: ACTION.LIST_AID, data: { aids: d.data } });
		return d;
	}, []);

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

	const approveVendor = useCallback(
		async payload => {
			const { agency } = appSettings;
			if (!agency || !agency.contracts) return;
			const { rahat: rahatContractAddr } = agency.contracts;
			const res = await Service.approveVendor(wallet, payload, rahatContractAddr);
			changeIsverified(false);
			if (res) {
				setVendor(res.data);
				return res.data;
			}
		},
		[appSettings, changeIsverified, wallet]
	);

	// async function approveVendor(payload) {
	// 	const { rahat: rahatContractAddr } = appSettings.agency.contracts;
	// 	const res = await Service.approveVendor(wallet, payload, rahatContractAddr);
	// 	changeIsverified(false);
	// 	if (res) {
	// 		setVendor(res.data);
	// 		return res.data;
	// 	}
	// }

	async function changeVendorStatus(vendorId, status) {
		const res = await Service.changeVendorStaus(vendorId, status);
		setVendor(res.data);
		return res.data;
	}

	function setVendor(b) {
		dispatch({ type: ACTION.SET_VENDOR, data: b });
	}

	const getVendorDetails = useCallback(async id => {
		const data = await Service.get(id);
		return data;
	}, []);

	function addVendor(payload) {
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

	const updateVendor = (id, payload) => {
		return Service.updateVendor(id, payload);
	};

	function setLoading() {
		dispatch({ type: ACTION.SET_LOADING });
	}

	function resetLoading() {
		dispatch({ type: ACTION.RESET_LOADING });
	}

	const listVendor = useCallback(
		async params => {
			let res = await Service.list(params);
			if (res) {
				dispatch({
					type: ACTION.LIST,
					data: res
				});
				getVendorsBalances(res);
				return res;
			}
		},
		[getVendorsBalances]
	);

	// async function listVendor(params) {
	// 	let res = await Service.list(params);
	// 	if (res) {
	// 		dispatch({
	// 			type: ACTION.LIST,
	// 			data: res
	// 		});
	// 		return res;
	// 	}
	// }

	const getVendorTransactions = useCallback(async id => {
		let res = await Service.vendorTransactions(id);
		if (res) {
			dispatch({
				type: ACTION.VENDOR_TX,
				data: res
			});
			return res;
		}
	}, []);

	const getVendorPackageTx = useCallback(async id => {
		let res = await Service.vendorPackagetx(id);
		if (res) {
			dispatch({
				type: ACTION.PACKAGE_TX,
				data: res
			});
			return res;
		}
	}, []);

	const getTokenIdsByProjects = useCallback(projects => {
		return Service.getTokenIdsByProjects(projects);
	}, []);

	const listProjects = useCallback(async () => {
		const d = await AidService.listAid({ start: 0, limit: FETCH_FIFTY });
		return d.data;
	}, []);

	const addVendorToProject = (vendorId, projectId) => {
		return Service.addVendorToProject(vendorId, projectId);
	};

	const getTotalVendorsBalances = useCallback((contract_address, vendorAddresses) => {
		return Service.getTotalVendorsBalances(contract_address, vendorAddresses);
	}, []);
	const getVendorReport = async params => {
		const data = await Service.getVendorReport();
		return data;
	};

	return (
		<VendorContext.Provider
			value={{
				list: state.list,
				aid: state.aid,
				aids: state.aids,
				vendor: state.vendor,
				loading: state.loading,
				pagination: state.pagination,
				transactionHistory: state.transactionHistory,
				fetchingVendorBalances,
				listProjects,
				listVendor,
				listAid,
				setAid,
				clear,
				addVendor,
				updateVendor,
				addVendorToProject,
				getVendorPackageBalance,
				getTokenIdsByProjects,
				setVendor,
				setLoading,
				resetLoading,
				approveVendor,
				getVendorDetails,
				changeVendorStatus,
				getVendorBalance,
				getVendorTransactions,
				getVendorsBalances,
				getVendorPackageTx,
				getTotalVendorsBalances,
				getVendorReport
			}}
		>
			{children}
		</VendorContext.Provider>
	);
};
