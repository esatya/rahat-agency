import React, { useState } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import Logo from '../../assets/images/rahat-logo-blue.png';
// import { TOAST } from '../../constants';
// import { useToasts } from 'react-toast-notifications';

export default function SignUp() {
	// const { addToast } = useToasts();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: ''
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = e => {
		e.preventDefault();

		// const payload = { ...formData };

		setLoading(true);
		// addBeneficiary(payload)
		// 	.then(() => {
		// 		setLoading(false);
		// 		addToast('Account created successfully', TOAST.SUCCESS);
		// 		History.push('/auth/wallet');
		// 	})
		// 	.catch(err => {
		// 		setLoading(false);
		// 		addToast(err.message, TOAST.ERROR);
		// 	});
	};
	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col className="left-content">
					<div className="text-center">
						<img src={Logo} height="200" width="460" alt="rahat logo"></img>
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
						<div className="mt-4">
							<Form onSubmit={handleFormSubmit} style={{ textAlign: 'left', color: 'white' }}>
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
