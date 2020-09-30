import { lazy } from "react";
const WalletLogin = lazy(() => import("../modules/authentication/Wallet"));
var AuthRoutes = [
  {
    path: "/auth/wallet",
    name: "Login",
    icon: "mdi mdi-account-key",
    component: WalletLogin,
  },
];
export default AuthRoutes;
