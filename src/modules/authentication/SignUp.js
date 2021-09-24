import React, { useState,useContext,useEffect } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import Logo from '../../assets/images/rahat-logo-blue.png';
import qs from 'query-string';
// import { TOAST } from '../../constants';
// import { useToasts } from 'react-toast-notifications';
import { AppContext } from '../../contexts/AppSettingsContext';
import { UserContext } from '../../contexts/UserContext';

import * as Service from '../../services/appSettings';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../constants';
import { History } from '../../utils/History';


export default function SignUp(props) {
	const { addToast } = useToasts();
	const search = qs.parse(props.location.search);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		wallet_address: search.wallet_address,
		agency:'',
	});
	const {appSettings,getAppSettings} = useContext(AppContext);
	const {signUp} = useContext(UserContext);
	const [loading, setLoading] = useState(false);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		try{
			console.log(appSettings);
		setLoading(true)
		const payload = { ...formData ,agency:appSettings.agency.id};
		const user = await signUp(payload);
		if(user.sucess){
			setLoading(false);
		}
		addToast('Successfully Registered', TOAST.SUCCESS);

	History.push('/auth/login');		
		}
		catch(e){
			addToast(e.error, TOAST.ERROR);
			setLoading(false)
		}

	};
	const loadAppSettings = () => {
		getAppSettings().then()
	};


useEffect(loadAppSettings,[]);

	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col className="left-content">
					<div className="text-center">
					<a href='/'>	<img src={Logo} height="200" width="460" alt="rahat logo"></img>
            </a>
						<div style={{ width: '410px' }}>
							<p className="description">
								Supporting vulnerable communities with a simple and efficient relief distribution platform.
							</p>
						</div>
					</div>
				</Col>
				<Col className="right-content">
					<div className="text-center">
						<p className="text-title">Rahat Agency App</p>
						<p className="text-subheader">Create an account</p>
						<div className="mt-4 m-n1">
							<Form onSubmit={handleFormSubmit} style={{ textAlign: 'left', color: 'white' }}>
							<FormGroup>
									<Label>Wallet</Label>
									<Input type="text" bsSize='sm' value={formData.wallet_address} name="name" onChange={handleInputChange} readOnly required />
								</FormGroup>
								<FormGroup>
									<Label>Name</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>
								<FormGroup>
									<Label>Email</Label>
									<Input type="email" value={formData.email} name="email" onChange={handleInputChange} />
								</FormGroup>
								<FormGroup>
									<Label>Phone</Label>
									<Input type="number" value={formData.phone} name="phone" onChange={handleInputChange} required />
								</FormGroup>
								{loading ? (
									<Button type="button" disabled={true} className="btn btn-info mt-4" style={{ width: '100%' }}>
										Creating, Please wait...
									</Button>
								) : (
									<Button type="submit" className="btn btn-info mt-4" style={{ width: '100%' }}>
										SUBMIT
									</Button>
								)}
							</Form>
						</div>
					</div>
					<p className="text-copyright">Copyright © 2021 Rumsan Group of Companies | All Rights Reserved.</p>
				</Col>
			</Row>
		</>
	);
}
