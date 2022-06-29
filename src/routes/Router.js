import { lazy } from 'react';

// Agency
const AgencyList = lazy(() => import('../modules/agency/list'));
const AgencyDetails = lazy(() => import('../modules/agency/details'));
const AgencyProfile = lazy(() => import('../modules/agency/profile'));

// Beneficiary
const Beneficiary = lazy(() => import('../modules/beneficary'));
const BeneficiaryDetails = lazy(() => import('../modules/beneficary/detail/index'));
const AddBeneficiary = lazy(() => import('../modules/beneficary/add'));
const EditBeneficiary = lazy(() => import('../modules/beneficary/edit'));
const issueBudget = lazy(() => import('../modules/beneficary/detail/issue'));

// Institutions
const InstitutionList = lazy(() => import('../modules/institution'));
const InstitutionDetails = lazy(() => import('../modules/institution/detail/index'));

// Misc
const Dashboard = lazy(() => import('../modules/dashboard/Dashboard'));
const Onboard = lazy(() => import('../modules/onboard'));

// Mobilizer
const Mobilizer = lazy(() => import('../modules/mobilizer'));
const MobilizerDetails = lazy(() => import('../modules/mobilizer/detail/index'));
const EditMobilizer = lazy(() => import('../modules/mobilizer/edit'));
const AddMobilizer = lazy(() => import('../modules/mobilizer/add'));

// Project
const AidList = lazy(() => import('../modules/aid/list'));
const AidDetails = lazy(() => import('../modules/aid/detail'));
const AddProject = lazy(() => import('../modules/aid/add'));
const EditProject = lazy(() => import('../modules/aid/edit'));
const addBudget = lazy(() => import('../modules/aid/detail/addBudget'));
const addCampaign = lazy(()=> import('../modules/aid/detail/addCampaign'));

// Assets
const AddAsset = lazy(() => import('../modules/asset/add'));
const MintAsset = lazy(() => import('../modules/asset/detail'));

// Users
const ListUsers = lazy(() => import('../modules/user/list'));
const AddUser = lazy(() => import('../modules/user/add'));
const UserDetails = lazy(() => import('../modules/user/edit'));

// Kobo tool
const ListKobotool = lazy(() => import('../modules/kobotool/list'));
const KoboToolboxSetting = lazy(() => import('../modules/kobotool/settings'));
const KoboToolboxFormDetails = lazy(() => import('../modules/kobotool/forms/details'));

// Aid connect
const AidConnectList = lazy(() => import('../modules/aid_connect/list'));
const AidConnectCreateForm = lazy(() => import('../modules/aid_connect/create_forms'));

const CampaignList = lazy(() => import ('../modules/campaign'));

// Reporting
const Reporting = lazy(() => import('../modules/reporting'));
const ReportProject = lazy(() => import('../modules/reporting/project_report'));
const ReportBeneficiary = lazy(() => import('../modules/reporting/beneficiary_report'));
const ReportMobilizer = lazy(() => import('../modules/reporting/mobilizer_report'));
const ReportVendor = lazy(() => import('../modules/reporting/vendor_report'));

// Vendor
const Vendor = lazy(() => import('../modules/vendor'));
const VendorDetails = lazy(() => import('../modules/vendor/detail/index'));
const AddVendor = lazy(() => import('../modules/vendor/add'));
const EditVendor = lazy(() => import('../modules/vendor/edit'));

// ------------------------------Vendor UI------------------------------------

const VendorAdd = lazy(() => import('../views/vendors/add'));
const VendorDetail = lazy(() => import('../views/vendors/detail'));

// ------------------------------Notification UI------------------------------------
const NotificationList = lazy(() =>
	import('../modules/notification').then(module => ({ default: module.NotificationList }))
);

// --------------------------------------------------------------------------------

let AppRoutes = [
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
		path: '/edit-beneficiary/:id',
		name: 'Beneficiary',
		icon: 'users',
		component: EditBeneficiary
	},

	{
		path: '/add-beneficiary',
		name: 'Beneficiary',
		icon: 'users',
		component: AddBeneficiary
	},

	{
		path: '/projects/:id',
		name: 'Aid',
		component: AidDetails
	},

	{
		path: '/projects',
		name: 'Projects',
		icon: 'layers',
		component: AidList,
		showInSidebar: true
	},

	{
		path: '/beneficiaries',
		name: 'Beneficiary',
		icon: 'users',
		component: Beneficiary,
		showInSidebar: true
	},

	{
		path: '/mobilizers/:id',
		name: 'Mobilizer',
		component: MobilizerDetails
	},

	{
		path: '/edit-project/:id',
		name: 'Project',
		component: EditProject
	},
	{
		path: '/add-project',
		name: 'Add',
		component: AddProject
	},

	{
		path: '/add-budget/:projectId',
		name: 'addBudget',
		component: addBudget
	},
	{
		path: '/add-campaign/:projectId',
		name: 'addCampaign',
		component: addCampaign
	},

	{
		path: '/issue-budget/:projectId/benf/:benfId',
		name: 'issueBudget',
		component: issueBudget
	},
	// ...........................Asset...........................

	{
		path: '/add-package/:projectId',
		name: 'AddAsset',
		component: AddAsset
	},

	{
		path: '/mint-package/:packageId/project/:projectId',
		name: 'MintAsset',
		component: MintAsset
	},

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
		path: '/vendors/:id',
		name: 'Vendor',
		component: VendorDetails
	},
	{
		path: '/add-vendor',
		name: 'AddVendor',
		component: AddVendor
	},
	{
		path: '/edit-vendor/:id',
		name: 'Vendor',
		component: EditVendor
	},
	{
		path: '/vendors',
		name: 'Vendors',
		icon: 'anchor',
		component: Vendor,
		showInSidebar: true
	},
	{
		path: '/mobilizers',
		name: 'Mobilizers',
		icon: 'git-merge',
		component: Mobilizer,
		showInSidebar: true
	},
	{
		path: '/add-mobilizers',
		name: 'AddMobilizer',
		component: AddMobilizer
	},
	{
		path: '/edit-mobilizer/:id',
		name: 'Mobilizer',
		component: EditMobilizer
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
		path: '/kobo-toolbox-setting',
		name: 'KoboToolboxSetting',
		component: KoboToolboxSetting
	},
	{
		path: '/kobo-toolbox/:id',
		name: 'KoboToolboxFormDetails',
		component: KoboToolboxFormDetails
	},
	{
		path: '/aid-connect/form',
		name: 'AidConnectCreateForm',
		component: AidConnectCreateForm
	},
	{
		path: '/notifications',
		name: 'Notifications',
		component: NotificationList
	},
	{
		path: '/report-project',
		name: 'ReportProject',
		component: ReportProject
	},
	{
		path: '/report-beneficiary',
		name: 'ReportBeneficiary',
		component: ReportBeneficiary
	},
	{
		path: '/report-mobilizer',
		name: 'ReportMobilizer',
		component: ReportMobilizer
	},
	{
		path: '/report-vendor',
		name: 'ReportVendor',
		component: ReportVendor
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
				path: '/reporting',
				name: 'Reporting',
				icon: 'mdi mdi-adjust',
				component: Reporting
			},
			{
				path: '/campaigns',
				name: 'Campaigns',
				icon: 'mdi mdi-adjust',
				component: CampaignList
			},
			{
				path: '/users',
				name: 'Users',
				icon: 'mdi mdi-adjust',
				component: ListUsers
			},
			{
				path: '/kobo-toolbox',
				name: 'KoBoToolbox',
				icon: 'mdi mdi-adjust',
				component: ListKobotool
			},
			{
				path: '/aid-connect',
				name: 'Aid connect',
				icon: 'mdi mdi-adjust',
				component: AidConnectList
			}
		]
	},
	{ path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default AppRoutes;
