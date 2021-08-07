import { lazy } from 'react';

const Dashboard = lazy(() => import('../modules/dashboard/Dashboard'));
const Beneficiary = lazy(() => import('../modules/beneficary'));

const Vendor = lazy(() => import('../modules/vendor'));
const AgencyList = lazy(() => import('../modules/agency/list'));
const AgencyDetails = lazy(() => import('../modules/agency/details'));
const AidList = lazy(() => import('../modules/aid/list'));
const AidDetails = lazy(() => import('../modules/aid/detail'));
const AddProject = lazy(() => import('../modules/aid/add'));

const AgencyProfile = lazy(() => import('../modules/agency/profile'));
const InstitutionList = lazy(() => import('../modules/institution'));
const InstitutionDetails = lazy(() => import('../modules/institution/detail/index'));
const VendorDetails = lazy(() => import('../modules/vendor/detail/index'));
const BeneficiaryDetails = lazy(() => import('../modules/beneficary/detail/index'));

const Onboard = lazy(() => import('../modules/onboard'));
const ListUsers = lazy(() => import('../modules/user/list'));
const AddUser = lazy(() => import('../modules/user/add'));
const UserDetails = lazy(() => import('../modules/user/edit'));
const BudgetAdd = lazy(() => import('../modules/aid/detail/budgetAdd'));

// ------------------------------Beneficiary UI------------------------------------

const BeneficiaryAdd = lazy(() => import('../views/beneficiaries/add'));
const BeneficiaryDetail = lazy(() => import('../views/beneficiaries/detail'));

// --------------------------------------------------------------------------------

// ------------------------------Vendor UI------------------------------------

const VendorAdd = lazy(() => import('../views/vendors/add'));
const VendorDetail = lazy(() => import('../views/vendors/detail'));

// --------------------------------------------------------------------------------

var AppRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'monitor',
		component: Dashboard,
		showInSidebar: true
	},
	{
		path: '/profile',
		name: 'My Profile',
		icon: 'monitor',
		component: AgencyProfile,
		showInSidebar: false
	},
	{
		path: '/agency',
		name: 'Agency',
		icon: 'umbrella',
		component: AgencyList,
		showInSidebar: false
	},
	{
		path: '/agency-details/:id',
		name: 'Agency',
		component: AgencyDetails
	},
	{
		path: '/beneficiaries/:id',
		name: 'Beneficiary',
		component: BeneficiaryDetails
	},
	{
		path: '/vendors/:id',
		name: 'Vendor',
		component: VendorDetails
	},
	{
		path: '/projects/:id',
		name: 'Aid',
		component: AidDetails
	},
	{
		path: '/add-project',
		name: 'Add',
		component: AddProject
	},
	{
		path: '/projects',
		name: 'Projects',
		icon: 'layers',
		component: AidList,
		showInSidebar: true
	},

	{
		path: '/add_budget/:projectId',
		name: 'BudgetAdd',
		component: BudgetAdd
	},

	//.............................Beneficiary ui......................

	{
		path: '/add_beneficiary',
		name: 'BeneficiaryAdd',
		component: BeneficiaryAdd
	},
	{
		path: '/detail_beneficiary',
		name: 'BeneficiaryDetail',
		component: BeneficiaryDetail
	},
	// -----------------------------------------------------------------

	//.............................Vendor ui......................

	{
		path: '/add_vendor',
		name: 'VendorAdd',
		component: VendorAdd
	},
	{
		path: '/detail_vendor',
		name: 'VendorDetail',
		component: VendorDetail
	},
	// -----------------------------------------------------------------

	{
		path: '/beneficiaries',
		name: 'Beneficiary',
		icon: 'users',
		component: Beneficiary,
		showInSidebar: true
	},
	{
		path: '/vendors',
		name: 'Vendors',
		icon: 'anchor',
		component: Vendor,
		showInSidebar: true
	},
	{
		path: '/add_user',
		name: 'Users',
		component: AddUser
	},
	{
		path: '/:id/users',
		name: 'Users',
		component: UserDetails
	},
	{
		path: '/institutions/:id',
		name: 'Financial Institution',
		component: InstitutionDetails
	},
	{
		path: '/institutions',
		name: 'Financial Institutions',
		icon: 'dollar-sign',
		component: InstitutionList,
		showInSidebar: true
	},
	{
		path: '/onboards',
		name: 'Onboards',
		icon: 'user',
		component: Onboard,
		showInSidebar: false
	},
	{
		collapse: true,
		path: '/dashboard',
		name: 'Administration',
		state: 'admin',
		showInSidebar: false,
		icon: 'lock',
		child: [
			// {
			// 	path: '/settings',
			// 	name: 'Settings',
			// 	mini: 'B',
			// 	icon: 'mdi mdi-adjust',
			// 	component: Settings
			// },
			{
				path: '/users',
				name: 'Users',
				icon: 'mdi mdi-adjust',
				component: ListUsers
			}
		]
	},
	{ path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default AppRoutes;
