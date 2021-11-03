import React, { createContext, useReducer, useContext, useCallback } from 'react';
import beneficiaryReduce from '../reducers/beneficiaryReducer';
import * as Service from '../services/beneficiary';
import * as AidService from '../services/aid';
import ACTION from '../actions/beneficiary';
import { AppContext } from './AppSettingsContext';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: {},
	projectList: [],
	beneficiary: {},
	tokenBalance: 0
};

export const BeneficiaryContext = createContext(initialState);
export const BeneficiaryContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(beneficiaryReduce, initialState);
	const { appSettings, changeIsverified } = useContext(AppContext);

	async function getAvailableBalance(proejctId, rahatAdminContractAddr) {
		const { rahat: rahatContractAddr } = appSettings.agency.contracts;
		return AidService.loadAidBalance(proejctId, rahatContractAddr);
	}

	const issueTokens = useCallback(
		async (payload, wallet) => {
			changeIsverified(false);
			const { rahat: rahatContractAddr } = appSettings.agency.contracts;
			return AidService.issueBeneficiaryToken(wallet, payload, rahatContractAddr);
		},
		[appSettings.agency.contracts, changeIsverified]
	);

	const getBeneficiaryBalance = useCallback(async (phone, contract_address) => {
		return Service.getBeneficiaryBalance(phone, contract_address);
	}, []);

	async function listProject() {
		const d = await AidService.listAid({ start: 0, limit: 50 });
		dispatch({ type: ACTION.LIST_AID, data: { projectList: d.data } });
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

	function setBeneficiary(b) {
		dispatch({ type: ACTION.SET_BENEFICIARY, data: b });
	}

	const addBeneficiary = payload => {
		return Service.addBeneficiary(payload);
	};

	const addBeneficiaryInBulk = payload => {
		return Service.addBeneficiaryInBulk(payload);
	};

	const updateBeneficiary = (id, payload) => {
		return Service.updateBeneficiary(id, payload);
	};

	const listBeneficiary = useCallback(async params => {
		let res = await Service.listBeneficiary(params);
		return res;
	}, []);

	// async function listBeneficiary(params) {
	// 	let res = await Service.listBeneficiary(params);
	// 	if (res) {
	// 		dispatch({
	// 			type: ACTION.LIST,
	// 			res
	// 		});
	// 		return res;
	// 	}
	// }

	const importBeneficiary = async () => {
		let beneficiaries = await Service.importBeneficiary({});
		for (let b of beneficiaries) await Service.addBeneficiary(b);
	};

	const getBeneficiaryDetails = useCallback(async id => {
		const data = await Service.get(id);
		return data;
	}, []);

	return (
		<BeneficiaryContext.Provider
			value={{
				aid: state.aid,
				projectList: state.projectList,
				list: state.list,
				pagination: state.pagination,
				tokenBalance: state.tokenBalance,
				beneficiary: state.beneficiary,
				clear,
				setAid,
				listProject,
				issueTokens,
				addBeneficiary,
				addBeneficiaryInBulk,
				updateBeneficiary,
				setBeneficiary,
				listBeneficiary,
				importBeneficiary,
				getAvailableBalance,
				getBeneficiaryDetails,
				getBeneficiaryBalance
			}}
		>
			{children}
		</BeneficiaryContext.Provider>
	);
};
