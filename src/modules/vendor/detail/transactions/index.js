import React, { useState,useContext,useCallback,useEffect } from 'react';
import classnames from 'classnames';

import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {TRANSACTION_TABS} from '../../../../constants'
import TokenTab from './token';
import PackageTab from './packages'
import { VendorContext } from '../../../../contexts/VendorContext';

const TransactionHistory = props => {
	const { transactions, fetching,vendorId } = props;
	const {getVendorPackageTx} = useContext(VendorContext)
		
	const [fetchingPackageTransaction, setFetchingPackageTransaction] = useState(false);
	const [packageTransactions,setPackageTransactions] = useState([]);
    const [currentHistoryTab,setCurrentHistoryTab] = useState(TRANSACTION_TABS.TOKEN)

    const toggleTabs = tabName => setCurrentHistoryTab(tabName);

	const fetchVendorPackageTransactions = useCallback(async () => {
		try {
			setFetchingPackageTransaction(true);
			const transactions = await getVendorPackageTx(vendorId);
			if (transactions) setPackageTransactions(transactions);
			setFetchingPackageTransaction(false);
		} catch (err) {
			setFetchingPackageTransaction(false);
		}
	}, [getVendorPackageTx, vendorId]);

	useEffect(() => {
		fetchVendorPackageTransactions();
	}, [fetchVendorPackageTransactions]);

	return (
		<div>
			<p className="page-heading">Beneficiary</p>
			<Card>
				<div className="stat-card-body">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: currentHistoryTab === TRANSACTION_TABS.TOKEN })}
								onClick={() => {
									toggleTabs(TRANSACTION_TABS.TOKEN);
								}}
							>
								Tokens
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: currentHistoryTab === TRANSACTION_TABS.PACKAGE })}
								onClick={() => {
									toggleTabs(TRANSACTION_TABS.PACKAGE);
								}}
							>
								Packages
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-2" activeTab={currentHistoryTab === TRANSACTION_TABS.TOKEN ? '1' : '2'}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<TokenTab transactions={transactions} fetching={fetching} />
                                    {/* TOKEN TRANSACTION */}
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="2">
							<Row>
								<Col sm="12">
									<PackageTab transactions={packageTransactions} fetching={fetchingPackageTransaction} />	
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
};

export default TransactionHistory;
