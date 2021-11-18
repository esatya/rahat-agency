import React, { useContext } from 'react';
import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import '../../../../assets/css/project.css';
import BreadCrumb from '../../../ui_components/breadcrumb';
import TokenTab from './token/index';
import AssetTab from './asset/index';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { BALANCE_TABS } from '../../../../constants';

export default function BudgetAdd({ match }) {
	const { projectId, benfId } = match.params;

	const { currentBalanceTab, setCurrentBalanceTab } = useContext(AppContext);

	const toggleTabs = tabName => setCurrentBalanceTab(tabName);

	return (
		<div>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path={`beneficiaries/${benfId}`} root_label="Details" current_label="Issue" />
			<Card>
				<div className="stat-card-body">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: currentBalanceTab === BALANCE_TABS.TOKEN })}
								onClick={() => {
									toggleTabs(BALANCE_TABS.TOKEN);
								}}
							>
								Tokens
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: currentBalanceTab === BALANCE_TABS.PACKAGE })}
								onClick={() => {
									toggleTabs(BALANCE_TABS.PACKAGE);
								}}
							>
								Packages
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-2" activeTab={currentBalanceTab === BALANCE_TABS.TOKEN ? '1' : '2'}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<TokenTab benfId={benfId} projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="2">
							<Row>
								<Col sm="12">
									<AssetTab projectId={projectId} benfId={benfId} />
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
}
