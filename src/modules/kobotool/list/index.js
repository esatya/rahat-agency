import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CardTitle, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { AppContext } from '../../../contexts/AppSettingsContext';

import { History } from '../../../utils/History';
import { TOAST } from '../../../constants';

import Forms from '../forms';
import Loading from '../../global/Loading';

const List = () => {
	const { getKobotoolboxForms } = useContext(AppContext);
	const { addToast } = useToasts();

	const [searchName, setSearchName] = useState('');
	const [formData, setFormData] = useState([]);

	const handleChangeSettingClick = () => History.push('/kobo-toolbox-setting');

	const handleSearchInputChange = e => setSearchName(e.target.value);

	const fetchUserList = () => {
		let query = {};
		if (searchName) query.name = searchName;
		getKobotoolboxForms(query)
			.then(res => {
				console.log('data', res);
				setFormData(res);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	useEffect(fetchUserList, [searchName]);

	return (
		<>
			<Card>
				<CardTitle className="mb-0 pt-3">
					<span style={{ paddingLeft: 26 }}>Kobo Toolbox</span>
				</CardTitle>
				<CardTitle className="mb-0 p-3">
					<div className="toolbar-flex-container">
						<div style={{ flex: 1, padding: 10 }}>
							<input
								style={{ width: '40%' }}
								className="custom-input-box"
								value={searchName || ''}
								onChange={handleSearchInputChange}
								placeholder="Search by name..."
							/>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="flex-item">
								<Button type="button" onClick={handleChangeSettingClick} className="btn" color="info">
									Change setting
								</Button>
							</div>
						</div>
					</div>
				</CardTitle>
				<div style={{ paddingLeft: 26, paddingRight: 26 }}>
					<Row>
						{formData.length ? (
							formData.map(d => {
								return (
									<Col md="4">
										<Link to={`/kobo-toolbox/${d.asset_id}`}>
											<Forms name={d.asset_name} />
										</Link>
									</Col>
								);
							})
						) : (
							<div style={{ marginLeft: 30, marginBottom: 30 }}>
								<Loading />
							</div>
						)}
					</Row>
				</div>
			</Card>
		</>
	);
};

export default List;
