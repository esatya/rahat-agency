import { lazy } from 'react';
const WalletLogin = lazy(() => import('../modules/authentication/Wallet'));
const SignUp = lazy(() => import('../modules/authentication/SignUp'));
const Approval = lazy(() => import('../modules/authentication/Approval'));


var AuthRoutes = [
	{
		path: '/auth/wallet',
		name: 'Login',
		icon: 'mdi mdi-account-key',
		component: WalletLogin
	},
	{
		path: '/sign_up',
		name: 'SignUp',
		component: SignUp
	},
	{
		path: '/approval',
		name: 'Approval',
		component: Approval
	}
];
export default AuthRoutes;
