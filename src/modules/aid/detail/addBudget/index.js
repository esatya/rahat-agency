import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import '../../../../assets/css/project.css';
import { AidContext } from '../../../../contexts/AidContext';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import PasscodeModal from '../../../global/PasscodeModal';
import { TOAST } from '../../../../constants';
import BreadCrumb from '../../../ui_components/breadcrumb';
import TokenTab from './token/index';
import AssetTab from './asset/index';

export default function BudgetAdd({ match }) {
	const { addToast } = useToasts();
	const history = useHistory();

	// const urlSearchParams = new URLSearchParams(window.location.search);
	// const urlParams = Object.fromEntries(urlSearchParams.entries());

	const [inputTokens, setInputToken] = useState('');
	const [passcodeModal, setPasscodeModal] = useState(false);

	const { projectId } = match.params;

	const { addProjectBudget } = useContext(AidContext);
	const { wallet, isVerified, setLoading, appSettings } = useContext(AppContext);
	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};
	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const addProjectBalance = useCallback(async () => {
		const { rahat_admin } = appSettings.agency.contracts;
		if (isVerified && wallet) {
			setPasscodeModal(false);
			setLoading(true);
			addProjectBudget({ projectId, supplyToken: inputTokens, rahat_admin, wallet })
				.then(() => {
					setInputToken('');
					setLoading(false);
					addToast(`${inputTokens} tokens added to the project`, TOAST.SUCCESS);
					history.push(`/projects/${projectId}`);
				})
				.catch(err => {
					setLoading(false);
					addToast(err.message, TOAST.ERROR);
				});
		}
	}, [
		addProjectBudget,
		addToast,
		appSettings.agency.contracts,
		history,
		inputTokens,
		isVerified,
		projectId,
		setLoading,
		wallet
	]);

	useEffect(() => {
		addProjectBalance();
	}, [addProjectBalance, isVerified]);

	return (
		<div>
			<PasscodeModal isOpen={passcodeModal} toggleModal={togglePasscodeModal}></PasscodeModal>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Add Budget" />
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
									<TokenTab />
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
