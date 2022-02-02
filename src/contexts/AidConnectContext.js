import React, { createContext, useReducer, useCallback } from 'react';
import beneficiaryReduce from '../reducers/aidConnectReducer';
import * as Service from '../services/aidConnect';
import * as AidService from '../services/aid';
import ACTION from '../actions/aidConnect';

const initialState = {
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	projectList: []
};

export const AidConnectContext = createContext(initialState);
export const AidConnectContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(beneficiaryReduce, initialState);

	const listProject = useCallback(async () => {
		const d = await AidService.listAid({ start: 0, limit: 50 });
		dispatch({ type: ACTION.LIST_AID, data: { projectList: d.data } });
		return d;
	}, []);

	const listAidConnectBeneficiary = useCallback(async (aidConnectId, params) => {
		return await Service.listAidConnectBeneficiary(aidConnectId, params);
	}, []);

	const generateLink = useCallback(async projectId => {
		return await Service.generateLink(projectId);
	}, []);

	async function changeLinkStatus(projectId, payload) {
		return await Service.changeLinkStatus(projectId, payload);
	}

	const addBeneficiaryInBulk = payload => {
		return Service.addBeneficiaryInBulk(payload);
	};

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
				listAidConnectBeneficiary,
				generateLink,
				changeLinkStatus,
				addBeneficiaryInBulk
			}}
		>
			{children}
		</AidConnectContext.Provider>
	);
};
