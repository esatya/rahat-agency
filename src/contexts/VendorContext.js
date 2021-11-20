import React, { createContext, useReducer, useContext, useCallback } from 'react';
import vendorReduce from '../reducers/vendorReducer';
import * as Service from '../services/vendor';
import * as AidService from '../services/aid';
import ACTION from '../actions/vendor';
import { AppContext } from './AppSettingsContext';
import { APP_CONSTANTS } from '../constants';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: '',
	aids: [],
	vendor: {},
	loading: false,
	transactionHistory: []
};

export const VendorContext = createContext(initialState);
export const VendorContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(vendorReduce, initialState);
	const { wallet, appSettings, changeIsverified } = useContext(AppContext);

	const getVendorBalance = useCallback((contract_addr, wallet_address) => {
		return Service.getVendorBalance(contract_addr, wallet_address);
	}, []);

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
			const { rahat: rahatContractAddr } = appSettings.agency.contracts;
			const res = await Service.approveVendor(wallet, payload, rahatContractAddr);
			changeIsverified(false);
			if (res) {
				setVendor(res.data);
				return res.data;
			}
		},
		[appSettings.agency.contracts, changeIsverified, wallet]
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

	const listVendor = useCallback(async params => {
		let res = await Service.list(params);
		if (res) {
			dispatch({
				type: ACTION.LIST,
				data: res
			});
			return res;
		}
	}, []);

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

	const getTokenIdsByProjects = useCallback(projects => {
		return Service.getTokenIdsByProjects(projects);
	}, []);

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
				listVendor,
				listAid,
				setAid,
				clear,
				addVendor,
				updateVendor,
				getVendorPackageBalance,
				getTokenIdsByProjects,
				setVendor,
				setLoading,
				resetLoading,
				approveVendor,
				getVendorDetails,
				changeVendorStatus,
				getVendorBalance,
				getVendorTransactions
			}}
		>
			{children}
		</VendorContext.Provider>
	);
};
