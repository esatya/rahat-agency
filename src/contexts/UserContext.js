import React, { createContext, useReducer } from 'react';
import userReduce from '../reducers/userReducer';
import * as Service from '../services/users';

const initialState = {
	user_info: {},
	dashboardStats: null
};

export const UserContext = createContext(initialState);
export const UserContextProvider = ({ children }) => {
	const [state] = useReducer(userReduce, initialState);

	async function getDashboardStats() {
		let d = await Service.dashboardStats();
		return d;
	}

	function verifyToken(token) {
		return new Promise((resolve, reject) => {
			Service.verifyToken(token)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function loginUsingMetamask(payload) {
		return new Promise((resolve, reject) => {
			Service.loginUsingMetamask(payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function listUsers(params) {
		return Service.listUsers(params);
	}

	function addUser(payload) {
		return Service.addUser(payload);
	}

	return (
		<UserContext.Provider
			value={{
				user_info: state.user_info,
				dashboardStats: state.dashboardStats,
				addUser,
				listUsers,
				verifyToken,
				getDashboardStats,
				loginUsingMetamask
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
