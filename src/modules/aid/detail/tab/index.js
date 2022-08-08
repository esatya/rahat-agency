import React, {useEffect, useState} from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import BeneficiaryList from './beneficiaryList';
import VendorList from './vendorList';
import MobilizersList from './mobilizersList';

const Tabs = ({ projectId, benefCount, vendorCount, mobilizerCount }) => {
	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	return (
		<div>
			<Card>
				<div className="stat-card-body">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '1' })}
								onClick={() => {
									toggle('1');
								}}
							>
								Beneficiaries {benefCount}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '2' })}
								onClick={() => {
									toggle('2');
								}}
							>
								Vendors {vendorCount}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '3' })}
								onClick={() => {
									toggle('3');
								}}
							>
								Mobilizers {mobilizerCount}
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-4" activeTab={activeTab}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<BeneficiaryList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="2">
							<Row>
								<Col sm="12">
									<VendorList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="3">
							<Row>
								<Col sm="12">
									<MobilizersList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
};

export default Tabs;
