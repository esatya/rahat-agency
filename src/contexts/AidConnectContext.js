import React, { createContext, useReducer, useCallback } from 'react';
import beneficiaryReduce from '../reducers/aidConnectReducer';
import * as Service from '../services/aidConnect';
import * as AidService from '../services/aid';
import ACTION from '../actions/aidConnect';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: {},
	projectList: [],
	beneficiary: {},
	tokenBalance: 0
};

export const AidConnectContext = createContext(initialState);
export const AidConnectContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(beneficiaryReduce, initialState);

	const listProject = useCallback(async () => {
		const d = await AidService.listAid({ start: 0, limit: 50 });
		dispatch({ type: ACTION.LIST_AID, data: { projectList: d.data } });
		return d;
	}, []);

	const listBeneficiary = useCallback(async params => {
		let res = await Service.listBeneficiary(params);
		return res;
	}, []);

	// async function changeLinkStatus(aidId, status) {
	// 	let res = await Service.changeLinkStatus(aidId, status);
	// 	dispatch({ type: ACTION.GET_AID_SUCCESS, res });
	// 	return res;
	// }

	return (
		<AidConnectContext.Provider
			value={{
				aid: state.aid,
				projectList: state.projectList,
				list: state.list,
				pagination: state.pagination,
				tokenBalance: state.tokenBalance,
				beneficiary: state.beneficiary,
				listProject,
				listBeneficiary
				// changeLinkStatus
			}}
		>
			{children}
		</AidConnectContext.Provider>
	);
};
