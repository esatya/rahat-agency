import React, { useState, useCallback } from 'react';
import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import '../../../../assets/css/project.css';
import PasscodeModal from '../../../global/PasscodeModal';
import BreadCrumb from '../../../ui_components/breadcrumb';
import TokenTab from './token/index';
import AssetTab from './asset/index';

export default function BudgetAdd({ match }) {
	const [passcodeModal, setPasscodeModal] = useState(false);

	const { projectId, benfId } = match.params;

	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};
	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	return (
		<div>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path={`beneficiaries/${benfId}`} root_label="Details" current_label="Issue" />
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
								Tokens
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '2' })}
								onClick={() => {
									toggle('2');
								}}
							>
								Packages
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-2" activeTab={activeTab}>
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
									<AssetTab projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
}
