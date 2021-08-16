import React, { useEffect, useState, useContext, useCallback } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import BeneficiaryList from './beneficiaryList';
import VendorList from './vendorList';
import { AidContext } from '../../../../contexts/AidContext';

const Tabs = ({ projectId }) => {
	const { beneficiaryByAid, beneficiary_list } = useContext(AidContext);

	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	const fetchData = useCallback(async () => {
		await beneficiaryByAid(projectId);
	}, [beneficiaryByAid, projectId]);

	useEffect(() => {
		console.log('Effect...');
		fetchData();
	}, [fetchData]);

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
								Beneficiaries List
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '2' })}
								onClick={() => {
									toggle('2');
								}}
							>
								Vendor List
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-4" activeTab={activeTab}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<BeneficiaryList beneficiaries={beneficiary_list} projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="2">
							<Row>
								<Col sm="12">
									<VendorList />
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
