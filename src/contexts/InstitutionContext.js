import React, { createContext, useReducer, useCallback } from 'react';
import institutionReduce from '../reducers/institutionReducer';
import * as Service from '../services/institution';
import ACTION from '../actions/institution';

const initialState = {
	institution: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	institution_details: null,
	loading: false
};

export const InstitutionContext = createContext(initialState);
export const InstitutionContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(institutionReduce, initialState);

	function setLoading() {
		dispatch({ type: ACTION.SET_LOADING });
	}

	function resetLoading() {
		dispatch({ type: ACTION.RESET_LOADING });
	}

	async function getInstitutionDetails(id) {
		return new Promise((resolve, reject) => {
			Service.get(id)
				.then(res => {
					dispatch({ type: ACTION.GET_INSTITUTION_SUCCESS, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function addInstitution(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		let payload = {
			name: formData.get('name'),
			phone: formData.get('phone'),
			address: formData.get('address')
		};

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

	const listInstitution = useCallback(async params => {
		let res = await Service.list(params);
		if (res) {
			dispatch({
				type: ACTION.LIST_SUCCESS,
				data: res
			});
			return res;
		}
	}, []);

	function updateInstitution(instituteId, payload) {
		return new Promise((resolve, reject) => {
			Service.update(instituteId, payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	return (
		<InstitutionContext.Provider
			value={{
				institution: state.institution,
				loading: state.loading,
				pagination: state.pagination,
				institution_details: state.institution_details,
				listInstitution,
				addInstitution,
				updateInstitution,
				setLoading,
				resetLoading,
				getInstitutionDetails
			}}
		>
			{children}
		</InstitutionContext.Provider>
	);
};
