import React, { createContext, useReducer, useCallback } from 'react';
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

	function signUp(payload) {
		return new Promise((resolve, reject) => {
			Service.signUp(payload)
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

	const listUsers = useCallback(params => {
		return Service.listUsers(params);
	}, []);

	function addUser(payload) {
		return Service.addUser({ ...payload });
	}

	function updateUser(userId, payload) {
		return Service.updateUser(userId, payload);
	}

	function checkExistingUser(payload) {
		return Service.checkExistingUser(payload);
	}

	function getUserById(userId) {
		return Service.getUserById(userId);
	}

	function updateRole(data) {
		return Service.updateRole({ ...data });
	}

	function deleteRole(userId, role) {
		return Service.deleteRole({ userId, role });
	}

	function listUsersByRole(role) {
		return Service.listUsersByRole(role);
	}

	return (
		<UserContext.Provider
			value={{
				user_info: state.user_info,
				dashboardStats: state.dashboardStats,
				listUsersByRole,
				updateRole,
				deleteRole,
				updateUser,
				getUserById,
				addUser,
				listUsers,
				verifyToken,
				checkExistingUser,
				getDashboardStats,
				loginUsingMetamask,
				signUp
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
